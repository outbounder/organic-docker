module.exports = function(config) {
  var plasma = this.plasma;
  return {
    "GET" : function(req, res) {
      plasma.emit({
        type: "DockerOrganelles",
        action: "scan&analyze",
        target: process.cwd()+"/**/*.js",
        targetPattern: 'require("organic").Organel',
        excludePattern: "node_modules"
      }, this, function(c){
        res.sendPage({organelles: c.data});
      });
    }
  }
}