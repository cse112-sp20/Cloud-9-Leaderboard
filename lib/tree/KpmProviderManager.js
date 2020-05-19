"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.handleKpmChangeSelection = exports.KpmTreeItem = exports.KpmProviderManager = void 0;
var models_1 = require("../model/models");
var DataController_1 = require("../DataController");
var Util_1 = require("../Util");
var GitUtil_1 = require("../repo/GitUtil");
var vscode_1 = require("vscode");
var FileChangeInfoSummaryData_1 = require("../storage/FileChangeInfoSummaryData");
var SessionSummaryData_1 = require("../storage/SessionSummaryData");
var EventManager_1 = require("../managers/EventManager");
var KpmRepoManager_1 = require("../repo/KpmRepoManager");
var TimeSummaryData_1 = require("../storage/TimeSummaryData");
var numeral = require("numeral");
var moment = require("moment-timezone");
var path = require("path");
// this current path is in the out/lib. We need to find the resource files
// which are in out/resources
var resourcePath = path.join(__filename, "..", "..", "..", "resources");
var counter = 0;
var KpmProviderManager = /** @class */ (function () {
    function KpmProviderManager() {
        this._currentKeystrokeStats = new models_1.SessionSummary();
        //
    }
    KpmProviderManager.getInstance = function () {
        if (!KpmProviderManager.instance) {
            KpmProviderManager.instance = new KpmProviderManager();
        }
        return KpmProviderManager.instance;
    };
    KpmProviderManager.prototype.setCurrentKeystrokeStats = function (keystrokeStats) {
        var _this = this;
        if (keystrokeStats) {
            // update the current stats
            Object.keys(keystrokeStats.source).forEach(function (key) {
                var fileInfo = keystrokeStats.source[key];
                _this._currentKeystrokeStats.currentDayKeystrokes = fileInfo.keystrokes;
                _this._currentKeystrokeStats.currentDayLinesAdded = fileInfo.linesAdded;
                _this._currentKeystrokeStats.currentDayLinesRemoved =
                    fileInfo.linesRemoved;
            });
        }
    };
    KpmProviderManager.prototype.getOptionsTreeParents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var space, treeItems, loggedIn, signupWithGoogle, googleSignupButton, signupWithGithub, githubSignupButton, signupWithEmail, softwareSignupButton, dividerButton, connectedToInfo, connectedToButton, toggleStatusBarTextLabel, toggleStatusBarIcon, toggleStatusBarButton, learnMoreLabel, readmeButton, feedbackButton, reportDividerButton, commitSummitLabel, generateProjectSummaryButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        counter++;
                        space = counter % 2 === 0 ? "" : " ";
                        treeItems = [];
                        return [4 /*yield*/, DataController_1.isLoggedIn()];
                    case 1:
                        loggedIn = _a.sent();
                        if (!loggedIn) {
                            signupWithGoogle = "Sign up with Google" + space;
                            googleSignupButton = this.getActionButton(signupWithGoogle, "", "codetime.googleLogin", "icons8-google.svg");
                            signupWithGithub = "Sign up with GitHub" + space;
                            githubSignupButton = this.getActionButton(signupWithGithub, "", "codetime.githubLogin", "icons8-github.svg");
                            treeItems.push(githubSignupButton);
                            signupWithEmail = "Sign up with email" + space;
                            softwareSignupButton = this.getActionButton(signupWithEmail, "", "codetime.codeTimeLogin", "envelope.svg");
                            treeItems.push(softwareSignupButton);
                            dividerButton = this.getActionButton("", "", "", "blue-line-96.png");
                            treeItems.push(dividerButton);
                        }
                        else {
                            connectedToInfo = this.getAuthTypeIconAndLabel();
                            if (connectedToInfo) {
                                connectedToButton = this.getActionButton(connectedToInfo.label, connectedToInfo.tooltip, null, connectedToInfo.icon);
                                treeItems.push(connectedToButton);
                            }
                            // show the web dashboard button
                            treeItems.push(this.getWebViewDashboardButton());
                        }
                        toggleStatusBarTextLabel = "Hide status bar metrics";
                        toggleStatusBarIcon = "visible.svg";
                        if (!Util_1.isStatusBarTextVisible()) {
                            toggleStatusBarTextLabel = "Show status bar metrics";
                        }
                        toggleStatusBarButton = this.getActionButton(toggleStatusBarTextLabel, "Toggle the Code Time status bar metrics text", "codetime.toggleStatusBar", toggleStatusBarIcon);
                        treeItems.push(toggleStatusBarButton);
                        learnMoreLabel = "Learn more" + space;
                        readmeButton = this.getActionButton(learnMoreLabel, "View the Code Time Readme to learn more", "codetime.displayReadme", "readme.svg");
                        treeItems.push(readmeButton);
                        feedbackButton = this.getActionButton("Submit feedback", "Send us an email at cody@software.com", "codetime.sendFeedback", "message.svg");
                        treeItems.push(feedbackButton);
                        reportDividerButton = this.getActionButton("", "", "", "blue-line-96.png");
                        treeItems.push(reportDividerButton);
                        // codetime metrics editor dashboard
                        treeItems.push(this.getCodeTimeDashboardButton());
                        commitSummitLabel = "View project summary" + space;
                        generateProjectSummaryButton = this.getActionButton(commitSummitLabel, "", "codetime.generateProjectSummary", "folder.svg");
                        treeItems.push(generateProjectSummaryButton);
                        // const addProjectNoteLabel: string = `Add a note${space}`;
                        // const addProjectNoteButton: KpmItem = this.getActionButton(
                        //     addProjectNoteLabel,
                        //     "",
                        //     "codetime.addProjectNote",
                        //     "message.svg"
                        // );
                        // treeItems.push(addProjectNoteButton);
                        return [2 /*return*/, treeItems];
                }
            });
        });
    };
    KpmProviderManager.prototype.getDailyMetricsTreeParents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var treeItems, kpmTreeParents, commitTreeParents;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        treeItems = [];
                        return [4 /*yield*/, this.getKpmTreeParents()];
                    case 1:
                        kpmTreeParents = _a.sent();
                        treeItems.push.apply(treeItems, kpmTreeParents);
                        return [4 /*yield*/, this.getCommitTreeParents()];
                    case 2:
                        commitTreeParents = _a.sent();
                        treeItems.push.apply(treeItems, commitTreeParents);
                        return [2 /*return*/, treeItems];
                }
            });
        });
    };
    KpmProviderManager.prototype.getKpmTreeParents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var treeItems, sessionSummaryData, currentKeystrokesItems, fileChangeInfoMap, filesChanged, fileChangeInfos, highKpmParent, mostEditedFileItem, longestCodeTimeParent;
            return __generator(this, function (_a) {
                treeItems = [];
                sessionSummaryData = SessionSummaryData_1.getSessionSummaryData();
                currentKeystrokesItems = this.getSessionSummaryItems(sessionSummaryData);
                // show the metrics per line
                treeItems.push.apply(treeItems, currentKeystrokesItems);
                fileChangeInfoMap = FileChangeInfoSummaryData_1.getFileChangeSummaryAsJson();
                filesChanged = fileChangeInfoMap
                    ? Object.keys(fileChangeInfoMap).length
                    : 0;
                if (filesChanged > 0) {
                    treeItems.push(this.buildTreeMetricItem("Files changed", "Files changed today", "Today: " + filesChanged));
                    // get the file change info
                    if (filesChanged) {
                        fileChangeInfos = Object.keys(fileChangeInfoMap).map(function (key) {
                            return fileChangeInfoMap[key];
                        });
                        highKpmParent = this.buildHighestKpmFileItem(fileChangeInfos);
                        if (highKpmParent) {
                            treeItems.push(highKpmParent);
                        }
                        mostEditedFileItem = this.buildMostEditedFileItem(fileChangeInfos);
                        if (mostEditedFileItem) {
                            treeItems.push(mostEditedFileItem);
                        }
                        longestCodeTimeParent = this.buildLongestFileCodeTime(fileChangeInfos);
                        if (longestCodeTimeParent) {
                            treeItems.push(longestCodeTimeParent);
                        }
                    }
                }
                return [2 /*return*/, treeItems];
            });
        });
    };
    KpmProviderManager.prototype.getCommitTreeParents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var folders, treeItems, openChangesChildren, committedChangesChildren, i, workspaceFolder, projectDir, currentChagesSummary, name_1, openChangesMetrics, openChangesFolder, todaysChagesSummary, committedChangesMetrics, committedChangesFolder, openChangesParent, committedChangesParent;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        folders = Util_1.getWorkspaceFolders();
                        treeItems = [];
                        if (!(folders && folders.length > 0)) return [3 /*break*/, 6];
                        openChangesChildren = [];
                        committedChangesChildren = [];
                        i = 0;
                        _a.label = 1;
                    case 1:
                        if (!(i < folders.length)) return [3 /*break*/, 5];
                        workspaceFolder = folders[i];
                        projectDir = workspaceFolder.uri.fsPath;
                        return [4 /*yield*/, GitUtil_1.getUncommitedChanges(projectDir)];
                    case 2:
                        currentChagesSummary = _a.sent();
                        name_1 = workspaceFolder.name;
                        openChangesMetrics = [];
                        openChangesMetrics.push(this.buildMetricItem("Insertion(s)", currentChagesSummary.insertions, "", "insertion.svg"));
                        openChangesMetrics.push(this.buildMetricItem("Deletion(s)", currentChagesSummary.deletions, "", "deletion.svg"));
                        openChangesFolder = this.buildParentItem(name_1, "", openChangesMetrics);
                        openChangesChildren.push(openChangesFolder);
                        return [4 /*yield*/, GitUtil_1.getTodaysCommits(projectDir)];
                    case 3:
                        todaysChagesSummary = _a.sent();
                        committedChangesMetrics = [];
                        committedChangesMetrics.push(this.buildMetricItem("Insertion(s)", todaysChagesSummary.insertions, "Number of total insertions today", "insertion.svg"));
                        committedChangesMetrics.push(this.buildMetricItem("Deletion(s)", todaysChagesSummary.deletions, "Number of total deletions today", "deletion.svg"));
                        committedChangesMetrics.push(this.buildMetricItem("Commit(s)", todaysChagesSummary.commitCount, "Number of total commits today", "commit.svg"));
                        committedChangesMetrics.push(this.buildMetricItem("Files changed", todaysChagesSummary.fileCount, "Number of total files changed today", "files.svg"));
                        committedChangesFolder = this.buildParentItem(name_1, "", committedChangesMetrics);
                        committedChangesChildren.push(committedChangesFolder);
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 1];
                    case 5:
                        openChangesParent = this.buildParentItem("Open changes", "Lines added and deleted in this repo that have not yet been committed.", openChangesChildren);
                        treeItems.push(openChangesParent);
                        committedChangesParent = this.buildParentItem("Committed today", "", committedChangesChildren);
                        treeItems.push(committedChangesParent);
                        _a.label = 6;
                    case 6: return [2 /*return*/, treeItems];
                }
            });
        });
    };
    KpmProviderManager.prototype.getTeamTreeParents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var treeItems, activeRootPath, teamMembers, remoteUrl, titleItem, i, member, item, lastCommitInfo, commitItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        treeItems = [];
                        activeRootPath = Util_1.findFirstActiveDirectoryOrWorkspaceDirectory();
                        return [4 /*yield*/, KpmRepoManager_1.getRepoContributors(activeRootPath, false)];
                    case 1:
                        teamMembers = _a.sent();
                        return [4 /*yield*/, GitUtil_1.getRepoUrlLink(activeRootPath)];
                    case 2:
                        remoteUrl = _a.sent();
                        if (!(teamMembers && teamMembers.length)) return [3 /*break*/, 6];
                        titleItem = new models_1.KpmItem();
                        titleItem.label = teamMembers[0].identifier;
                        titleItem.icon = "icons8-github.svg";
                        titleItem.command = "codetime.generateContributorSummary";
                        titleItem.commandArgs = [teamMembers[0].identifier];
                        titleItem.tooltip = "Generate contributor commit summary";
                        treeItems.push(titleItem);
                        i = 0;
                        _a.label = 3;
                    case 3:
                        if (!(i < teamMembers.length)) return [3 /*break*/, 6];
                        member = teamMembers[i];
                        item = new models_1.KpmItem();
                        item.label = member.name;
                        item.description = member.email;
                        item.value = member.identifier;
                        return [4 /*yield*/, GitUtil_1.getLastCommitId(activeRootPath, member.email)];
                    case 4:
                        lastCommitInfo = _a.sent();
                        if (lastCommitInfo && Object.keys(lastCommitInfo).length) {
                            commitItem = new models_1.KpmItem();
                            commitItem.label = lastCommitInfo.comment;
                            commitItem.command = "codetime.launchCommitUrl";
                            commitItem.commandArgs = [
                                remoteUrl + "/commit/" + lastCommitInfo.commitId,
                            ];
                            item.children = [commitItem];
                        }
                        // check to see if this email is in the registered list
                        item.contextValue = "unregistered-member";
                        item.icon = "unregistered-user.svg";
                        treeItems.push(item);
                        _a.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 3];
                    case 6: return [2 /*return*/, treeItems];
                }
            });
        });
    };
    KpmProviderManager.prototype.getCodyConnectButton = function () {
        var item = this.getActionButton("See advanced metrics", "To see your coding data in Code Time, please log in to your account", "codetime.codeTimeLogin", "paw.svg", "TreeViewLogin");
        return item;
    };
    KpmProviderManager.prototype.getWebViewDashboardButton = function () {
        var name = Util_1.getItem("name");
        var loggedInMsg = name ? " Connected as " + name : "";
        var item = this.getActionButton("See advanced metrics", "See rich data visualizations in the web app." + loggedInMsg, "codetime.softwareKpmDashboard", "paw.svg", "TreeViewLaunchWebDashboard");
        return item;
    };
    KpmProviderManager.prototype.getCodeTimeDashboardButton = function () {
        var item = this.getActionButton("View summary", "View your latest coding metrics right here in your editor", "codetime.codeTimeMetrics", "dashboard.svg", "TreeViewLaunchDashboard");
        return item;
    };
    KpmProviderManager.prototype.getAuthTypeIconAndLabel = function () {
        var authType = Util_1.getItem("authType");
        var name = Util_1.getItem("name");
        var tooltip = name ? "Connected as " + name : "";
        if (authType === "software") {
            return {
                icon: "envelope.svg",
                label: "Connected using email",
                tooltip: tooltip
            };
        }
        else if (authType === "google") {
            return {
                icon: "icons8-google.svg",
                label: "Connected using Google",
                tooltip: tooltip
            };
        }
        else if (authType === "github") {
            return {
                icon: "icons8-github.svg",
                label: "Connected using GitHub",
                tooltip: tooltip
            };
        }
        return null;
    };
    KpmProviderManager.prototype.getActionButton = function (label, tooltip, command, icon, eventDescription) {
        if (icon === void 0) { icon = null; }
        if (eventDescription === void 0) { eventDescription = null; }
        var item = new models_1.KpmItem();
        item.tooltip = tooltip;
        item.label = label;
        item.id = label;
        item.command = command;
        item.icon = icon;
        item.contextValue = "action_button";
        item.eventDescription = eventDescription;
        return item;
    };
    KpmProviderManager.prototype.getSessionSummaryItems = function (data) {
        var items = [];
        var values = [];
        // get the editor and session time
        var codeTimeSummary = TimeSummaryData_1.getCodeTimeSummary();
        var wallClktimeStr = Util_1.humanizeMinutes(codeTimeSummary.codeTimeMinutes);
        values.push({ label: "Today: " + wallClktimeStr, icon: "rocket.svg" });
        items.push(this.buildActivityComparisonNodes("Code time", "Code time: total time you have spent in your editor today.", values, vscode_1.TreeItemCollapsibleState.Expanded));
        var dayStr = moment().format("ddd");
        values = [];
        var dayMinutesStr = Util_1.humanizeMinutes(codeTimeSummary.activeCodeTimeMinutes);
        values.push({ label: "Today: " + dayMinutesStr, icon: "rocket.svg" });
        var avgMin = Util_1.humanizeMinutes(data.averageDailyMinutes);
        var activityLightningBolt = codeTimeSummary.activeCodeTimeMinutes > data.averageDailyMinutes
            ? "bolt.svg"
            : "bolt-grey.svg";
        values.push({
            label: "Your average (" + dayStr + "): " + avgMin,
            icon: activityLightningBolt
        });
        var globalMinutesStr = Util_1.humanizeMinutes(data.globalAverageSeconds / 60);
        values.push({
            label: "Global average (" + dayStr + "): " + globalMinutesStr,
            icon: "global-grey.svg"
        });
        items.push(this.buildActivityComparisonNodes("Active code time", "Active code time: total time you have been typing in your editor today.", values, vscode_1.TreeItemCollapsibleState.Expanded));
        values = [];
        var currLinesAdded = this._currentKeystrokeStats.currentDayLinesAdded +
            data.currentDayLinesAdded;
        var linesAdded = numeral(currLinesAdded).format("0 a");
        values.push({ label: "Today: " + linesAdded, icon: "rocket.svg" });
        var userLinesAddedAvg = numeral(data.averageLinesAdded).format("0 a");
        var linesAddedLightningBolt = data.currentDayLinesAdded > data.averageLinesAdded
            ? "bolt.svg"
            : "bolt-grey.svg";
        values.push({
            label: "Your average (" + dayStr + "): " + userLinesAddedAvg,
            icon: linesAddedLightningBolt
        });
        var globalLinesAdded = numeral(data.globalAverageLinesAdded).format("0 a");
        values.push({
            label: "Global average (" + dayStr + "): " + globalLinesAdded,
            icon: "global-grey.svg"
        });
        items.push(this.buildActivityComparisonNodes("Lines added", "", values));
        values = [];
        var currLinesRemoved = this._currentKeystrokeStats.currentDayLinesRemoved +
            data.currentDayLinesRemoved;
        var linesRemoved = numeral(currLinesRemoved).format("0 a");
        values.push({ label: "Today: " + linesRemoved, icon: "rocket.svg" });
        var userLinesRemovedAvg = numeral(data.averageLinesRemoved).format("0 a");
        var linesRemovedLightningBolt = data.currentDayLinesRemoved > data.averageLinesRemoved
            ? "bolt.svg"
            : "bolt-grey.svg";
        values.push({
            label: "Your average (" + dayStr + "): " + userLinesRemovedAvg,
            icon: linesRemovedLightningBolt
        });
        var globalLinesRemoved = numeral(data.globalAverageLinesRemoved).format("0 a");
        values.push({
            label: "Global average (" + dayStr + "): " + globalLinesRemoved,
            icon: "global-grey.svg"
        });
        items.push(this.buildActivityComparisonNodes("Lines removed", "", values));
        values = [];
        var currKeystrokes = this._currentKeystrokeStats.currentDayKeystrokes +
            data.currentDayKeystrokes;
        var keystrokes = numeral(currKeystrokes).format("0 a");
        values.push({ label: "Today: " + keystrokes, icon: "rocket.svg" });
        var userKeystrokesAvg = numeral(data.averageDailyKeystrokes).format("0 a");
        var keystrokesLightningBolt = data.currentDayKeystrokes > data.averageDailyKeystrokes
            ? "bolt.svg"
            : "bolt-grey.svg";
        values.push({
            label: "Your average (" + dayStr + "): " + userKeystrokesAvg,
            icon: keystrokesLightningBolt
        });
        var globalKeystrokes = numeral(data.globalAverageDailyKeystrokes).format("0 a");
        values.push({
            label: "Global average (" + dayStr + "): " + globalKeystrokes,
            icon: "global-grey.svg"
        });
        items.push(this.buildActivityComparisonNodes("Keystrokes", "", values));
        return items;
    };
    KpmProviderManager.prototype.buildMetricItem = function (label, value, tooltip, icon) {
        if (tooltip === void 0) { tooltip = ""; }
        if (icon === void 0) { icon = null; }
        var item = new models_1.KpmItem();
        item.label = label + ": " + value;
        item.id = label + "_metric";
        item.contextValue = "metric_item";
        item.tooltip = tooltip;
        item.icon = icon;
        return item;
    };
    KpmProviderManager.prototype.buildTreeMetricItem = function (label, tooltip, value, icon, collapsibleState) {
        if (icon === void 0) { icon = null; }
        if (collapsibleState === void 0) { collapsibleState = null; }
        var childItem = this.buildMessageItem(value);
        var parentItem = this.buildMessageItem(label, tooltip, icon);
        if (collapsibleState) {
            parentItem.initialCollapsibleState = collapsibleState;
        }
        parentItem.children = [childItem];
        return parentItem;
    };
    KpmProviderManager.prototype.buildActivityComparisonNodes = function (label, tooltip, values, collapsibleState) {
        var _this = this;
        if (collapsibleState === void 0) { collapsibleState = null; }
        var parent = this.buildMessageItem(label, tooltip);
        if (collapsibleState) {
            parent.initialCollapsibleState = collapsibleState;
        }
        values.forEach(function (element) {
            var label = element.label || "";
            var tooltip = element.tooltip || "";
            var icon = element.icon || "";
            var child = _this.buildMessageItem(label, tooltip, icon);
            parent.children.push(child);
        });
        return parent;
    };
    KpmProviderManager.prototype.buildMessageItem = function (label, tooltip, icon, command, commandArgs) {
        if (tooltip === void 0) { tooltip = ""; }
        if (icon === void 0) { icon = null; }
        if (command === void 0) { command = null; }
        if (commandArgs === void 0) { commandArgs = null; }
        label = label.toString();
        var item = new models_1.KpmItem();
        item.label = label;
        item.tooltip = tooltip;
        item.icon = icon;
        item.command = command;
        item.commandArgs = commandArgs;
        item.id = label + "_message";
        item.contextValue = "message_item";
        item.eventDescription = null;
        return item;
    };
    KpmProviderManager.prototype.buildTitleItem = function (label, icon) {
        if (icon === void 0) { icon = null; }
        var item = new models_1.KpmItem();
        item.label = label;
        item.id = label + "_title";
        item.contextValue = "title_item";
        item.icon = icon;
        return item;
    };
    KpmProviderManager.prototype.buildParentItem = function (label, tooltip, children) {
        var item = new models_1.KpmItem();
        item.label = label;
        item.tooltip = tooltip;
        item.id = label + "_title";
        item.contextValue = "title_item";
        item.children = children;
        item.eventDescription = null;
        return item;
    };
    KpmProviderManager.prototype.buildFileItem = function (fileChangeInfo) {
        var item = new models_1.KpmItem();
        item.command = "codetime.openFileInEditor";
        item.commandArgs = [fileChangeInfo.fsPath];
        item.label = fileChangeInfo.name;
        item.tooltip = "Click to open " + fileChangeInfo.fsPath;
        item.id = fileChangeInfo.name + "_file";
        item.contextValue = "file_item";
        item.icon = "readme.svg";
        return item;
    };
    KpmProviderManager.prototype.buildMostEditedFileItem = function (fileChangeInfos) {
        if (!fileChangeInfos || fileChangeInfos.length === 0) {
            return null;
        }
        // Most Edited File
        var sortedArray = fileChangeInfos.sort(function (a, b) { return b.keystrokes - a.keystrokes; });
        var mostEditedChildren = [];
        var len = Math.min(3, sortedArray.length);
        for (var i = 0; i < len; i++) {
            var fileName = sortedArray[i].name;
            var keystrokes = sortedArray[i].keystrokes || 0;
            var keystrokesStr = numeral(keystrokes).format("0 a");
            var label = fileName + " | " + keystrokesStr;
            var messageItem = this.buildMessageItem(label, "", null, "codetime.openFileInEditor", [sortedArray[i].fsPath]);
            mostEditedChildren.push(messageItem);
        }
        var mostEditedParent = this.buildParentItem("Top files by keystrokes", "", mostEditedChildren);
        return mostEditedParent;
    };
    KpmProviderManager.prototype.buildHighestKpmFileItem = function (fileChangeInfos) {
        if (!fileChangeInfos || fileChangeInfos.length === 0) {
            return null;
        }
        // Highest KPM
        var sortedArray = fileChangeInfos.sort(function (a, b) { return b.kpm - a.kpm; });
        var highKpmChildren = [];
        var len = Math.min(3, sortedArray.length);
        for (var i = 0; i < len; i++) {
            var fileName = sortedArray[i].name;
            var kpm = sortedArray[i].kpm || 0;
            var kpmStr = kpm.toFixed(2);
            var label = fileName + " | " + kpmStr;
            var messageItem = this.buildMessageItem(label, "", null, "codetime.openFileInEditor", [sortedArray[i].fsPath]);
            highKpmChildren.push(messageItem);
        }
        var highKpmParent = this.buildParentItem("Top files by KPM", "Top files by KPM (keystrokes per minute)", highKpmChildren);
        return highKpmParent;
    };
    KpmProviderManager.prototype.buildLongestFileCodeTime = function (fileChangeInfos) {
        if (!fileChangeInfos || fileChangeInfos.length === 0) {
            return null;
        }
        // Longest Code Time
        var sortedArray = fileChangeInfos.sort(function (a, b) {
            return b.duration_seconds - a.duration_seconds;
        });
        var longestCodeTimeChildren = [];
        var len = Math.min(3, sortedArray.length);
        for (var i = 0; i < len; i++) {
            var fileName = sortedArray[i].name;
            var minutes = sortedArray[i].duration_seconds || 0;
            var duration_minutes = minutes > 0 ? minutes / 60 : 0;
            var codeHours = Util_1.humanizeMinutes(duration_minutes);
            var label = fileName + " | " + codeHours;
            var messageItem = this.buildMessageItem(label, "", null, "codetime.openFileInEditor", [sortedArray[i].fsPath]);
            longestCodeTimeChildren.push(messageItem);
        }
        var longestCodeTimeParent = this.buildParentItem("Top files by code time", "", longestCodeTimeChildren);
        return longestCodeTimeParent;
    };
    return KpmProviderManager;
}());
exports.KpmProviderManager = KpmProviderManager;
/**
 * The TreeItem contains the "contextValue", which is represented as the "viewItem"
 * from within the package.json when determining if there should be decoracted context
 * based on that value.
 */
