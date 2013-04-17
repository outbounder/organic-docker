module.exports = Backbone.Model.extend({
  url: "/commentblock",
  replaceCommentBlock: function(newContent) {
    return this.save({
      newContent: newContent,
      file: this.get("file"),
      oldContent: this.get("commentBlock")
    });
  }
})