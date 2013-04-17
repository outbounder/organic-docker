var Organel = require("organic").Organel;
var async = require("async");
var fs = require("fs");
var glob = require("glob");
var _ = require("underscore");

var OrganelModel = require("../dna/models/Organel");

/* organel | DockerOrganelles

The organelle is responsible for 1) scanning and 2) analyzing a directory of javascript files.
It is scanning for Organelles (javascript files to contain `Organel` keyword)
It is analyzing all found entries from scanning and renders a collection of models dna/models/Organel

The organelle is useful for code documentation generation.

  * emitAnalyzed - emit the analyzed organelles
    
    Refer to outgoing chemical Scan&AnalyzedDockerOrganelles

  * somethingElseConfig - default value

*/

/* outgoing | Scan&AnalyzedDockerOrganelles

  * data - Array of dna/models/Organel 

    Collection of dna/models/Organel instances

*/
module.exports = Organel.extend(function DockerOrganelles(plasma, config, parent){
  Organel.call(this, plasma, config, parent);

  /* incoming | DockerOrganelles
  
  * `action` - `scanForOrganelles` || `scan&analyze`
  
    required, can have one of the values specified above

    * `scanForOrganelles` - instructs searching for organelles upon 
    given `target` path

    * `scan&analyze` - instructs searching and analyzing organelles, 
    returning dna/models/Organel based collection

  * `target` - directory to be scanned for organelles
    
    required, active only when "scanForOrganelles" is set for `action`

    returns Array of Objects {file: "", source: ""}

  * `data` - Array of Objects {file: "", source: ""}
    
    required, active only when "scan&analyze" is set for `action`
  */
  this.on("DockerOrganelles", function(c, sender, callback){
    this[c.action](c, sender, callback);
  });

  /* incoming | DockerOrganelles2
  
  # this is intentionally left here as reserved.

  */
  this.on("DockerOrganelles2", function(c, sender, callback){
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
        
        if(self.config.emitAnalyzed)
          self.emit({
            type: "Scan&AnalyzedDockerOrganelles",
            data: organelles
          })
      })
    })
  }
})