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
exports.ProjectCommitManager = void 0;
var vscode_1 = require("vscode");
var HttpClient_1 = require("../http/HttpClient");
var Util_1 = require("../Util");
var checkbox_1 = require("../model/checkbox");
var ReportManager_1 = require("./ReportManager");
var moment = require("moment-timezone");
var dateFormat = "YYYY-MM-DD";
var selectedStartTime = 0;
var selectedEndTime = 0;
var selectedRangeType = "";
var local_start = 0;
var local_end = 0;
var ProjectCommitManager = /** @class */ (function () {
    function ProjectCommitManager() {
        this.items = [
            {
                label: "Custom",
                value: "custom"
            },
            {
                label: "Today",
                value: "today"
            },
            {
                label: "Yesterday",
                value: "yesterday"
            },
            {
                label: "This week",
                value: "currentWeek"
            },
            {
                label: "Last week",
                value: "lastWeek"
            },
            {
                label: "This month",
                value: "thisMonth"
            },
            {
                label: "Last month",
                value: "lastMonth"
            },
        ];
        //
    }
    ProjectCommitManager.getInstance = function () {
        if (!ProjectCommitManager.instance) {
            ProjectCommitManager.instance = new ProjectCommitManager();
        }
        return ProjectCommitManager.instance;
    };
    ProjectCommitManager.prototype.launchDailyReportMenuFlow = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pickItems, pick;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pickItems = this.items.map(function (item) {
                            return {
                                label: item.label,
                                value: item.value
                            };
                        });
                        return [4 /*yield*/, vscode_1.window.showQuickPick(pickItems, {
                                placeHolder: "Select a date range"
                            })];
                    case 1:
                        pick = _a.sent();
                        if (pick && pick.label) {
                            return [2 /*return*/, this.launchProjectSelectionMenu(pick["value"])];
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    ProjectCommitManager.prototype.launchProjectCommitMenuFlow = function () {
        return __awaiter(this, void 0, void 0, function () {
            var pickItems, pick, val, initialStartVal, startDateText, endVal, endDateText, local, offset_in_sec, checkboxes, checkboxes;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        selectedStartTime = 0;
                        selectedEndTime = 0;
                        selectedRangeType = "";
                        pickItems = this.items.map(function (item) {
                            return {
                                label: item.label,
                                value: item.value
                            };
                        });
                        return [4 /*yield*/, vscode_1.window.showQuickPick(pickItems, {
                                placeHolder: "Select a date range"
                            })];
                    case 1:
                        pick = _a.sent();
                        if (!(pick && pick.label)) return [3 /*break*/, 8];
                        val = pick["value"];
                        if (!(val === "custom")) return [3 /*break*/, 6];
                        initialStartVal = moment()
                            .startOf("day")
                            .subtract(1, "day")
                            .format(dateFormat);
                        return [4 /*yield*/, this.showDateInputBox(initialStartVal, dateFormat, "starting")];
                    case 2:
                        startDateText = _a.sent();
                        if (!startDateText) return [3 /*break*/, 5];
                        // START DATE (begin of day)
                        selectedStartTime = moment(startDateText, dateFormat)
                            .startOf("day")
                            .unix();
                        endVal = moment
                            .unix(selectedStartTime)
                            .add(1, "day")
                            .format(dateFormat);
                        return [4 /*yield*/, this.showDateInputBox(endVal, dateFormat, "ending")];
                    case 3:
                        endDateText = _a.sent();
                        if (!endDateText) return [3 /*break*/, 5];
                        // END DATE (the end of the day)
                        selectedEndTime = moment(endDateText, dateFormat)
                            .endOf("day")
                            .unix();
                        local = moment().local();
                        offset_in_sec = moment.parseZone(local).utcOffset() * 60;
                        local_start = selectedStartTime + offset_in_sec;
                        local_end = selectedEndTime + offset_in_sec;
                        return [4 /*yield*/, this.getProjectCheckboxesByStartEnd(local_start, local_end)];
                    case 4:
                        checkboxes = _a.sent();
                        return [2 /*return*/, this.launchProjectSelectionMenu(checkboxes)];
                    case 5: return [3 /*break*/, 8];
                    case 6:
                        selectedRangeType = val;
                        return [4 /*yield*/, this.getProjectCheckboxesByRangeType(selectedRangeType)];
                    case 7:
                        checkboxes = _a.sent();
                        return [2 /*return*/, this.launchProjectSelectionMenu(checkboxes)];
                    case 8: return [2 /*return*/, null];
                }
            });
        });
    };
    ProjectCommitManager.prototype.launchProjectSelectionMenu = function (checkboxes) {
        return __awaiter(this, void 0, void 0, function () {
            var pickItems, picks, projectIds_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        pickItems = checkboxes.map(function (checkbox) {
                            return {
                                value: checkbox.value,
                                picked: checkbox.checked,
                                label: checkbox.label,
                                description: checkbox.text
                            };
                        });
                        return [4 /*yield*/, vscode_1.window.showQuickPick(pickItems, {
                                placeHolder: "Select one or more projects",
                                ignoreFocusOut: false,
                                matchOnDescription: true,
                                canPickMany: true
                            })];
                    case 1:
                        picks = _a.sent();
                        // will return an array of ... (value is the projectIds)
                        // [{description, label, picked, value}]
                        if (picks && picks.length) {
                            projectIds_1 = [];
                            picks.forEach(function (item) {
                                projectIds_1.push.apply(projectIds_1, item["value"]);
                            });
                            if (selectedRangeType) {
                                ReportManager_1.displayProjectCommitsDashboardByRangeType(selectedRangeType, projectIds_1);
                            }
                            else if (local_start && local_end) {
                                ReportManager_1.displayProjectCommitsDashboardByStartEnd(local_start, local_end, projectIds_1);
                            }
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    ProjectCommitManager.prototype.getProjectCheckboxesByStartEnd = function (start, end) {
        return __awaiter(this, void 0, void 0, function () {
            var qryStr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        qryStr = "?start=" + start + "&end=" + end;
                        return [4 /*yield*/, this.getProjectCheckboxesByQueryString(qryStr)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ProjectCommitManager.prototype.getProjectCheckboxesByRangeType = function (type) {
        if (type === void 0) { type = "lastWeek"; }
        return __awaiter(this, void 0, void 0, function () {
            var qryStr;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        qryStr = "?timeRange=" + type;
                        return [4 /*yield*/, this.getProjectCheckboxesByQueryString(qryStr)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ProjectCommitManager.prototype.getProjectCheckboxesByQueryString = function (qryStr) {
        return __awaiter(this, void 0, void 0, function () {
            var api, resp, checkboxes, projects, total_records_1, lineNumber, i, p, name_1, projectIds, percentage, cb;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        api = "/projects" + qryStr;
                        return [4 /*yield*/, HttpClient_1.softwareGet(api, Util_1.getItem("jwt"))];
                    case 1:
                        resp = _a.sent();
                        checkboxes = [];
                        if (HttpClient_1.isResponseOk(resp)) {
                            projects = resp.data;
                            total_records_1 = 0;
                            if (projects && projects.length) {
                                projects.forEach(function (p) {
                                    if (!p.coding_records) {
                                        p["coding_records"] = 1;
                                    }
                                    total_records_1 += p.coding_records;
                                });
                                lineNumber = 0;
                                for (i = 0; i < projects.length; i++) {
                                    p = projects[i];
                                    name_1 = p.project_name
                                        ? p.project_name
                                        : p.name
                                            ? p.name
                                            : "";
                                    projectIds = p.projectIds
                                        ? p.projectIds
                                        : p.id
                                            ? [p.id]
                                            : [];
                                    if (name_1 && projectIds.length) {
                                        percentage = (p.coding_records / total_records_1) * 100;
                                        cb = new checkbox_1["default"]();
                                        cb.coding_records = p.coding_records;
                                        cb.text = "(" + percentage.toFixed(2) + "%)";
                                        cb.label = name_1;
                                        cb.checked = true;
                                        cb.lineNumber = lineNumber;
                                        cb.value = projectIds;
                                        checkboxes.push(cb);
                                        lineNumber++;
                                    }
                                }
                                checkboxes.sort(function (a, b) {
                                    return b.coding_records - a.coding_records;
                                });
                            }
                        }
                        return [2 /*return*/, checkboxes];
                }
            });
        });
    };
    ProjectCommitManager.prototype.showDateInputBox = function (value, placeHolder, datePrompt) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, vscode_1.window.showInputBox({
                            value: value,
                            placeHolder: placeHolder,
                            prompt: "Please enter the " + datePrompt + " date of the custom time range (YYYY-MM-DD) to continue..",
                            validateInput: function (text) {
                                var isValid = moment(text, dateFormat, true).isValid();
                                if (!isValid) {
                                    return "Please enter a valid date to continue (" + dateFormat + ")";
                                }
                                var endTime = moment(text, dateFormat).unix();
                                if (selectedStartTime &&
                                    endTime &&
                                    selectedStartTime > endTime) {
                                    return "Please make sure the end date is after the start date";
                                }
                                return null;
                            }
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return ProjectCommitManager;
}());
exports.ProjectCommitManager = ProjectCommitManager;
