var DetailsView = require("./details");
var CommentBlock = require("../../models/CommentBlock");
var OrganelDoc = require("../../models/OrganelDoc");

module.exports = Backbone.View.extend({
  template: require("./index.jade"),
  organelTemplate: require("./organel.jade"),

  update: function(file){
    var self = this;
    var doc = new OrganelDoc();
    doc.save({file: file}).success(function(){
      self.renderOrganelDetails(file, doc);
    })
  },
  renderOrganelDetails: function(file, model){
    this.$el.find(".organelContainer[data-file='"+file+"']").html(this.organelTemplate({
      organel: model.toJSON().result
    }))
    this.bindDetailsPopup(".organelContainer[data-file='"+file+"'] a");
  },
  bindDetailsPopup: function(selector){
    var self = this;
    this.$el.find(selector).click(function(e){
      e.preventDefault();
      var view = new DetailsView({
        model: new CommentBlock({
          file: $(this).attr("data-file"),
          content: $(this).attr('data-details'),
          name: $(this).attr('data-name'),
          commentBlock: $(this).attr('data-commentBlock')
        })
      });
      view.render().on("saved", function(file){
        view.close();
        self.update(file);
      })
      return false;
    })
  },
  render: function(){
    var self = this;
    this.bindDetailsPopup("a");
    return this;
  }
});