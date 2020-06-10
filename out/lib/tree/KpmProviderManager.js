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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleKpmChangeSelection = exports.KpmTreeItem = exports.KpmProviderManager = void 0;
const models_1 = require("../model/models");
const DataController_1 = require("../DataController");
const Util_1 = require("../Util");
const GitUtil_1 = require("../repo/GitUtil");
const vscode_1 = require("vscode");
const FileChangeInfoSummaryData_1 = require("../storage/FileChangeInfoSummaryData");
const SessionSummaryData_1 = require("../storage/SessionSummaryData");
const EventManager_1 = require("../managers/EventManager");
const KpmRepoManager_1 = require("../repo/KpmRepoManager");
const TimeSummaryData_1 = require("../storage/TimeSummaryData");
const numeral = require("numeral");
const moment = require("moment-timezone");
const path = require("path");
// this current path is in the out/lib. We need to find the resource files
// which are in out/resources
const resourcePath = path.join(__filename, "..", "..", "..", "resources");
let counter = 0;
class KpmProviderManager {
    constructor() {
        this._currentKeystrokeStats = new models_1.SessionSummary();
        //
    }
    static getInstance() {
        if (!KpmProviderManager.instance) {
            KpmProviderManager.instance = new KpmProviderManager();
        }
        return KpmProviderManager.instance;
    }
    setCurrentKeystrokeStats(keystrokeStats) {
        if (keystrokeStats) {
            // update the current stats
            Object.keys(keystrokeStats.source).forEach((key) => {
                const fileInfo = keystrokeStats.source[key];
                this._currentKeystrokeStats.currentDayKeystrokes = fileInfo.keystrokes;
                this._currentKeystrokeStats.currentDayLinesAdded = fileInfo.linesAdded;
                this._currentKeystrokeStats.currentDayLinesRemoved =
                    fileInfo.linesRemoved;
            });
        }
    }
    getOptionsTreeParents() {
        return __awaiter(this, void 0, void 0, function* () {
            counter++;
            const space = counter % 2 === 0 ? "" : " ";
            const treeItems = [];
            const loggedIn = yield DataController_1.isLoggedIn();
            if (!loggedIn) {
                const signupWithGoogle = `Sign up with Google${space}`;
                const googleSignupButton = this.getActionButton(signupWithGoogle, "", "codetime.googleLogin", "icons8-google.svg");
                // treeItems.push(googleSignupButton);
                const signupWithGithub = `Sign up with GitHub${space}`;
                const githubSignupButton = this.getActionButton(signupWithGithub, "", "codetime.githubLogin", "icons8-github.svg");
                treeItems.push(githubSignupButton);
                const signupWithEmail = `Sign up with email${space}`;
                const softwareSignupButton = this.getActionButton(signupWithEmail, "", "codetime.codeTimeLogin", "envelope.svg");
                treeItems.push(softwareSignupButton);
                const dividerButton = this.getActionButton("", "", "", "blue-line-96.png");
                treeItems.push(dividerButton);
            }
            else {
                const connectedToInfo = this.getAuthTypeIconAndLabel();
                if (connectedToInfo) {
                    const connectedToButton = this.getActionButton(connectedToInfo.label, connectedToInfo.tooltip, null, connectedToInfo.icon);
                    treeItems.push(connectedToButton);
                }
                // show the web dashboard button
                treeItems.push(this.getWebViewDashboardButton());
            }
            // toggle status bar button
            let toggleStatusBarTextLabel = "Hide status bar metrics";
            let toggleStatusBarIcon = "visible.svg";
            if (!Util_1.isStatusBarTextVisible()) {
                toggleStatusBarTextLabel = "Show status bar metrics";
            }
            const toggleStatusBarButton = this.getActionButton(toggleStatusBarTextLabel, "Toggle the Code Time status bar metrics text", "codetime.toggleStatusBar", toggleStatusBarIcon);
            treeItems.push(toggleStatusBarButton);
            // readme button
            const learnMoreLabel = `Learn more${space}`;
            const readmeButton = this.getActionButton(learnMoreLabel, "View the Code Time Readme to learn more", "codetime.displayReadme", "readme.svg");
            treeItems.push(readmeButton);
            const feedbackButton = this.getActionButton("Submit feedback", "Send us an email at cody@software.com", "codetime.sendFeedback", "message.svg");
            treeItems.push(feedbackButton);
            // const submitReportButton: KpmItem = this.getActionButton(
            //     "Generate slack report",
            //     "",
            //     "codetime.generateSlackReport",
            //     "slack.svg"
            // );
            // treeItems.push(submitReportButton);
            const reportDividerButton = this.getActionButton("", "", "", "blue-line-96.png");
            treeItems.push(reportDividerButton);
            // codetime metrics editor dashboard
            treeItems.push(this.getCodeTimeDashboardButton());
            // generate codetime commit project data
            const commitSummitLabel = `View project summary${space}`;
            const generateProjectSummaryButton = this.getActionButton(commitSummitLabel, "", "codetime.generateProjectSummary", "folder.svg");
            treeItems.push(generateProjectSummaryButton);
            // const addProjectNoteLabel: string = `Add a note${space}`;
            // const addProjectNoteButton: KpmItem = this.getActionButton(
            //     addProjectNoteLabel,
            //     "",
            //     "codetime.addProjectNote",
            //     "message.svg"
            // );
            // treeItems.push(addProjectNoteButton);
            return treeItems;
        });
    }
    getDailyMetricsTreeParents() {
        return __awaiter(this, void 0, void 0, function* () {
            const treeItems = [];
            const kpmTreeParents = yield this.getKpmTreeParents();
            treeItems.push(...kpmTreeParents);
            const commitTreeParents = yield this.getCommitTreeParents();
            treeItems.push(...commitTreeParents);
            return treeItems;
        });
    }
    getKpmTreeParents() {
        return __awaiter(this, void 0, void 0, function* () {
            const treeItems = [];
            const sessionSummaryData = SessionSummaryData_1.getSessionSummaryData();
            // get the session summary data
            const currentKeystrokesItems = this.getSessionSummaryItems(sessionSummaryData);
            // show the metrics per line
            treeItems.push(...currentKeystrokesItems);
            // show the files changed metric
            const fileChangeInfoMap = FileChangeInfoSummaryData_1.getFileChangeSummaryAsJson();
            const filesChanged = fileChangeInfoMap
                ? Object.keys(fileChangeInfoMap).length
                : 0;
            if (filesChanged > 0) {
                treeItems.push(this.buildTreeMetricItem("Files changed", "Files changed today", `Today: ${filesChanged}`));
                // get the file change info
                if (filesChanged) {
                    // turn this into an array
                    const fileChangeInfos = Object.keys(fileChangeInfoMap).map((key) => {
                        return fileChangeInfoMap[key];
                    });
                    // Highest KPM
                    const highKpmParent = this.buildHighestKpmFileItem(fileChangeInfos);
                    if (highKpmParent) {
                        treeItems.push(highKpmParent);
                    }
                    // Most Edited File
                    const mostEditedFileItem = this.buildMostEditedFileItem(fileChangeInfos);
                    if (mostEditedFileItem) {
                        treeItems.push(mostEditedFileItem);
                    }
                    // Longest Code Time
                    const longestCodeTimeParent = this.buildLongestFileCodeTime(fileChangeInfos);
                    if (longestCodeTimeParent) {
                        treeItems.push(longestCodeTimeParent);
                    }
                }
            }
            return treeItems;
        });
    }
    getCommitTreeParents() {
        return __awaiter(this, void 0, void 0, function* () {
            const folders = Util_1.getWorkspaceFolders();
            const treeItems = [];
            // show the git insertions and deletions
            if (folders && folders.length > 0) {
                const openChangesChildren = [];
                const committedChangesChildren = [];
                for (let i = 0; i < folders.length; i++) {
                    const workspaceFolder = folders[i];
                    const projectDir = workspaceFolder.uri.fsPath;
                    const currentChagesSummary = yield GitUtil_1.getUncommitedChanges(projectDir);
                    // get the folder name from the path
                    const name = workspaceFolder.name;
                    const openChangesMetrics = [];
                    openChangesMetrics.push(this.buildMetricItem("Insertion(s)", currentChagesSummary.insertions, "", "insertion.svg"));
                    openChangesMetrics.push(this.buildMetricItem("Deletion(s)", currentChagesSummary.deletions, "", "deletion.svg"));
                    const openChangesFolder = this.buildParentItem(name, "", openChangesMetrics);
                    openChangesChildren.push(openChangesFolder);
                    const todaysChagesSummary = yield GitUtil_1.getTodaysCommits(projectDir);
                    const committedChangesMetrics = [];
                    committedChangesMetrics.push(this.buildMetricItem("Insertion(s)", todaysChagesSummary.insertions, "Number of total insertions today", "insertion.svg"));
                    committedChangesMetrics.push(this.buildMetricItem("Deletion(s)", todaysChagesSummary.deletions, "Number of total deletions today", "deletion.svg"));
                    committedChangesMetrics.push(this.buildMetricItem("Commit(s)", todaysChagesSummary.commitCount, "Number of total commits today", "commit.svg"));
                    committedChangesMetrics.push(this.buildMetricItem("Files changed", todaysChagesSummary.fileCount, "Number of total files changed today", "files.svg"));
                    const committedChangesFolder = this.buildParentItem(name, "", committedChangesMetrics);
                    committedChangesChildren.push(committedChangesFolder);
                }
                const openChangesParent = this.buildParentItem("Open changes", "Lines added and deleted in this repo that have not yet been committed.", openChangesChildren);
                treeItems.push(openChangesParent);
                const committedChangesParent = this.buildParentItem("Committed today", "", committedChangesChildren);
                treeItems.push(committedChangesParent);
            }
            return treeItems;
        });
    }
    getTeamTreeParents() {
        return __awaiter(this, void 0, void 0, function* () {
            const treeItems = [];
            const activeRootPath = Util_1.findFirstActiveDirectoryOrWorkspaceDirectory();
            // get team members
            const teamMembers = yield KpmRepoManager_1.getRepoContributors(activeRootPath, false);
            const remoteUrl = yield GitUtil_1.getRepoUrlLink(activeRootPath);
            if (teamMembers && teamMembers.length) {
                // get the 1st one to get the identifier
                const titleItem = new models_1.KpmItem();
                titleItem.label = teamMembers[0].identifier;
                titleItem.icon = "icons8-github.svg";
                titleItem.command = "codetime.generateContributorSummary";
                titleItem.commandArgs = [teamMembers[0].identifier];
                titleItem.tooltip = "Generate contributor commit summary";
                treeItems.push(titleItem);
                for (let i = 0; i < teamMembers.length; i++) {
                    const member = teamMembers[i];
                    const item = new models_1.KpmItem();
                    item.label = member.name;
                    item.description = member.email;
                    item.value = member.identifier;
                    // get their last commit
                    const lastCommitInfo = yield GitUtil_1.getLastCommitId(activeRootPath, member.email);
                    if (lastCommitInfo && Object.keys(lastCommitInfo).length) {
                        // add this as child
                        const commitItem = new models_1.KpmItem();
                        commitItem.label = lastCommitInfo.comment;
                        commitItem.command = "codetime.launchCommitUrl";
                        commitItem.commandArgs = [
                            `${remoteUrl}/commit/${lastCommitInfo.commitId}`,
                        ];
                        item.children = [commitItem];
                    }
                    // check to see if this email is in the registered list
                    item.contextValue = "unregistered-member";
                    item.icon = "unregistered-user.svg";
                    treeItems.push(item);
                }
            }
            return treeItems;
        });
    }
    getCodyConnectButton() {
        const item = this.getActionButton("See advanced metrics", `To see your coding data in Code Time, please log in to your account`, "codetime.codeTimeLogin", "paw.svg", "TreeViewLogin");
        return item;
    }
    getWebViewDashboardButton() {
        const name = Util_1.getItem("name");
        const loggedInMsg = name ? ` Connected as ${name}` : "";
        const item = this.getActionButton("See advanced metrics", `See rich data visualizations in the web app.${loggedInMsg}`, "codetime.softwareKpmDashboard", "paw.svg", "TreeViewLaunchWebDashboard");
        return item;
    }
    getCodeTimeDashboardButton() {
        const item = this.getActionButton("View summary", "View your latest coding metrics right here in your editor", "codetime.codeTimeMetrics", "dashboard.svg", "TreeViewLaunchDashboard");
        return item;
    }
    getAuthTypeIconAndLabel() {
        const authType = Util_1.getItem("authType");
        const name = Util_1.getItem("name");
        let tooltip = name ? `Connected as ${name}` : "";
        if (authType === "software") {
            return {
                icon: "envelope.svg",
                label: "Connected using email",
                tooltip,
            };
        }
        else if (authType === "google") {
            return {
                icon: "icons8-google.svg",
                label: "Connected using Google",
                tooltip,
            };
        }
        else if (authType === "github") {
            return {
                icon: "icons8-github.svg",
                label: "Connected using GitHub",
                tooltip,
            };
        }
        return null;
    }
    getActionButton(label, tooltip, command, icon = null, eventDescription = null) {
        const item = new models_1.KpmItem();
        item.tooltip = tooltip;
        item.label = label;
        item.id = label;
        item.command = command;
        item.icon = icon;
        item.contextValue = "action_button";
        item.eventDescription = eventDescription;
        return item;
    }
    getSessionSummaryItems(data) {
        const items = [];
        let values = [];
        // get the editor and session time
        const codeTimeSummary = TimeSummaryData_1.getCodeTimeSummary();
        const wallClktimeStr = Util_1.humanizeMinutes(codeTimeSummary.codeTimeMinutes);
        values.push({ label: `Today: ${wallClktimeStr}`, icon: "rocket.svg" });
        items.push(this.buildActivityComparisonNodes("Code time", "Code time: total time you have spent in your editor today.", values, vscode_1.TreeItemCollapsibleState.Expanded));
        const dayStr = moment().format("ddd");
        values = [];
        const dayMinutesStr = Util_1.humanizeMinutes(codeTimeSummary.activeCodeTimeMinutes);
        values.push({ label: `Today: ${dayMinutesStr}`, icon: "rocket.svg" });
        const avgMin = Util_1.humanizeMinutes(data.averageDailyMinutes);
        const activityLightningBolt = codeTimeSummary.activeCodeTimeMinutes > data.averageDailyMinutes
            ? "bolt.svg"
            : "bolt-grey.svg";
        values.push({
            label: `Your average (${dayStr}): ${avgMin}`,
            icon: activityLightningBolt,
        });
        const globalMinutesStr = Util_1.humanizeMinutes(data.globalAverageSeconds / 60);
        values.push({
            label: `Global average (${dayStr}): ${globalMinutesStr}`,
            icon: "global-grey.svg",
        });
        items.push(this.buildActivityComparisonNodes("Active code time", "Active code time: total time you have been typing in your editor today.", values, vscode_1.TreeItemCollapsibleState.Expanded));
        values = [];
        const currLinesAdded = this._currentKeystrokeStats.currentDayLinesAdded +
            data.currentDayLinesAdded;
        const linesAdded = numeral(currLinesAdded).format("0 a");
        values.push({ label: `Today: ${linesAdded}`, icon: "rocket.svg" });
        const userLinesAddedAvg = numeral(data.averageLinesAdded).format("0 a");
        const linesAddedLightningBolt = data.currentDayLinesAdded > data.averageLinesAdded
            ? "bolt.svg"
            : "bolt-grey.svg";
        values.push({
            label: `Your average (${dayStr}): ${userLinesAddedAvg}`,
            icon: linesAddedLightningBolt,
        });
        const globalLinesAdded = numeral(data.globalAverageLinesAdded).format("0 a");
        values.push({
            label: `Global average (${dayStr}): ${globalLinesAdded}`,
            icon: "global-grey.svg",
        });
        items.push(this.buildActivityComparisonNodes("Lines added", "", values));
        values = [];
        const currLinesRemoved = this._currentKeystrokeStats.currentDayLinesRemoved +
            data.currentDayLinesRemoved;
        const linesRemoved = numeral(currLinesRemoved).format("0 a");
        values.push({ label: `Today: ${linesRemoved}`, icon: "rocket.svg" });
        const userLinesRemovedAvg = numeral(data.averageLinesRemoved).format("0 a");
        const linesRemovedLightningBolt = data.currentDayLinesRemoved > data.averageLinesRemoved
            ? "bolt.svg"
            : "bolt-grey.svg";
        values.push({
            label: `Your average (${dayStr}): ${userLinesRemovedAvg}`,
            icon: linesRemovedLightningBolt,
        });
        const globalLinesRemoved = numeral(data.globalAverageLinesRemoved).format("0 a");
        values.push({
            label: `Global average (${dayStr}): ${globalLinesRemoved}`,
            icon: "global-grey.svg",
        });
        items.push(this.buildActivityComparisonNodes("Lines removed", "", values));
        values = [];
        const currKeystrokes = this._currentKeystrokeStats.currentDayKeystrokes +
            data.currentDayKeystrokes;
        const keystrokes = numeral(currKeystrokes).format("0 a");
        values.push({ label: `Today: ${keystrokes}`, icon: "rocket.svg" });
        const userKeystrokesAvg = numeral(data.averageDailyKeystrokes).format("0 a");
        const keystrokesLightningBolt = data.currentDayKeystrokes > data.averageDailyKeystrokes
            ? "bolt.svg"
            : "bolt-grey.svg";
        values.push({
            label: `Your average (${dayStr}): ${userKeystrokesAvg}`,
            icon: keystrokesLightningBolt,
        });
        const globalKeystrokes = numeral(data.globalAverageDailyKeystrokes).format("0 a");
        values.push({
            label: `Global average (${dayStr}): ${globalKeystrokes}`,
            icon: "global-grey.svg",
        });
        items.push(this.buildActivityComparisonNodes(DAILY_METRIC_KEYSTROKES_TREEVIEW, "", values));
        return items;
    }
    buildMetricItem(label, value, tooltip = "", icon = null) {
        const item = new models_1.KpmItem();
        item.label = `${label}: ${value}`;
        item.id = `${label}_metric`;
        item.contextValue = "metric_item";
        item.tooltip = tooltip;
        item.icon = icon;
        return item;
    }
    buildTreeMetricItem(label, tooltip, value, icon = null, collapsibleState = null) {
        const childItem = this.buildMessageItem(value);
        const parentItem = this.buildMessageItem(label, tooltip, icon);
        if (collapsibleState) {
            parentItem.initialCollapsibleState = collapsibleState;
        }
        parentItem.children = [childItem];
        return parentItem;
    }
    buildActivityComparisonNodes(label, tooltip, values, collapsibleState = null) {
        const parent = this.buildMessageItem(label, tooltip);
        if (collapsibleState) {
            parent.initialCollapsibleState = collapsibleState;
        }
        values.forEach((element) => {
            const label = element.label || "";
            const tooltip = element.tooltip || "";
            const icon = element.icon || "";
            const child = this.buildMessageItem(label, tooltip, icon);
            parent.children.push(child);
        });
        return parent;
    }
    buildMessageItem(label, tooltip = "", icon = null, command = null, commandArgs = null) {
        label = label.toString();
        const item = new models_1.KpmItem();
        item.label = label;
        item.tooltip = tooltip;
        item.icon = icon;
        item.command = command;
        item.commandArgs = commandArgs;
        item.id = `${label}_message`;
        item.contextValue = "message_item";
        item.eventDescription = null;
        return item;
    }
    buildTitleItem(label, icon = null) {
        const item = new models_1.KpmItem();
        item.label = label;
        item.id = `${label}_title`;
        item.contextValue = "title_item";
        item.icon = icon;
        return item;
    }
    buildParentItem(label, tooltip, children) {
        const item = new models_1.KpmItem();
        item.label = label;
        item.tooltip = tooltip;
        item.id = `${label}_title`;
        item.contextValue = "title_item";
        item.children = children;
        item.eventDescription = null;
        return item;
    }
    buildFileItem(fileChangeInfo) {
        const item = new models_1.KpmItem();
        item.command = "codetime.openFileInEditor";
        item.commandArgs = [fileChangeInfo.fsPath];
        item.label = fileChangeInfo.name;
        item.tooltip = `Click to open ${fileChangeInfo.fsPath}`;
        item.id = `${fileChangeInfo.name}_file`;
        item.contextValue = "file_item";
        item.icon = "readme.svg";
        return item;
    }
    buildMostEditedFileItem(fileChangeInfos) {
        if (!fileChangeInfos || fileChangeInfos.length === 0) {
            return null;
        }
        // Most Edited File
        const sortedArray = fileChangeInfos.sort((a, b) => b.keystrokes - a.keystrokes);
        const mostEditedChildren = [];
        const len = Math.min(3, sortedArray.length);
        for (let i = 0; i < len; i++) {
            const fileName = sortedArray[i].name;
            const keystrokes = sortedArray[i].keystrokes || 0;
            const keystrokesStr = numeral(keystrokes).format("0 a");
            const label = `${fileName} | ${keystrokesStr}`;
            const messageItem = this.buildMessageItem(label, "", null, "codetime.openFileInEditor", [sortedArray[i].fsPath]);
            mostEditedChildren.push(messageItem);
        }
        const mostEditedParent = this.buildParentItem("Top files by keystrokes", "", mostEditedChildren);
        return mostEditedParent;
    }
    buildHighestKpmFileItem(fileChangeInfos) {
        if (!fileChangeInfos || fileChangeInfos.length === 0) {
            return null;
        }
        // Highest KPM
        const sortedArray = fileChangeInfos.sort((a, b) => b.kpm - a.kpm);
        const highKpmChildren = [];
        const len = Math.min(3, sortedArray.length);
        for (let i = 0; i < len; i++) {
            const fileName = sortedArray[i].name;
            const kpm = sortedArray[i].kpm || 0;
            const kpmStr = kpm.toFixed(2);
            const label = `${fileName} | ${kpmStr}`;
            const messageItem = this.buildMessageItem(label, "", null, "codetime.openFileInEditor", [sortedArray[i].fsPath]);
            highKpmChildren.push(messageItem);
        }
        const highKpmParent = this.buildParentItem("Top files by KPM", "Top files by KPM (keystrokes per minute)", highKpmChildren);
        return highKpmParent;
    }
    buildLongestFileCodeTime(fileChangeInfos) {
        if (!fileChangeInfos || fileChangeInfos.length === 0) {
            return null;
        }
        // Longest Code Time
        const sortedArray = fileChangeInfos.sort((a, b) => b.duration_seconds - a.duration_seconds);
        const longestCodeTimeChildren = [];
        const len = Math.min(3, sortedArray.length);
        for (let i = 0; i < len; i++) {
            const fileName = sortedArray[i].name;
            const minutes = sortedArray[i].duration_seconds || 0;
            const duration_minutes = minutes > 0 ? minutes / 60 : 0;
            const codeHours = Util_1.humanizeMinutes(duration_minutes);
            const label = `${fileName} | ${codeHours}`;
            const messageItem = this.buildMessageItem(label, "", null, "codetime.openFileInEditor", [sortedArray[i].fsPath]);
            longestCodeTimeChildren.push(messageItem);
        }
        const longestCodeTimeParent = this.buildParentItem("Top files by code time", "", longestCodeTimeChildren);
        return longestCodeTimeParent;
    }
}
exports.KpmProviderManager = KpmProviderManager;
/**
 * The TreeItem contains the "contextValue", which is represented as the "viewItem"
 * from within the package.json when determining if there should be decoracted context
 * based on that value.
 */
