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
class TeamDataProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode_1.EventEmitter();
        this.onDidChangeTreeData = this
            ._onDidChangeTreeData.event;
        this.data = [
            new TeamItem('🛡 Create your Team'),
            new TeamItem('🔰 Join team'),
        ];
    }
    refresh() {
        const ctx = Authentication_1.getExtensionContext();
        const cachedTeamId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_ID);
        const teamName = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_NAME);
        const teamId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_ID);
        if (cachedTeamId === undefined || cachedTeamId === '') {
            this.data = [
                new TeamItem('🛡 Create your Team'),
                new TeamItem('🔰 Join team'),
            ];
            console.log('NO team');
        }
        else {
            this.data = [
                new TeamItem('🛡 Welcome back to your Team'),
                new TeamItem('📋 View team leaderboard'),
                new TeamItem('Get Team Info', [
                    new TeamItem('TeamName', [new TeamItem(teamName + '')]),
                    new TeamItem('teamId', [new TeamItem(teamId + '')]),
                ]),
            ];
        }
        this._onDidChangeTreeData.fire(null);
    }
    bindView(menuTreeView) {
        this.view = menuTreeView;
    }
    getChildren(task) {
        if (task === undefined) {
            return this.data;
        }
        return task.children;
    }
    getTreeItem(task) {
        return task;
    }
}
exports.TeamDataProvider = TeamDataProvider;
class TeamItem extends vscode_1.TreeItem {
    constructor(label, children) {
        super(label, children === undefined
            ? vscode_1.TreeItemCollapsibleState.None
            : vscode_1.TreeItemCollapsibleState.Collapsed);
        this.children = children;
    }
}
exports.TeamItem = TeamItem;
exports.connectCloud9TeamInfoTreeView = (view) => {
    return vscode_1.Disposable.from(view.onDidChangeSelection((e) => __awaiter(void 0, void 0, void 0, function* () {
        if (!e.selection || e.selection.length === 0) {
            return;
        }
        const item = e.selection[0];
        exports.handleTeamInfoChangeSelection(view, item);
    })));
};
exports.handleTeamInfoChangeSelection = (view, item) => {
    if (item.label === '🛡 Create your Team') {
        console.log('create a team');
        vscode_1.commands.executeCommand('cloud9.createTeam');
    }
    else if (item.label === '🔰 Join team') {
        console.log('join a team');
        vscode_1.commands.executeCommand('cloud9.joinTeam');
    }
    else if (item.label === '📋 View team leaderboard') {
        console.log('View team leaderboard');
        vscode_1.commands.executeCommand('cloud9.teamLeaderboard');
    }
    else if (item.label === 'Get Team Info') {
        console.log('Get Team Info');
        const ctx = Authentication_1.getExtensionContext();
        const teamName = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_NAME);
        const teamId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_ID);
        if (teamId == undefined || teamId == '') {
            item.children = [
                new TeamItem('TeamName', [
                    new TeamItem('Empty (Please join a team first)'),
                ]),
                new TeamItem('teamId', [
                    new TeamItem('Empty (Please join a team first)'),
                ]),
            ];
        }
        else {
            item.children = [
                new TeamItem('TeamName', [new TeamItem(teamName + '')]),
                new TeamItem('teamId', [new TeamItem(teamId + '')]),
            ];
        }
        vscode_1.commands.executeCommand('TeamMenuView.refreshEntry');
    }
};
//# sourceMappingURL=TeamDataProvider.js.map