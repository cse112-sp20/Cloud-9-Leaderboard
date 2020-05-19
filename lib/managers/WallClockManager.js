"use strict";
exports.__esModule = true;
exports.WallClockManager = void 0;
var Util_1 = require("../Util");
var vscode_1 = require("vscode");
var SessionSummaryData_1 = require("../storage/SessionSummaryData");
var TimeSummaryData_1 = require("../storage/TimeSummaryData");
var KpmManager_1 = require("./KpmManager");
var SECONDS_INTERVAL = 30;
var CLOCK_INTERVAL = 1000 * SECONDS_INTERVAL;
var WallClockManager = /** @class */ (function () {
    function WallClockManager() {
        this._wctime = 0;
        this.initTimer();
    }
    WallClockManager.getInstance = function () {
        if (!WallClockManager.instance) {
            WallClockManager.instance = new WallClockManager();
        }
        return WallClockManager.instance;
    };
    WallClockManager.prototype.initTimer = function () {
        var _this = this;
        var kpmMgr = KpmManager_1.KpmManager.getInstance();
        this._wctime = Util_1.getItem("wctime") || 0;
        setInterval(function () {
            // If the window is focused
            if (vscode_1.window.state.focused || kpmMgr.hasKeystrokeData()) {
                // set the wctime (deprecated, remove one day when all plugins use time data info)
                _this._wctime = Util_1.getItem("wctime") || 0;
                _this._wctime += SECONDS_INTERVAL;
                Util_1.setItem("wctime", _this._wctime);
                // update the file info file
                TimeSummaryData_1.incrementEditorSeconds(SECONDS_INTERVAL);
            }
            // dispatch to the various views (statusbar and treeview)
            _this.dispatchStatusViewUpdate();
        }, CLOCK_INTERVAL);
    };
    WallClockManager.prototype.dispatchStatusViewUpdate = function () {
        // update the status bar
        SessionSummaryData_1.updateStatusBarWithSummaryData();
        // update the code time metrics tree views
        vscode_1.commands.executeCommand("codetime.refreshKpmTree");
    };
    WallClockManager.prototype.getHumanizedWcTime = function () {
        return Util_1.humanizeMinutes(this._wctime / 60);
    };
    WallClockManager.prototype.getWcTimeInSeconds = function () {
        return this._wctime;
    };
    return WallClockManager;
}());
exports.WallClockManager = WallClockManager;
