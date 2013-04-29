require("./vendor/index.js");

config = require("config")

runtime = {};

var Mainview = require("./views/mainview");

var Router = Backbone.Router.extend({

  routes: {
    "": "landing"
  },

  landing: function(){
    var view = new Mainview({
      el: $(".container")
    });
    view.render();
  }
});

runtime.router = new Router();
Backbone.history.start({pushState: false, trigger: true});

$("pre").addClass("highlight");
$.SyntaxHighlighter.init({"lineNumbers": false});

$(function(){
  $("").click(function(){
    
  })  
})
