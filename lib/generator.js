var fs = require('fs');
var async = require('async');
var shelljs = require("shelljs");

module.exports = function(targetDir, plasma) {
  shelljs.mkdir('-p', targetDir);

  plasma.emit({
    type: "DockerOrganelles",
    action: "scan&analyze",
    target: process.cwd()+"/**/*.js",
    targetPattern: 'require("organic").Organel',
    excludePattern: "node_modules"
  }, this, function(c){

    async.parallel([
      function(next){
        plasma.emit({
          type: "RenderPage",
          organelles: c.data,
          page: __dirname+"/../pages/index.jade"
        }, function(page){
          fs.writeFile(targetDir+"/index.html", page.data, next);
        })
      },
      function(next){
        plasma.emit({
          type: "BundleCode",
          code: __dirname+"/../pages/index.jade.js"
        }, function(code){
          fs.writeFile(targetDir+"/code.js", code.data, next);
        })
      },
      function(next){
        plasma.emit({
          type: "BundleStyle",
          style: __dirname+"/../pages/index.jade.less"
        }, function(style){
          fs.writeFile(targetDir+"/style.css", style.data, next);
        })
      },
      function(next){
        shelljs.cp('-r', __dirname+"/../style/epiceditor", targetDir);
        shelljs.cp('-r', __dirname+"/../style/img", targetDir);
        shelljs.cp('-r', __dirname+"/../public/", targetDir);
        next();
      }
    ], function(err){
      if(err) return console.log(err);
      console.log("Done.");
    })
  });
}