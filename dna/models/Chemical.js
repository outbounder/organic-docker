var $ = require("jquery");

var md_parser = require("node-markdown").Markdown;
var path = require("path");

module.exports = function(file, commentBlock){
  var $html = $("<html>"+md_parser(commentBlock)+"</html>");
  var self = this;
  self['dna'] = [];
  self['file'] = file;
  this["name"] = $html.find("p:first").html().split("|").pop();
  this["details"] = $html.html();
  this["commentBlock"] = commentBlock;
  $html.find("ul:first").children("li").each(function(){
    $li = $(this);
    var attributeDefinition = $li.find("p:first").text();
    if(!attributeDefinition)
      attributeDefinition = $li.text();
    var attributeDelimiter = attributeDefinition.indexOf(":") !== -1?":":"-";
    self['dna'].push({
      nestedLevel: 0,
      keyName: attributeDefinition.split(attributeDelimiter).shift(),
      keyDefaultValue: attributeDefinition.split(attributeDelimiter).pop(),
      details: $li.html()
    })
  });
  this['file'] = path.relative(process.cwd(), this['file']);
}