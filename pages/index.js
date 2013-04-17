module.exports = function(config) {
  var plasma = this.plasma;
  return {
    "GET" : function(req, res) {
      plasma.emit({
        type: "DockerOrganelles",
        action: "scan&analyze",
        target: process.cwd()
      }, this, function(c){
        res.sendPage({organelles: c.data});
      });
    }
  }
}