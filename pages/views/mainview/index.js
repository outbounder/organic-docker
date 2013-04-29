var DetailsView = require("./details");
var CommentBlock = require("../../../client/models/CommentBlock");
var OrganelDoc = require("../../../client/models/OrganelDoc");

module.exports = Backbone.View.extend({
  template: require("./index.jade"),
  organelTemplate: require("./organel.jade"),

  events: {
    "click .introMeBtn": "startInto"
  },
  startInto: function(){
    var introData = require("./index-intro-data.json");
    for(var i = 0; i<introData.length; i++) {
      var data = introData[i];
      this.$(data.selector).attr("data-intro", data.text)
      this.$(data.selector).attr("data-step", i);
    }
    require("Intro.js").introJs().start();
  },
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
    this.bindDetailsPopup(".organelContainer a");
    return this;
  }
});