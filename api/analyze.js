var path = require("path");
module.exports = function(config){
  var plasma = this.plasma;
  return {
    "POST": function(req, res) {
      plasma.emit({
        type: "DockerOrganelles",
        action: "analyzeFile",
        target: path.join(process.cwd(),req.body.file)
      }, function(c){
        if(c instanceof Error) return res.error(c);
        res.result(c.data);
      })  
    }
  }
}