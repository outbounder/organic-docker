var Organel = require("organic").Organel;
var async = require("async");
var fs = require("fs");
var glob = require("glob");
var _ = require("underscore");

var OrganelModel = require("../dna/models/Organel");

/* organel | DockerOrganelles

# The organelle is responsible for 
 
1. scanning 

  It is scanning for Organelles (javascript files to contain `organel |` charsequence)

2. analyzing a directory of javascript files.

  It is analyzing all found entries from scanning and renders a collection of models dna/models/Organel

3. reading and analyzing a single File

*/
module.exports = Organel.extend(function DockerOrganelles(plasma, config, parent){
  Organel.call(this, plasma, config, parent);

  /* incoming | DockerOrganelles
  
  * `action` - different values
  
    required, can have one of the values specified bellow

    * `scanForOrganelles` - instructs searching for organelles upon 
    given `target` path

    * `scan&analyze` - instructs searching and analyzing organelles, 
    returning dna/models/Organel based collection

    * `analyzeFile` - instructs reading and analyzing only one file. returns dna/model/Organel instance as data field

  * `target` - depends on `action`
    
    * when `action` equals "scanForOrganelles" => target is the directory to be scanned for Organlles returns Array of Objects {file: "", source: ""}

    * when `action` equals "analyzeFile" => target is the file to be analyzed

    * when `action` equals "scan&analyze" => target is the directory to be scanned and then analyzed by returning Array of dna/model/Organel instances
  */
  this.on("DockerOrganelles", function(c, sender, callback){
    this[c.action](c, sender, callback);
  });
}, {
  "scanForOrganelles": function(c, sender, callback){
    glob(c.target+"/**/*.js", function(err, files){
      if(err) return callback(err);

      async.map(files, function(file, next){
        if(file.indexOf("node_modules") !== -1) return next(null, null);
        fs.readFile(file, function(err, source){
          if(err) return next(null, null); // ignore read errors
          source = source.toString();
          if(source.indexOf("organel | ") !== -1)
            return next(null, {file: file, source: source});
          else 
            return next(null, null);
        })
      }, function(err, organelles){
        if(err) callback(err);
        var result = _.compact(organelles);
        callback({data: result});
      })
    })
  },
  "analyzeFile": function(c, sender, callback) {
    fs.readFile(c.target, function(err, fileData){
      if(err) return callback(err);
      var organel = new OrganelModel({
        file: c.target,
        source: fileData.toString()
      });
      organel.selfAnalyze(function(err){
        if(err) return callback(err);
        callback({data: organel});
      })
    })
  },
  "scan&analyze": function(c, sender, callback) {
    var self = this;
    this.scanForOrganelles(c, sender, function(c){
      if(c instanceof Error) return callback(c);
      async.map(c.data, function(organelData, next){
        var organelModel = new OrganelModel(organelData);
        organelModel.selfAnalyze(function(err){
          if(err) return next(null, null);
          next(null, organelModel);
        });
      }, function(err, organelles){
        organelles = _.compact(organelles);
        callback({data: organelles});
      })
    })
  }
})