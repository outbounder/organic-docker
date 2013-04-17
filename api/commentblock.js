var fs = require('fs');
module.exports = function(config) {
  return {
    "POST": function(req, res){
      if(req.body.file && req.body.newContent && req.body.oldContent) {
        if(req.body.newContent == req.body.oldContent)
          return res.error("nothing changed");
        fs.readFile(req.body.file, function(err, data){
          if(err) return res.err(err);
          data = data.toString().replace(req.body.oldContent, req.body.newContent);
          fs.writeFile(req.body.file, data, function(err){
            if(err) return res.err(err);
            res.result(true);
          })
        })
      }
    }
  }
}