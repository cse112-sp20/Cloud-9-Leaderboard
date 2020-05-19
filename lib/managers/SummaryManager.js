"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.SummaryManager = void 0;
var Util_1 = require("../Util");
var FileChangeInfoSummaryData_1 = require("../storage/FileChangeInfoSummaryData");
var SessionSummaryData_1 = require("../storage/SessionSummaryData");
var TimeSummaryData_1 = require("../storage/TimeSummaryData");
var HttpClient_1 = require("../http/HttpClient");
var FileManager_1 = require("./FileManager");
// every 1 min
var DAY_CHECK_TIMER_INTERVAL = 1000 * 60;
var SummaryManager = /** @class */ (function () {
    function SummaryManager() {
        this._dayCheckTimer = null;
        this._currentDay = null;
        this.init();
    }
    SummaryManager.getInstance = function () {
        if (!SummaryManager.instance) {
            SummaryManager.instance = new SummaryManager();
        }
        return SummaryManager.instance;
    };
    SummaryManager.prototype.init = function () {
        var _this = this;
        // fetch the current day from the sessions.json
        this._currentDay = Util_1.getItem('currentDay');
        // start timer to check if it's a new day or not
        this._dayCheckTimer = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                SummaryManager.getInstance().newDayChecker();
                return [2 /*return*/];
            });
        }); }, DAY_CHECK_TIMER_INTERVAL);
        setTimeout(function () {
            _this.newDayChecker();
        }, 1000);
    };
    SummaryManager.prototype.dispose = function () {
        if (this._dayCheckTimer) {
            clearInterval(this._dayCheckTimer);
        }
    };
    /**
     * Check if its a new day, if so we'll clear the session sumary and
     * file change info summary, then we'll force a fetch from the app
     */
    SummaryManager.prototype.newDayChecker = function () {
        return __awaiter(this, void 0, void 0, function () {
            var nowTime;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!Util_1.isNewDay()) return [3 /*break*/, 3];
                        SessionSummaryData_1.clearSessionSummaryData();
                        // send the offline data
                        return [4 /*yield*/, FileManager_1.sendOfflineData(true)];
                    case 1:
                        // send the offline data
                        _a.sent();
                        // clear the last save payload
                        FileManager_1.clearLastSavedKeystrokeStats();
                        // send the offline TimeData payloads
                        return [4 /*yield*/, FileManager_1.sendOfflineTimeData()];
                    case 2:
                        // send the offline TimeData payloads
                        _a.sent();
                        // clear the wctime for other plugins that still rely on it
                        Util_1.setItem('wctime', 0);
                        FileChangeInfoSummaryData_1.clearFileChangeInfoSummaryData();
                        nowTime = Util_1.getNowTimes();
                        this._currentDay = nowTime.day;
                        // update the current day
                        Util_1.setItem('currentDay', this._currentDay);
                        // update the last payload timestamp
                        Util_1.setItem('latestPayloadTimestampEndUtc', 0);
                        setTimeout(function () {
                            _this.updateSessionSummaryFromServer();
                        }, 5000);
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * This is only called from the new day checker
     */
    SummaryManager.prototype.updateSessionSummaryFromServer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var jwt, result, data_1, summary_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        jwt = Util_1.getItem('jwt');
                        return [4 /*yield*/, HttpClient_1.softwareGet("/sessions/summary?refresh=true", jwt)];
                    case 1:
                        result = _a.sent();
                        if (HttpClient_1.isResponseOk(result) && result.data) {
                            data_1 = result.data;
                            summary_1 = SessionSummaryData_1.getSessionSummaryData();
                            Object.keys(data_1).forEach(function (key) {
                                var val = data_1[key];
                                if (val !== null && val !== undefined) {
                                    summary_1[key] = val;
                                }
                            });
                            // if the summary.currentDayMinutes is greater than the wall
                            // clock time then it means the plugin was installed on a
                            // different computer or the session was deleted
                            TimeSummaryData_1.updateSessionFromSummaryApi(summary_1.currentDayMinutes);
                            SessionSummaryData_1.saveSessionSummaryToDisk(summary_1);
                        }
                        SessionSummaryData_1.updateStatusBarWithSummaryData();
                        return [2 /*return*/];
                }
            });
        });
    };
    return SummaryManager;
}());
exports.SummaryManager = SummaryManager;
