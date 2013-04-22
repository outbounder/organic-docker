process.env.CELL_MODE = process.env.NODE_ENV || process.env.CELL_MODE || "development";

var generateDocumentation = require("./lib/generator");

var cwd = process.cwd();
process.chdir(__dirname); 

var WebCell = require("organic-webcell/WebCell");
var instance = new WebCell(null, function(){
  instance.plasma.on("ExpressHttpPages", function(){
    process.chdir(cwd);

    if(process.argv[2] == "--html") {
      var targetDir = process.argv[3];
      generateDocumentation(targetDir, instance.plasma);
    }
  })
});