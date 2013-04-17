var fs = require('fs');
var path = require("path");
var jade = require("jade");

module.exports = function(client, config) {

  client.bundle.require(__dirname+"/../client/config/"+process.env.CELL_MODE+".json", {expose: "config"});

  client.bundle.transform(function(file){
    if (!/\.jade$/.test(file)) return client.through();

    var buffer = "";

    return client.through(function(chunk) {
      buffer += chunk.toString();
    },
    function() {
      var compiled = "module.exports = " + jade.compile(buffer.toString(),{
        filename: file,
        client: true
      }).toString() + "\n";
      this.queue(compiled);
      this.queue(null);
    });
  });
}