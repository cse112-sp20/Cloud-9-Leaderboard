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
exports.getTodayTimeDataSummary = exports.getCodeTimeSummary = exports.incrementSessionAndFileSecondsAndFetch = exports.updateSessionFromSummaryApi = exports.incrementEditorSeconds = exports.getCurrentTimeSummaryProject = exports.clearTimeDataSummary = exports.getTimeDataSummaryFile = void 0;
var Util_1 = require("../Util");
var KpmRepoManager_1 = require("../repo/KpmRepoManager");
var Constants_1 = require("../Constants");
var CodeTimeSummary_1 = require("../model/CodeTimeSummary");
var Project_1 = require("../model/Project");
var TimeData_1 = require("../model/TimeData");
var fs = require("fs");
var moment = require("moment-timezone");
function getTimeDataSummaryFile() {
    var file = Util_1.getSoftwareDir();
    if (Util_1.isWindows()) {
        file += "\\projectTimeData.json";
    }
    else {
        file += "/projectTimeData.json";
    }
    return file;
}
exports.getTimeDataSummaryFile = getTimeDataSummaryFile;
/**
 * Build a new TimeData summary
 * @param project
 */
function getNewTimeDataSummary(project) {
    return __awaiter(this, void 0, void 0, function () {
        var day, timeData, activeWorkspace;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    day = Util_1.getNowTimes().day;
                    timeData = null;
                    if (!!project) return [3 /*break*/, 2];
                    activeWorkspace = Util_1.getActiveProjectWorkspace();
                    return [4 /*yield*/, getCurrentTimeSummaryProject(activeWorkspace)];
                case 1:
                    project = _a.sent();
                    // but make sure we're not creating a new one on top of one that already exists
                    timeData = findTimeDataSummary(project);
                    if (timeData) {
                        return [2 /*return*/, timeData];
                    }
                    _a.label = 2;
                case 2:
                    // still unable to find an existing td, create a new one
                    timeData = new TimeData_1["default"]();
                    timeData.day = day;
                    timeData.project = project;
                    return [2 /*return*/, timeData];
            }
        });
    });
}
function clearTimeDataSummary() {
    return __awaiter(this, void 0, void 0, function () {
        var file, payloads, content;
        return __generator(this, function (_a) {
            file = getTimeDataSummaryFile();
            payloads = [];
            try {
                content = JSON.stringify(payloads, null, 4);
                fs.writeFileSync(file, content, function (err) {
                    if (err)
                        Util_1.logIt("Deployer: Error writing time data: " + err.message);
                });
            }
            catch (e) {
                //
            }
            return [2 /*return*/];
        });
    });
}
exports.clearTimeDataSummary = clearTimeDataSummary;
function getCurrentTimeSummaryProject(workspaceFolder) {
    return __awaiter(this, void 0, void 0, function () {
        var project, rootPath, name_1, resource, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    project = new Project_1["default"]();
                    if (!(!workspaceFolder || !workspaceFolder.name)) return [3 /*break*/, 1];
                    // no workspace folder
                    project.directory = Constants_1.UNTITLED;
                    project.name = Constants_1.NO_PROJ_NAME;
                    return [3 /*break*/, 5];
                case 1:
                    rootPath = workspaceFolder.uri.fsPath;
                    name_1 = workspaceFolder.name;
                    if (!rootPath) return [3 /*break*/, 5];
                    // create the project
                    project.directory = rootPath;
                    project.name = name_1;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, KpmRepoManager_1.getResourceInfo(rootPath)];
                case 3:
                    resource = _a.sent();
                    if (resource) {
                        project.resource = resource;
                        project.identifier = resource.identifier;
                    }
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/, project];
            }
        });
    });
}
exports.getCurrentTimeSummaryProject = getCurrentTimeSummaryProject;
function incrementEditorSeconds(editor_seconds) {
    return __awaiter(this, void 0, void 0, function () {
        var activeWorkspace, project, timeData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    activeWorkspace = Util_1.getActiveProjectWorkspace();
                    if (!(activeWorkspace && activeWorkspace.name)) return [3 /*break*/, 3];
                    return [4 /*yield*/, getCurrentTimeSummaryProject(activeWorkspace)];
                case 1:
                    project = _a.sent();
                    if (!(project && project.directory)) return [3 /*break*/, 3];
                    return [4 /*yield*/, getTodayTimeDataSummary(project)];
                case 2:
                    timeData = _a.sent();
                    timeData.editor_seconds += editor_seconds;
                    timeData.editor_seconds = Math.max(timeData.editor_seconds, timeData.session_seconds);
                    // save the info to disk
                    saveTimeDataSummaryToDisk(timeData);
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.incrementEditorSeconds = incrementEditorSeconds;
function updateSessionFromSummaryApi(currentDayMinutes) {
    return __awaiter(this, void 0, void 0, function () {
        var day, codeTimeSummary, diffActiveCodeMinutesToAdd, activeWorkspace, project, timeData, file, payloads, filtered_payloads, secondsToAdd;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    day = Util_1.getNowTimes().day;
                    codeTimeSummary = getCodeTimeSummary();
                    diffActiveCodeMinutesToAdd = codeTimeSummary.activeCodeTimeMinutes < currentDayMinutes
                        ? currentDayMinutes - codeTimeSummary.activeCodeTimeMinutes
                        : 0;
                    activeWorkspace = Util_1.getActiveProjectWorkspace();
                    project = null;
                    timeData = null;
                    if (!activeWorkspace) return [3 /*break*/, 3];
                    return [4 /*yield*/, getCurrentTimeSummaryProject(activeWorkspace)];
                case 1:
                    project = _a.sent();
                    return [4 /*yield*/, getTodayTimeDataSummary(project)];
                case 2:
                    timeData = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    file = getTimeDataSummaryFile();
                    payloads = Util_1.getFileDataArray(file);
                    filtered_payloads = payloads.filter(function (n) { return n.day === day; });
                    if (filtered_payloads && filtered_payloads.length) {
                        timeData = filtered_payloads[0];
                    }
                    _a.label = 4;
                case 4:
                    if (!timeData) {
                        // create a untitled one
                        project = new Project_1["default"]();
                        project.directory = Constants_1.UNTITLED;
                        project.name = Constants_1.NO_PROJ_NAME;
                        timeData = new TimeData_1["default"]();
                        timeData.day = day;
                        timeData.project = project;
                    }
                    secondsToAdd = diffActiveCodeMinutesToAdd * 60;
                    timeData.session_seconds += secondsToAdd;
                    timeData.editor_seconds += secondsToAdd;
                    // make sure editor seconds isn't less
                    saveTimeDataSummaryToDisk(timeData);
                    return [2 /*return*/];
            }
        });
    });
}
exports.updateSessionFromSummaryApi = updateSessionFromSummaryApi;
function incrementSessionAndFileSecondsAndFetch(project, sessionMinutes) {
    return __awaiter(this, void 0, void 0, function () {
        var timeData, session_seconds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getTodayTimeDataSummary(project)];
                case 1:
                    timeData = _a.sent();
                    if (timeData) {
                        session_seconds = sessionMinutes * 60;
                        timeData.session_seconds += session_seconds;
                        // max editor seconds should be equal or greater than session seconds
                        timeData.editor_seconds = Math.max(timeData.editor_seconds, timeData.session_seconds);
                        timeData.file_seconds += 60;
                        // max file seconds should not be greater than session seconds
                        timeData.file_seconds = Math.min(timeData.file_seconds, timeData.session_seconds);
                        // save the info to disk (synchronous)
                        saveTimeDataSummaryToDisk(timeData);
                        return [2 /*return*/, timeData];
                    }
                    return [2 /*return*/, null];
            }
        });
    });
}
exports.incrementSessionAndFileSecondsAndFetch = incrementSessionAndFileSecondsAndFetch;
function getCodeTimeSummary() {
    var summary = new CodeTimeSummary_1["default"]();
    var day = Util_1.getNowTimes().day;
    // gather the time data elements for today
    var file = getTimeDataSummaryFile();
    var payloads = Util_1.getFileDataArray(file);
    var filtered_payloads = payloads.filter(function (n) { return n.day === day; });
    if (filtered_payloads && filtered_payloads.length) {
        filtered_payloads.forEach(function (n) {
            summary.activeCodeTimeMinutes += n.session_seconds / 60;
            summary.codeTimeMinutes += n.editor_seconds / 60;
            summary.fileTimeMinutes += n.file_seconds / 60;
        });
    }
    return summary;
}
exports.getCodeTimeSummary = getCodeTimeSummary;
function getTodayTimeDataSummary(project) {
    return __awaiter(this, void 0, void 0, function () {
        var timeData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    timeData = findTimeDataSummary(project);
                    if (!!timeData) return [3 /*break*/, 2];
                    return [4 /*yield*/, getNewTimeDataSummary(project)];
                case 1:
                    timeData = _a.sent();
                    saveTimeDataSummaryToDisk(timeData);
                    _a.label = 2;
                case 2: return [2 /*return*/, timeData];
            }
        });
    });
}
exports.getTodayTimeDataSummary = getTodayTimeDataSummary;
function findTimeDataSummary(project) {
    if (!project || !project.directory) {
        // no project or directory, it shouldn't exist in the file
        return null;
    }
    var day = Util_1.getNowTimes().day;
    var timeData = null;
    var file = getTimeDataSummaryFile();
    var payloads = Util_1.getFileDataArray(file);
    if (payloads && payloads.length) {
        // find the one for this day
        timeData = payloads.find(function (n) { return n.day === day && n.project.directory === project.directory; });
    }
    return timeData;
}
function saveTimeDataSummaryToDisk(data) {
    if (!data) {
        return;
    }
    var file = getTimeDataSummaryFile();
    var payloads = Util_1.getFileDataArray(file);
    if (payloads && payloads.length) {
        // find the one for this day
        var idx = payloads.findIndex(function (n) {
            return n.day === data.day &&
                n.project.directory === data.project.directory;
        });
        if (idx !== -1) {
            payloads[idx] = data;
        }
        else {
            // add it
            payloads.push(data);
        }
    }
    else {
        payloads = [data];
    }
    try {
        var content = JSON.stringify(payloads, null, 4);
        fs.writeFileSync(file, content, function (err) {
            if (err)
                Util_1.logIt("Deployer: Error writing time data: " + err.message);
        });
    }
    catch (e) {
        //
    }
}
