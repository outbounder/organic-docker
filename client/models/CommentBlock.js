module.exports = Backbone.Model.extend({
  url: "/replace",
  replaceCommentBlock: function(newContent) {
    return this.save({
      newContent: newContent,
      file: this.get("file"),
      oldContent: this.get("commentBlock")
    });
  }
})