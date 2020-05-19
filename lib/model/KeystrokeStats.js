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
var Util_1 = require("../Util");
var PayloadManager_1 = require("../managers/PayloadManager");
var KeystrokeStats = /** @class */ (function () {
    function KeystrokeStats(project) {
        this.keystrokes = 0;
        this.start = 0;
        this.local_start = 0;
        this.end = 0;
        this.local_end = 0;
        this.cumulative_editor_seconds = 0;
        this.cumulative_session_seconds = 0;
        this.elapsed_seconds = 0;
        this.workspace_name = "";
        this.hostname = "";
        this.project_null_error = "";
        this.source = {};
        this.keystrokes = 0;
        this.project = project;
        this.pluginId = Util_1.getPluginId();
        this.version = Util_1.getVersion();
        this.os = Util_1.getOs();
        this.repoContributorCount = 0;
        this.repoFileCount = 0;
        this.keystrokes = 0;
        this.cumulative_editor_seconds = 0;
        this.cumulative_session_seconds = 0;
        this.elapsed_seconds = 0;
        this.project_null_error = "";
        this.hostname = "";
        this.workspace_name = "";
    }
    KeystrokeStats.prototype.getCurrentStatsData = function () {
        return JSON.parse(JSON.stringify(this));
    };
    /**
     * check if the payload should be sent or not
     */
    KeystrokeStats.prototype.hasData = function () {
        var _this = this;
        var keys = Object.keys(this.source);
        if (!keys || keys.length === 0) {
            return false;
        }
        // delete files that don't have any kpm data
        var foundKpmData = false;
        if (this.keystrokes > 0) {
            foundKpmData = true;
        }
        // Now remove files that don't have any keystrokes that only
        // have an open or close associated with them. If they have
        // open AND close then it's ok, keep it.
        var keystrokesTally = 0;
        keys.forEach(function (key) {
            var data = _this.source[key];
            var hasOpen = data.open > 0;
            var hasClose = data.close > 0;
            // tally the keystrokes for this file
            data.keystrokes =
                data.add +
                    data.paste +
                    data["delete"] +
                    data.linesAdded +
                    data.linesRemoved;
            var hasKeystrokes = data.keystrokes > 0;
            keystrokesTally += data.keystrokes;
            if ((hasOpen && !hasClose && !hasKeystrokes) ||
                (hasClose && !hasOpen && !hasKeystrokes)) {
                // delete it, no keystrokes and only an open
                delete _this.source[key];
            }
            else if (!foundKpmData && hasOpen && hasClose) {
                foundKpmData = true;
            }
        });
        if (keystrokesTally > 0 && keystrokesTally !== this.keystrokes) {
            // use the keystrokes tally
            foundKpmData = true;
            this.keystrokes = keystrokesTally;
        }
        return foundKpmData;
    };
    /**
     * send the payload
     */
    KeystrokeStats.prototype.postData = function (sendNow) {
        if (sendNow === void 0) { sendNow = false; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                PayloadManager_1.processPayload(this, sendNow);
                return [2 /*return*/];
            });
        });
    };
    return KeystrokeStats;
}());
exports["default"] = KeystrokeStats;
