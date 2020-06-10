"use strict";
/**
 * File that contains method and class that enable displaying
 * user's team info
 *
 * Contain TeamDataProvider and TeamItem class.
 *
 * @file   This files defines the MyClass class.
 * @author AuthorName.
 */
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
exports.handleTeamInfoChangeSelection = exports.connectCloud9TeamInfoTreeView = exports.TeamItem = exports.TeamDataProvider = void 0;
const vscode_1 = require("vscode");
const Authentication_1 = require("./Authentication");
const Constants_1 = require("./Constants");
/**
 * Team data provider
 */
class TeamDataProvider {
    /**
     * Creates an instance of team data provider.
     */
    constructor() {
        this._onDidChangeTreeData = new vscode_1.EventEmitter();
        this.onDidChangeTreeData = this
            ._onDidChangeTreeData.event;
        this.data = [
            new TeamItem(Constants_1.TEAM_INFO_CREATE_TEAM_TREEVIEW),
            new TeamItem(Constants_1.TEAM_INFO_JOIN_TEAM_TREEVIEW),
        ];
    }
    /**
     * Refreshs team data provider
     */
    refresh() {
        const ctx = Authentication_1.getExtensionContext();
        const cachedTeamId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_ID);
        const teamName = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_NAME);
        const teamId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_ID);
        if (cachedTeamId === undefined || cachedTeamId === "") {
            this.data = [
                new TeamItem(Constants_1.TEAM_INFO_CREATE_TEAM_TREEVIEW),
                new TeamItem(Constants_1.TEAM_INFO_JOIN_TEAM_TREEVIEW),
            ];
        }
        else {
            this.data = [
                new TeamItem(Constants_1.TEAM_INFO_WELCOME_BACK_TO_TEAM_TREEVIEW),
                new TeamItem(Constants_1.TEAM_INFO_VIEW_TEAM_LEADERBOARD_TREEVIEW),
                new TeamItem(Constants_1.TEAM_INFO_GET_TEAM_INFO_TREEVIEW, [
                    new TeamItem(Constants_1.TEAM_INFO_TEAM_NAME_TREEVIEW, [
                        new TeamItem(teamName + ""),
                    ]),
                    new TeamItem(Constants_1.TEAM_INFO_TEAM_ID_TREEVIEW, [new TeamItem(teamId + "")]),
                ]),
            ];
        }
        this._onDidChangeTreeData.fire(null);
    }
    /**
     * Binds view
     * @param menuTreeView
     */
    bindView(menuTreeView) {
        this.view = menuTreeView;
    }
    /**
     * Gets children
     * @param [task]
     * @returns children
     */
    getChildren(task) {
        if (task === undefined) {
            return this.data;
        }
        return task.children;
    }
    /**
     * Gets tree item
     * @param task
     * @returns tree item
     */
    getTreeItem(task) {
        return task;
    }
}
exports.TeamDataProvider = TeamDataProvider;
/**
 * Team item
 */
class TeamItem extends vscode_1.TreeItem {
    constructor(label, children) {
        super(label, children === undefined
            ? vscode_1.TreeItemCollapsibleState.None
            : vscode_1.TreeItemCollapsibleState.Collapsed);
        this.children = children;
    }
}
exports.TeamItem = TeamItem;
/**
 * Connect team info provider treeview with change selectioin.
 * @param view
 */
exports.connectCloud9TeamInfoTreeView = (view) => {
    return vscode_1.Disposable.from(view.onDidChangeSelection((e) => __awaiter(void 0, void 0, void 0, function* () {
        if (!e.selection || e.selection.length === 0) {
            return;
        }
        const item = e.selection[0];
        exports.handleTeamInfoChangeSelection(view, item);
    })));
};
/**
 * Handles for team info treeview item selections
 * @param view
 * @param item
 */
exports.handleTeamInfoChangeSelection = (view, item) => {
    if (item.label === Constants_1.TEAM_INFO_CREATE_TEAM_TREEVIEW) {
        vscode_1.commands.executeCommand("cloud9.createTeam");
    }
    else if (item.label === Constants_1.TEAM_INFO_JOIN_TEAM_TREEVIEW) {
        vscode_1.commands.executeCommand("cloud9.joinTeam");
    }
    else if (item.label === Constants_1.TEAM_INFO_VIEW_TEAM_LEADERBOARD_TREEVIEW) {
        vscode_1.commands.executeCommand("cloud9.teamLeaderboard");
    }
    else if (item.label === Constants_1.TEAM_INFO_GET_TEAM_INFO_TREEVIEW) {
        const ctx = Authentication_1.getExtensionContext();
        const teamName = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_NAME);
        const teamId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_ID);
        if (teamId == undefined || teamId == "") {
            item.children = [
                new TeamItem(Constants_1.TEAM_INFO_TEAM_NAME_TREEVIEW, [
                    new TeamItem("Empty (Please join a team first)"),
                ]),
                new TeamItem(Constants_1.TEAM_INFO_TEAM_ID_TREEVIEW, [
                    new TeamItem("Empty (Please join a team first)"),
                ]),
            ];
        }
        else {
            item.children = [
                new TeamItem(Constants_1.TEAM_INFO_TEAM_NAME_TREEVIEW, [
                    new TeamItem(teamName + ""),
                ]),
                new TeamItem(Constants_1.TEAM_INFO_TEAM_ID_TREEVIEW, [new TeamItem(teamId + "")]),
            ];
        }
        vscode_1.commands.executeCommand("TeamMenuView.refreshEntry");
    }
};
//# sourceMappingURL=TeamDataProvider.js.map