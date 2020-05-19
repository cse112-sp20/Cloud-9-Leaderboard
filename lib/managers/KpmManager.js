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
exports.KpmManager = void 0;
var vscode_1 = require("vscode");
var KeystrokeStats_1 = require("../model/KeystrokeStats");
var Constants_1 = require("../Constants");
var Util_1 = require("../Util");
var models_1 = require("../model/models");
var JiraClient_1 = require("../http/JiraClient");
var FileManager_1 = require("./FileManager");
var Project_1 = require("../model/Project");
var _keystrokeMap = {};
var _staticInfoMap = {};
var KpmManager = /** @class */ (function () {
    function KpmManager() {
        var subscriptions = [];
        // document listener handlers
        vscode_1.workspace.onDidOpenTextDocument(this._onOpenHandler, this);
        vscode_1.workspace.onDidCloseTextDocument(this._onCloseHandler, this);
        vscode_1.workspace.onDidChangeTextDocument(this._onEventHandler, this);
        this._disposable = vscode_1.Disposable.from.apply(vscode_1.Disposable, subscriptions);
    }
    KpmManager.getInstance = function () {
        if (!KpmManager.instance) {
            KpmManager.instance = new KpmManager();
        }
        return KpmManager.instance;
    };
    KpmManager.prototype.hasKeystrokeData = function () {
        return _keystrokeMap &&
            !Util_1.isEmptyObj(_keystrokeMap) &&
            Object.keys(_keystrokeMap).length
            ? true
            : false;
    };
    KpmManager.prototype.sendKeystrokeDataIntervalHandler = function () {
        return __awaiter(this, void 0, void 0, function () {
            var keys, _loop_1, i;
            return __generator(this, function (_a) {
                //
                // Go through all keystroke count objects found in the map and send
                // the ones that have data (data is greater than 1), then clear the map
                //
                if (this.hasKeystrokeData()) {
                    keys = Object.keys(_keystrokeMap);
                    _loop_1 = function (i) {
                        var key = keys[i];
                        var keystrokeStats = _keystrokeMap[key];
                        var hasData = keystrokeStats.hasData();
                        if (hasData) {
                            // post the payload offline until the batch interval sends it out
                            setTimeout(function () { return keystrokeStats.postData(); }, 0);
                        }
                    };
                    // use a normal for loop since we have an await within the loop
                    for (i = 0; i < keys.length; i++) {
                        _loop_1(i);
                    }
                }
                // clear out the keystroke map
                _keystrokeMap = {};
                // clear out the static info map
                _staticInfoMap = {};
                return [2 /*return*/];
            });
        });
    };
    /**
     * File Close Handler
     * @param event
     */
    KpmManager.prototype._onCloseHandler = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var filename, staticInfo, rootPath, rootObj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!event || !vscode_1.window.state.focused) {
                            return [2 /*return*/];
                        }
                        filename = this.getFileName(event);
                        if (!this.isTrueEventFile(event, filename)) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.getStaticEventInfo(event, filename)];
                    case 1:
                        staticInfo = _a.sent();
                        rootPath = Util_1.getRootPathForFile(staticInfo.filename);
                        if (!rootPath) {
                            rootPath = Constants_1.NO_PROJ_NAME;
                        }
                        return [4 /*yield*/, this.initializeKeystrokesCount(staticInfo.filename, rootPath)];
                    case 2:
                        _a.sent();
                        rootObj = _keystrokeMap[rootPath];
                        this.updateStaticValues(rootObj, staticInfo);
                        rootObj.source[staticInfo.filename].close += 1;
                        Util_1.logEvent("File closed");
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * File Open Handler
     * @param event
     */
    KpmManager.prototype._onOpenHandler = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var filename, staticInfo, rootPath, rootObj;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!event || !vscode_1.window.state.focused) {
                            return [2 /*return*/];
                        }
                        filename = this.getFileName(event);
                        if (!this.isTrueEventFile(event, filename)) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.getStaticEventInfo(event, filename)];
                    case 1:
                        staticInfo = _a.sent();
                        rootPath = Util_1.getRootPathForFile(staticInfo.filename);
                        if (!rootPath) {
                            rootPath = Constants_1.NO_PROJ_NAME;
                        }
                        return [4 /*yield*/, this.initializeKeystrokesCount(staticInfo.filename, rootPath)];
                    case 2:
                        _a.sent();
                        // make sure other files end's are set
                        this.endPreviousModifiedFiles(staticInfo.filename, rootPath);
                        rootObj = _keystrokeMap[rootPath];
                        this.updateStaticValues(rootObj, staticInfo);
                        rootObj.source[staticInfo.filename].open += 1;
                        Util_1.logEvent("File opened");
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * File Change Event Handler
     * @param event
     */
    KpmManager.prototype._onEventHandler = function (event) {
        return __awaiter(this, void 0, void 0, function () {
            var filename, staticInfo, rootPath, rootObj, sourceObj, currLineCount, linesAdded, linesDeleted, hasNonNewLineData, textChangeLen, rangeChangeLen, contentText, isCharDelete, i, range, newLineMatches;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!event || !vscode_1.window.state.focused) {
                            return [2 /*return*/];
                        }
                        filename = this.getFileName(event);
                        // console.log("Event triggered (KpmManager)");
                        // console.log(event);
                        if (!this.isTrueEventFile(event, filename)) {
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, this.getStaticEventInfo(event, filename)];
                    case 1:
                        staticInfo = _a.sent();
                        rootPath = Util_1.getRootPathForFile(filename);
                        if (!rootPath) {
                            rootPath = Constants_1.NO_PROJ_NAME;
                        }
                        return [4 /*yield*/, this.initializeKeystrokesCount(filename, rootPath)];
                    case 2:
                        _a.sent();
                        if (!_keystrokeMap[rootPath].source[filename]) {
                            // it's undefined, it wasn't created
                            return [2 /*return*/];
                        }
                        rootObj = _keystrokeMap[rootPath];
                        sourceObj = rootObj.source[staticInfo.filename];
                        currLineCount = event.document && event.document.lineCount
                            ? event.document.lineCount
                            : event.lineCount || 0;
                        this.updateStaticValues(rootObj, staticInfo);
                        linesAdded = 0;
                        linesDeleted = 0;
                        hasNonNewLineData = false;
                        textChangeLen = 0;
                        rangeChangeLen = 0;
                        contentText = "";
                        isCharDelete = false;
                        if (event.contentChanges && event.contentChanges.length) {
                            for (i = 0; i < event.contentChanges.length; i++) {
                                range = event.contentChanges[i].range;
                                rangeChangeLen += event.contentChanges[i].rangeLength || 0;
                                contentText = event.contentChanges[i].text;
                                newLineMatches = contentText.match(/[\n\r]/g);
                                if (newLineMatches && newLineMatches.length) {
                                    // it's a new line
                                    linesAdded = newLineMatches.length;
                                    if (contentText) {
                                        textChangeLen += contentText.length;
                                    }
                                    contentText = "";
                                }
                                else if (contentText.length > 0) {
                                    // has text changes
                                    hasNonNewLineData = true;
                                    textChangeLen += contentText.length;
                                }
                                else if (range && !range.isEmpty && !range.isSingleLine) {
                                    if (range.start && range.start.line && range.end && range.end.line) {
                                        linesDeleted = Math.abs(range.start.line - range.end.line);
                                    }
                                    else {
                                        linesDeleted = 1;
                                    }
                                }
                                else if (rangeChangeLen && rangeChangeLen > 0 && contentText === "") {
                                    isCharDelete = true;
                                }
                            }
                        }
                        // check if its a character deletion
                        if (textChangeLen === 0 && rangeChangeLen > 0) {
                            // since new count is zero, check the range length.
                            // if there's range length then it's a deletion
                            textChangeLen = event.contentChanges[0].rangeLength / -1;
                        }
                        if (!isCharDelete &&
                            textChangeLen === 0 &&
                            linesAdded === 0 &&
                            linesDeleted === 0) {
                            return [2 /*return*/];
                        }
                        if (textChangeLen > 8) {
                            //
                            // it's a copy and paste event
                            //
                            sourceObj.paste += 1;
                            Util_1.logEvent("Copy+Paste Incremented");
                        }
                        else if (textChangeLen < 0) {
                            sourceObj["delete"] += 1;
                            // update the overall count
                            Util_1.logEvent("Delete Incremented");
                        }
                        else if (hasNonNewLineData) {
                            // update the data for this fileInfo keys count
                            sourceObj.add += 1;
                            // update the overall count
                            Util_1.logEvent("KPM incremented");
                        }
                        // increment keystrokes by 1
                        rootObj.keystrokes += 1;
                        // "netkeys" = add - delete
                        sourceObj.netkeys = sourceObj.add - sourceObj["delete"];
                        sourceObj.lines = currLineCount;
                        if (linesDeleted > 0) {
                            Util_1.logEvent("Removed " + linesDeleted + " lines");
                            sourceObj.linesRemoved += linesDeleted;
                        }
                        else if (linesAdded > 0) {
                            Util_1.logEvent("Added " + linesAdded + " lines");
                            sourceObj.linesAdded += linesAdded;
                        }
                        // console.log("KPM MANAGER ROOTOBJ");
                        // console.log(rootObj);
                        this.updateLatestPayloadLazily(rootObj);
                        return [2 /*return*/];
                }
            });
        });
    };
    KpmManager.prototype.updateLatestPayloadLazily = function (payload) {
        var _this = this;
        if (this._currentPayloadTimeout) {
            // cancel the current one
            clearTimeout(this._currentPayloadTimeout);
            this._currentPayloadTimeout = null;
        }
        this._currentPayloadTimeout = setTimeout(function () {
            console.log("Update Lazily Payload");
            console.log(payload);
            _this.updateLatestPayload(payload);
        }, 2000);
    };
    KpmManager.prototype.updateLatestPayload = function (payload) {
        FileManager_1.storeCurrentPayload(payload);
    };
    /**
     * Update some of the basic/static attributes
     * @param sourceObj
     * @param staticInfo
     */
    KpmManager.prototype.updateStaticValues = function (payload, staticInfo) {
        var sourceObj = payload.source[staticInfo.filename];
        // syntax
        if (!sourceObj.syntax) {
            sourceObj.syntax = staticInfo.languageId;
        }
        // fileAgeDays
        if (!sourceObj.fileAgeDays) {
            sourceObj.fileAgeDays = staticInfo.fileAgeDays;
        }
        // length
        sourceObj.length = staticInfo.length;
    };
    KpmManager.prototype.getFileName = function (event) {
        var filename = "";
        if (event.fileName) {
            filename = event.fileName;
        }
        else if (event.document && event.document.fileName) {
            filename = event.document.fileName;
        }
        return filename;
    };
    KpmManager.prototype.getStaticEventInfo = function (event, filename) {
        return __awaiter(this, void 0, void 0, function () {
            var languageId, length, lineCount, staticInfo, fileAgeDays, fileType;
            return __generator(this, function (_a) {
                languageId = "";
                length = 0;
                lineCount = 0;
                // get the filename, length of the file, and the languageId
                if (event.fileName) {
                    if (event.languageId) {
                        languageId = event.languageId;
                    }
                    if (event.getText()) {
                        length = event.getText().length;
                    }
                    if (event.lineCount) {
                        lineCount = event.lineCount;
                    }
                }
                else if (event.document && event.document.fileName) {
                    if (event.document.languageId) {
                        languageId = event.document.languageId;
                    }
                    if (event.document.getText()) {
                        length = event.document.getText().length;
                    }
                    if (event.document.lineCount) {
                        lineCount = event.document.lineCount;
                    }
                }
                staticInfo = _staticInfoMap[filename];
                if (staticInfo) {
                    return [2 /*return*/, staticInfo];
                }
                fileAgeDays = Util_1.getFileAgeInDays(filename);
                // if the languageId is not assigned, use the file type
                if (!languageId && filename.indexOf(".") !== -1) {
                    fileType = Util_1.getFileType(filename);
                    if (fileType) {
                        languageId = fileType;
                    }
                }
                staticInfo = {
                    filename: filename,
                    languageId: languageId,
                    length: length,
                    fileAgeDays: fileAgeDays,
                    lineCount: lineCount
                };
                _staticInfoMap[filename] = staticInfo;
                return [2 /*return*/, staticInfo];
            });
        });
    };
    KpmManager.prototype.processSelectedTextForJira = function () {
        return __awaiter(this, void 0, void 0, function () {
            var editor, text, issues;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        editor = vscode_1.window.activeTextEditor;
                        text = editor.document.getText(editor.selection);
                        if (!text) return [3 /*break*/, 2];
                        // start the process
                        Util_1.showInformationMessage("Selected the following text: " + text);
                        return [4 /*yield*/, JiraClient_1.JiraClient.getInstance().fetchIssues()];
                    case 1:
                        issues = _a.sent();
                        return [3 /*break*/, 3];
                    case 2:
                        Util_1.showInformationMessage("Please select text to copy to your Jira project");
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * This will return true if it's a true file. we don't
     * want to send events for .git or other event triggers
     * such as extension.js.map events
     */
    KpmManager.prototype.isTrueEventFile = function (event, filename) {
        if (!filename) {
            return false;
        }
        // if it's the dashboard file or a liveshare tmp file then
        // skip event tracking
        var scheme = "";
        if (event.uri && event.uri.scheme) {
            scheme = event.uri.scheme;
        }
        else if (event.document &&
            event.document.uri &&
            event.document.uri.scheme) {
            scheme = event.document.uri.scheme;
        }
        var isLiveshareTmpFile = filename.match(/.*\.code-workspace.*vsliveshare.*tmp-.*/);
        var isInternalFile = filename.match(/.*\.software.*(CommitSummary\.txt|CodeTime\.txt|session\.json|ProjectCodeSummary\.txt|data.json)/);
        // other scheme types I know of "vscode-userdata", "git"
        if (scheme !== "file" && scheme !== "untitled") {
            return false;
        }
        else if (isLiveshareTmpFile || isInternalFile) {
            return false;
        }
        return true;
    };
    KpmManager.prototype.buildBootstrapKpmPayload = function () {
        var rootPath = Constants_1.UNTITLED;
        var fileName = Constants_1.UNTITLED;
        var name = Constants_1.NO_PROJ_NAME;
        // send the code time bootstrap payload
        var keystrokeStats = new KeystrokeStats_1["default"]({
            // project.directory is used as an object key, must be string
            directory: rootPath,
            name: name,
            identifier: "",
            resource: {}
        });
        keystrokeStats.keystrokes = 1;
        var nowTimes = Util_1.getNowTimes();
        var start = nowTimes.now_in_sec - 60;
        var local_start = nowTimes.local_now_in_sec - 60;
        keystrokeStats.start = start;
        keystrokeStats.local_start = local_start;
        var fileInfo = new models_1.FileChangeInfo();
        fileInfo.add = 1;
        fileInfo.keystrokes = 1;
        fileInfo.start = start;
        fileInfo.local_start = local_start;
        keystrokeStats.source[fileName] = fileInfo;
        setTimeout(function () { return keystrokeStats.postData(true /*sendNow*/); }, 0);
    };
    KpmManager.prototype.endPreviousModifiedFiles = function (filename, rootPath) {
        var keystrokeStats = _keystrokeMap[rootPath];
        if (keystrokeStats) {
            // close any existing
            var fileKeys = Object.keys(keystrokeStats.source);
            var nowTimes_1 = Util_1.getNowTimes();
            if (fileKeys.length) {
                // set the end time to now for the other files that don't match this file
                fileKeys.forEach(function (key) {
                    var sourceObj = keystrokeStats.source[key];
                    if (key !== filename && sourceObj.end === 0) {
                        sourceObj.end = nowTimes_1.now_in_sec;
                        sourceObj.local_end = nowTimes_1.local_now_in_sec;
                    }
                });
            }
        }
    };
    KpmManager.prototype.initializeKeystrokesCount = function (filename, rootPath) {
        return __awaiter(this, void 0, void 0, function () {
            var nowTimes, keystrokeStats, hasFile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // the rootPath (directory) is used as the map key, must be a string
                        rootPath = rootPath || Constants_1.NO_PROJ_NAME;
                        // if we don't even have a _keystrokeMap then create it and take the
                        // path of adding this file with a start time of now
                        if (!_keystrokeMap) {
                            _keystrokeMap = {};
                        }
                        nowTimes = Util_1.getNowTimes();
                        keystrokeStats = _keystrokeMap[rootPath];
                        if (!!keystrokeStats) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.createKeystrokeStats(filename, rootPath, nowTimes)];
                    case 1:
                        // add keystroke count wrapper
                        keystrokeStats = _a.sent();
                        _a.label = 2;
                    case 2:
                        hasFile = keystrokeStats.source[filename];
                        if (!hasFile) {
                            // no file, start anew
                            this.addFile(filename, nowTimes, keystrokeStats);
                        }
                        else if (parseInt(keystrokeStats.source[filename].end, 10) !== 0) {
                            // re-initialize it since we ended it before the minute was up
                            keystrokeStats.source[filename].end = 0;
                            keystrokeStats.source[filename].local_end = 0;
                        }
                        _keystrokeMap[rootPath] = keystrokeStats;
                        return [2 /*return*/];
                }
            });
        });
    };
    KpmManager.prototype.addFile = function (filename, nowTimes, keystrokeStats) {
        var fileInfo = new models_1.FileChangeInfo();
        fileInfo.start = nowTimes.now_in_sec;
        fileInfo.local_start = nowTimes.local_now_in_sec;
        keystrokeStats.source[filename] = fileInfo;
    };
    KpmManager.prototype.createKeystrokeStats = function (filename, rootPath, nowTimes) {
        return __awaiter(this, void 0, void 0, function () {
            var p, keystrokeStats;
            var _this = this;
            return __generator(this, function (_a) {
                p = new Project_1["default"]();
                keystrokeStats = new KeystrokeStats_1["default"](p);
                keystrokeStats.start = nowTimes.now_in_sec;
                keystrokeStats.local_start = nowTimes.local_now_in_sec;
                keystrokeStats.keystrokes = 0;
                // start the minute timer to send the data
                setTimeout(function () {
                    _this.sendKeystrokeDataIntervalHandler();
                }, Constants_1.DEFAULT_DURATION_MILLIS);
                return [2 /*return*/, keystrokeStats];
            });
        });
    };
    KpmManager.prototype.dispose = function () {
        this._disposable.dispose();
    };
    return KpmManager;
}());
exports.KpmManager = KpmManager;
