'use strict';
exports.__esModule = true;
var Project_1 = require('./Project');
var TimeData = /** @class */ (function () {
  function TimeData() {
    this.editor_seconds = 0;
    this.session_seconds = 0;
    this.file_seconds = 0;
    this.day = '';
    this.project = new Project_1['default']();
  }
  return TimeData;
})();
exports['default'] = TimeData;
