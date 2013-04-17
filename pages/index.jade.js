require("./../client/vendor/index.js");

config = require("config")

runtime = {};

var Router = require("./../client/index.js");

runtime.router = new Router();
Backbone.history.start({pushState: false, trigger: true});

$("pre").addClass("highlight");
$.SyntaxHighlighter.init({"lineNumbers": false});