var DetailsView = require("./details");
var CommentBlock = require("../../models/CommentBlock");

module.exports = Backbone.View.extend({
  template: require("./index.jade"),
  render: function(){
    var self = this;
    this.$el.find("a").click(function(e){
      e.preventDefault();
      var view = new DetailsView({
        model: new CommentBlock({
          file: $(this).attr("data-file"),
          content: $(this).attr('data-details'),
          name: $(this).attr('data-name'),
          commentBlock: $(this).attr('data-commentBlock')
        })
      });
      view.render();
      return false;
    })
    return this;
  }
});