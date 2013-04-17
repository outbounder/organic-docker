var Mainview = require("./views/mainview");

module.exports = Backbone.Router.extend({

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