class KpmTreeItem extends vscode_1.TreeItem {
    constructor(treeItem, collapsibleState, command) {
        super(treeItem.label, collapsibleState);
        this.treeItem = treeItem;
        this.collapsibleState = collapsibleState;
        this.command = command;
        this.iconPath = {
            light: "",
            dark: "",
        };
        this.contextValue = "treeItem";
        const { lightPath, darkPath } = getTreeItemIcon(treeItem);
        if (treeItem.description) {
            this.description = treeItem.description;
        }
        if (lightPath && darkPath) {
            this.iconPath.light = lightPath;
            this.iconPath.dark = darkPath;
        }
        else {
            // no matching tag, remove the tree item icon path
            delete this.iconPath;
        }
        this.contextValue = getTreeItemContextValue(treeItem);
    }
    get tooltip() {
        if (!this.treeItem) {
            return "";
        }
        if (this.treeItem.tooltip) {
            return this.treeItem.tooltip;
        }
        else {
            return this.treeItem.label;
        }
    }
}
exports.KpmTreeItem = KpmTreeItem;
function getTreeItemIcon(treeItem) {
    const iconName = treeItem.icon;
    const lightPath = iconName && treeItem.children.length === 0
        ? path.join(resourcePath, "light", iconName)
        : null;
    const darkPath = iconName && treeItem.children.length === 0
        ? path.join(resourcePath, "dark", iconName)
        : null;
    return { lightPath, darkPath };
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
exports.handleKpmChangeSelection = (view, item) => {
    if (item.command) {
        const args = item.commandArgs || null;
        if (args) {
            vscode_1.commands.executeCommand(item.command, ...args);
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
            select: false,
        });
    }
    catch (err) {
        Util_1.logIt(`Unable to deselect track: ${err.message}`);
    }
};
//# sourceMappingURL=KpmProviderManager.js.map