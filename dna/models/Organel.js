var _ = require("underscore");
var path = require("path");
var esprima = require("esprima");
var util = require('util');

var Chemical = require("./Chemical");

module.exports = function(data){
  this["in"] = [];
  this["out"] = [];
  this["parent"] = "";
  this["name"] = "";
  this["file"] = "";
  this["source"] = "";
  this["dna"] = [];
  _.extend(this, data);
}

module.exports.prototype.selfAnalyze = function(next){
  this.name = path.basename(this.file, path.extname(this.file));
  this.parent = path.basename(path.dirname(this.file));
  try {
    var ast = esprima.parse(this.source, {comment: true});
    for(var i = 0; i<ast.comments.length; i++) {
      var commentBlock = ast.comments[i].value;
      if(commentBlock.indexOf("incoming |") !== -1) 
        this["in"].push(new Chemical(this.file, commentBlock));
      if(commentBlock.indexOf("outgoing |") !== -1) 
        this["out"].push(new Chemical(this.file, commentBlock));
      if(commentBlock.indexOf("organel |") !== -1) {
        var chem = new Chemical(this.file, commentBlock);
        this["dna"] = chem.dna;
        this["details"] = chem.details;
        this["commentBlock"] = commentBlock;
      }
    }
  } catch(err){
    console.log(err, this.file);
  }
  next();
}