var KpmTreeItem = /** @class */ (function (_super) {
    __extends(KpmTreeItem, _super);
    function KpmTreeItem(treeItem, collapsibleState, command) {
        var _this = _super.call(this, treeItem.label, collapsibleState) || this;
        _this.treeItem = treeItem;
        _this.collapsibleState = collapsibleState;
        _this.command = command;
        _this.iconPath = {
            light: "",
            dark: ""
        };
        _this.contextValue = "treeItem";
        var _a = getTreeItemIcon(treeItem), lightPath = _a.lightPath, darkPath = _a.darkPath;
        if (treeItem.description) {
            _this.description = treeItem.description;
        }
        if (lightPath && darkPath) {
            _this.iconPath.light = lightPath;
            _this.iconPath.dark = darkPath;
        }
        else {
            // no matching tag, remove the tree item icon path
            delete _this.iconPath;
        }
        _this.contextValue = getTreeItemContextValue(treeItem);
        return _this;
    }
    Object.defineProperty(KpmTreeItem.prototype, "tooltip", {
        get: function () {
            if (!this.treeItem) {
                return "";
            }
            if (this.treeItem.tooltip) {
                return this.treeItem.tooltip;
            }
            else {
                return this.treeItem.label;
            }
        },
        enumerable: false,
        configurable: true
    });
    return KpmTreeItem;
}(vscode_1.TreeItem));
exports.KpmTreeItem = KpmTreeItem;
function getTreeItemIcon(treeItem) {
    var iconName = treeItem.icon;
    var lightPath = iconName && treeItem.children.length === 0
        ? path.join(resourcePath, "light", iconName)
        : null;
    var darkPath = iconName && treeItem.children.length === 0
        ? path.join(resourcePath, "dark", iconName)
        : null;
    return { lightPath: lightPath, darkPath: darkPath };
}
function getTreeItemContextValue(treeItem) {
    if (treeItem.contextValue) {
        return treeItem.contextValue;
    }
    if (treeItem.children.length) {
        return "parent";
    }
    return "child";
}
exports.handleKpmChangeSelection = function (view, item) {
    if (item.command) {
        var args = item.commandArgs || null;
        if (args) {
            vscode_1.commands.executeCommand.apply(vscode_1.commands, __spreadArrays([item.command], args));
        }
        else {
            // run the command
            vscode_1.commands.executeCommand(item.command);
        }
        // send event types
        if (item.eventDescription) {
            EventManager_1.EventManager.getInstance().createCodeTimeEvent("mouse", "click", item.eventDescription);
        }
    }
    // deselect it
    try {
        // re-select the track without focus
        view.reveal(item, {
            focus: false,
            select: false
        });
    }
    catch (err) {
        Util_1.logIt("Unable to deselect track: " + err.message);
    }
};
