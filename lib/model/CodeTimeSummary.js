"use strict";
exports.__esModule = true;
var CodeTimeSummary = /** @class */ (function () {
    function CodeTimeSummary() {
        // this is the editor session minutes
        this.activeCodeTimeMinutes = 0;
        // this is the total focused editor minutes
        this.codeTimeMinutes = 0;
        // this is the total time spent coding on files
        this.fileTimeMinutes = 0;
    }
    return CodeTimeSummary;
}());
exports["default"] = CodeTimeSummary;
