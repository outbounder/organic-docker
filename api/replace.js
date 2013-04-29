var fs = require('fs');
var path = require("path");
module.exports = function(config) {
  return {
    "POST": function(req, res){
      var file = path.join(process.cwd(),req.body.file);
      if(file && req.body.newContent && req.body.oldContent) {
        if(req.body.newContent == req.body.oldContent)
          return res.error("nothing changed");
        fs.readFile(file, function(err, data){
          if(err) return res.err(err);
          data = data.toString().replace(req.body.oldContent, req.body.newContent);
          fs.writeFile(file, data, function(err){
            if(err) return res.err(err);
            res.result(true);
          })
        })
      }
    }
  }
}