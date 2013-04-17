module.exports = Backbone.View.extend({
  template: require("./index.jade"),
  editTemplate: require("./edit.jade"),

  events: {
    "dblclick .modal-body": "switchToEditMode",
    "click .btnCancelEdit": "switchToNormalMode",
    "click .btnSaveEdit": "saveEdits"
  },

  saveEdits: function(e){
    this.model.replaceCommentBlock(this.editor.exportFile()).success(function(){
      alert("done");
    }).error(function(err){
      alert(err);
    })
  },

  switchToEditMode: function(e){
    e.preventDefault();
    if(this.model.get("commentBlock"))
      this.renderEditMode();
  },

  switchToNormalMode: function(e){
    e.preventDefault();
    this.editor.unload();
    this.editor = null;
    this.render();
  },

  remove: function(){
    if(this.editor) {
      this.editor.unload();
      this.editor = null;
    }
    Backbone.View.prototype.remove.call(this);
  },

  renderEditMode: function(){
    this.$el.html(this.editTemplate({
      name: this.model.get("name")
    }));

    this.editor = new EpicEditor(_.extend(defaultEpicEditorOptions, {
      clientSideStorage: false,
      file:{
        defaultContent: this.model.get("commentBlock")
      }
    })).load();
    return this;
  },

  render: function(){
    var self = this;
    this.$el.html(this.template({
      content: this.model.get("content"),
      name: this.model.get("name")
    }));
    $(this.$el).bPopup({
      follow: [false,false],
      onClose: function(){
        self.trigger("close");
        self.remove();
      }
    }).center().find("pre").addClass("highlight").syntaxHighlight();
    return this;
  }
})