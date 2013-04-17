/// ugly monkey-patching

jade.utils.merge = function(a, b) {
  for (var key in b) a[key] = b[key];
  return a;
};

jade.runtime.rethrow = function rethrow(err, filename, lineno){
  if (!filename) throw err;

  var context = 3
    , str = ""//require(filename)
    , lines = str.split('\n')
    , start = Math.max(lineno - context, 0)
    , end = Math.min(lines.length, lineno + context);

  // Error context
  var context = lines.slice(start, end).map(function(line, i){
    var curr = i + start + 1;
    return (curr == lineno ? '  > ' : '    ')
      + curr
      + '| '
      + line;
  }).join('\n');

  // Alter exception message
  err.path = filename;
  err.message = (filename || 'Jade') + ':' + lineno
    + '\n' + context + '\n\n' + err.message;
  throw err;
};

jade.Parser.prototype.parseInclude = function(){
  var path = require("path");
  var dirname = path.dirname;
  var basename = path.basename;
  var join = path.join;
  
  var path = this.expect('include').val.trim();
  var dir = dirname(this.filename);

  // no extension
  if (!~basename(path).indexOf('.')) {
    path += '.jade';
  }
  
  var path = join(dir, path);
  var str = require("./"+path, dir);
  var parser = new jade.Parser(str, path, this.options);
  parser.blocks = jade.utils.merge({}, this.blocks);
  parser.mixins = this.mixins;

  this.context(parser);
  var ast = parser.parse();
  this.context();
  ast.filename = path;

  if ('indent' == this.peek().type) {
    ast.includeBlock().push(this.block());
  }

  return ast;
};
