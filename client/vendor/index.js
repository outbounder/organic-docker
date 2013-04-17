require("./jquery");

_ = require("./underscore");
Backbone = require("./backbone");
moment = require("./moment");

require("./bootstrap.min");
require("./epiceditor/epiceditor");

defaultEpicEditorOptions = {
  theme: {
    base: '/themes/base/epiceditor.css',
    preview: '/themes/preview/github.css',
    editor: '/themes/editor/epic-light.css'
  }
}