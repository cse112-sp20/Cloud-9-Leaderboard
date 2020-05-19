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
exports.updateStatusBarWithSummaryData = exports.incrementSessionSummaryData = exports.getTimeBetweenLastPayload = exports.setSessionSummaryLiveshareMinutes = exports.saveSessionSummaryToDisk = exports.getSessionSummaryFileAsJson = exports.sessionSummaryExists = exports.getSessionSummaryData = exports.getSessionSummaryFile = exports.clearSessionSummaryData = exports.getSessionThresholdSeconds = void 0;
var models_1 = require("../model/models");
var Util_1 = require("../Util");
var Constants_1 = require("../Constants");
var TimeSummaryData_1 = require("./TimeSummaryData");
var fs = require("fs");
function getSessionThresholdSeconds() {
    var thresholdSeconds = Util_1.getItem("sessionThresholdInSec") || Constants_1.DEFAULT_SESSION_THRESHOLD_SECONDS;
    return thresholdSeconds;
}
exports.getSessionThresholdSeconds = getSessionThresholdSeconds;
function clearSessionSummaryData() {
    var sessionSummaryData = new models_1.SessionSummary();
    saveSessionSummaryToDisk(sessionSummaryData);
}
exports.clearSessionSummaryData = clearSessionSummaryData;
function getSessionSummaryFile() {
    var file = Util_1.getSoftwareDir();
    if (Util_1.isWindows()) {
        file += "\\sessionSummary.json";
    }
    else {
        file += "/sessionSummary.json";
    }
    return file;
}
exports.getSessionSummaryFile = getSessionSummaryFile;
function getSessionSummaryData() {
    var sessionSummaryData = getSessionSummaryFileAsJson();
    // make sure it's a valid structure
    if (!sessionSummaryData) {
        // set the defaults
        sessionSummaryData = new models_1.SessionSummary();
    }
    // fill in missing attributes
    sessionSummaryData = coalesceMissingAttributes(sessionSummaryData);
    return sessionSummaryData;
}
exports.getSessionSummaryData = getSessionSummaryData;
function coalesceMissingAttributes(data) {
    // ensure all attributes are defined
    var template = new models_1.SessionSummary();
    Object.keys(template).forEach(function (key) {
        if (!data[key]) {
            data[key] = 0;
        }
    });
    return data;
}
function sessionSummaryExists() {
    var file = getSessionSummaryFile();
    return fs.existsSync(file);
}
exports.sessionSummaryExists = sessionSummaryExists;
function getSessionSummaryFileAsJson() {
    var file = getSessionSummaryFile();
    var sessionSummary = Util_1.getFileDataAsJson(file);
    if (!sessionSummary) {
        sessionSummary = new models_1.SessionSummary();
        saveSessionSummaryToDisk(sessionSummary);
    }
    return sessionSummary;
}
exports.getSessionSummaryFileAsJson = getSessionSummaryFileAsJson;
function saveSessionSummaryToDisk(sessionSummaryData) {
    var file = getSessionSummaryFile();
    try {
        // JSON.stringify(data, replacer, number of spaces)
        var content = JSON.stringify(sessionSummaryData, null, 4);
        fs.writeFileSync(file, content, function (err) {
            if (err)
                Util_1.logIt("Deployer: Error writing session summary data: " + err.message);
        });
    }
    catch (e) {
        //
    }
}
exports.saveSessionSummaryToDisk = saveSessionSummaryToDisk;
function setSessionSummaryLiveshareMinutes(minutes) {
    var sessionSummaryData = getSessionSummaryData();
    sessionSummaryData.liveshareMinutes = minutes;
    saveSessionSummaryToDisk(sessionSummaryData);
}
exports.setSessionSummaryLiveshareMinutes = setSessionSummaryLiveshareMinutes;
/**
 * Return {elapsedSeconds, sessionMinutes}
 * The session minutes is based on a threshold of 15 minutes
 */
function getTimeBetweenLastPayload() {
    // default to 1 minute
    var sessionMinutes = 1;
    var elapsedSeconds = 60;
    // will be zero if its a new day
    var lastPayloadEnd = Util_1.getItem("latestPayloadTimestampEndUtc");
    // the last payload end time is reset within the new day checker
    if (lastPayloadEnd && lastPayloadEnd > 0) {
        var nowTimes = Util_1.getNowTimes();
        var nowInSec = nowTimes.now_in_sec;
        // diff from the previous end time
        elapsedSeconds = Math.max(60, nowInSec - lastPayloadEnd);
        // if it's less than the threshold then add the minutes to the session time
        if (elapsedSeconds > 0 &&
            elapsedSeconds <= getSessionThresholdSeconds()) {
            // it's still the same session, add the gap time in minutes
            sessionMinutes = elapsedSeconds / 60;
        }
        sessionMinutes = Math.max(1, sessionMinutes);
    }
    return { sessionMinutes: sessionMinutes, elapsedSeconds: elapsedSeconds };
}
exports.getTimeBetweenLastPayload = getTimeBetweenLastPayload;
function incrementSessionSummaryData(aggregates, sessionMinutes) {
    return __awaiter(this, void 0, void 0, function () {
        var sessionSummaryData;
        return __generator(this, function (_a) {
            sessionSummaryData = getSessionSummaryData();
            // fill in missing attributes
            sessionSummaryData = coalesceMissingAttributes(sessionSummaryData);
            sessionSummaryData.currentDayMinutes += sessionMinutes;
            // increment the current day attributes except for the current day minutes
            sessionSummaryData.currentDayKeystrokes += aggregates.keystrokes;
            sessionSummaryData.currentDayLinesAdded += aggregates.linesAdded;
            sessionSummaryData.currentDayLinesRemoved += aggregates.linesRemoved;
            saveSessionSummaryToDisk(sessionSummaryData);
            return [2 /*return*/];
        });
    });
}
exports.incrementSessionSummaryData = incrementSessionSummaryData;
/**
 * Updates the status bar text with the current day minutes (session minutes)
 */
function updateStatusBarWithSummaryData() {
    var codeTimeSummary = TimeSummaryData_1.getCodeTimeSummary();
    var data = getSessionSummaryData();
    var averageDailyMinutes = data.averageDailyMinutes;
    // const inFlowIcon = currentDayMinutes > averageDailyMinutes ? "🚀 " : "";
    var inFlowIcon = codeTimeSummary.activeCodeTimeMinutes > averageDailyMinutes
        ? "$(rocket)"
        : "$(clock)";
    var minutesStr = Util_1.humanizeMinutes(codeTimeSummary.activeCodeTimeMinutes);
    var msg = inFlowIcon + " " + minutesStr;
    Util_1.showStatus(msg, null);
}
exports.updateStatusBarWithSummaryData = updateStatusBarWithSummaryData;
