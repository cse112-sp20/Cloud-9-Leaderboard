"use strict";
/**
 * File that contains method and class that enable displaying
 * leader's team mangement info in treeview.
 *
 * Contain LeaderDataProvider and LeaderItem class.
 *
 * @file   This files defines the LeaderDataProvider and LeaderItem class.
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
exports.handleLeaderInfoChangeSelection = exports.connectCloud9LeaderTreeView = exports.LeaderItem = exports.LeaderDataProvider = void 0;
const vscode_1 = require("vscode");
const Authentication_1 = require("./Authentication");
const Constants_1 = require("./Constants");
const Firestore_1 = require("./Firestore");
/**
 * Class that defines leaderdataprovider wh
 */
class LeaderDataProvider {
    /**
     * Creates an instance of leader data provider.
     */
    constructor() {
        this._onDidChangeTreeData = new vscode_1.EventEmitter();
        this.onDidChangeTreeData = this
            ._onDidChangeTreeData.event;
        const ctx = Authentication_1.getExtensionContext();
        if (ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_IS_TEAM_LEADER)) {
            let childLeaderItem = new LeaderItem('');
            let topLeaderItem = new LeaderItem('Remove Team members', undefined, [
                childLeaderItem,
            ]);
            childLeaderItem.parent = topLeaderItem;
            this.data = [
                new LeaderItem('Team members', undefined, [new LeaderItem('')]),
                topLeaderItem,
            ];
        }
        else {
            const teamId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_ID);
            if (teamId == undefined || teamId == '') {
                this.data = [
                    new LeaderItem('No permission: Not in a team yet', undefined, undefined, this),
                ];
            }
            else {
                this.data = [
                    new LeaderItem('No permission: Not team leader', undefined, undefined, this),
                ];
            }
        }
    }
    /**
     * Refreshs leader data provider
     */
    refresh() {
        console.log('Leader refresh called');
        const ctx = Authentication_1.getExtensionContext();
        const isTeamLeader = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_IS_TEAM_LEADER);
        console.log('is lear: ' + isTeamLeader);
        if (!isTeamLeader) {
            const teamId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_ID);
            if (teamId == undefined || teamId == '') {
                this.data = [
                    new LeaderItem('No permission: Not in a team yet', undefined, undefined, this),
                ];
            }
            else {
                this.data = [
                    new LeaderItem('No permission: Not team leader', undefined, undefined, this),
                ];
            }
        }
        else {
            const ctx = Authentication_1.getExtensionContext();
            const memberMaps = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_MEMBERS);
            let memberFetchLists = [];
            for (let [key, value] of Object.entries(memberMaps)) {
                memberFetchLists.push(new LeaderItem('Email: ' + key));
            }
            if (memberFetchLists.length === 0) {
                memberFetchLists.push(new LeaderItem('Empty: No team member yet'));
            }
            let removeMemberFetchLists = [];
            let childLeaderItem = new LeaderItem('');
            for (let [key, value] of Object.entries(memberMaps)) {
                childLeaderItem = new LeaderItem('Remove member: ' + key);
                removeMemberFetchLists.push(childLeaderItem);
            }
            if (removeMemberFetchLists.length === 0) {
                removeMemberFetchLists.push(new LeaderItem('Empty: No team member yet'));
            }
            let topLeaderItem = new LeaderItem('Remove Team members', undefined, removeMemberFetchLists);
            for (var val of removeMemberFetchLists) {
                val.parent = topLeaderItem;
            }
            this.data = [
                new LeaderItem('Team members', undefined, memberFetchLists),
                topLeaderItem,
            ];
        }
        this._onDidChangeTreeData.fire(null);
    }
    /**
     * Params leader data provider
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
exports.LeaderDataProvider = LeaderDataProvider;
/**
 * Leader item
 */
class LeaderItem extends vscode_1.TreeItem {
    /**
     * Creates an instance of leader item.
     * @param label
     * @param [parent]
     * @param [children]
     * @param [upperClass]
     */
    constructor(label, parent, children, upperClass) {
        super(label, children === undefined
            ? vscode_1.TreeItemCollapsibleState.None
            : vscode_1.TreeItemCollapsibleState.Collapsed);
        this.children = children;
        this.parent = parent;
        this.upperClass = upperClass;
    }
}
exports.LeaderItem = LeaderItem;
exports.connectCloud9LeaderTreeView = (view) => {
    return vscode_1.Disposable.from(view.onDidChangeSelection((e) => __awaiter(void 0, void 0, void 0, function* () {
        if (!e.selection || e.selection.length === 0) {
            return;
        }
        const item = e.selection[0];
        exports.handleLeaderInfoChangeSelection(view, item);
    })));
};
exports.handleLeaderInfoChangeSelection = (view, item) => {
    const ctx = Authentication_1.getExtensionContext();
    const memberMaps = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_MEMBERS);
    if (item.label.startsWith('No permission:')) {
        if (ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_IS_TEAM_LEADER)) {
            let childItem = new LeaderItem('');
            let topItem = new LeaderItem('Remove Team members', undefined, [
                childItem,
            ]);
            childItem.parent = topItem;
            item.upperClass.data = [
                new LeaderItem('Team members', undefined, [new LeaderItem('')]),
                topItem,
            ];
            vscode_1.commands.executeCommand('LeaderView.refreshEntry');
        }
        else {
            console.log('Is not a leader');
        }
    }
    else if (item.label === 'Team members') {
        item.children = [];
        for (let [key, value] of Object.entries(memberMaps)) {
            item.children.push(new LeaderItem('User: ' + memberMaps[key]['name'], item, [
                new LeaderItem(''),
            ]));
        }
        if (item.children.length === 0) {
            item.children.push(new LeaderItem('Empty: No team member yet', item));
        }
        vscode_1.commands.executeCommand('LeaderView.refreshEntry');
    }
    else if (item.label.startsWith('User: ')) {
        item.children = [];
        for (let [key, value] of Object.entries(memberMaps)) {
            item.children.push(new LeaderItem('Email: ' + key));
        }
        vscode_1.commands.executeCommand('LeaderView.refreshEntry');
    }
    else if (item.label === 'Remove Team members') {
        item.children = [];
        for (let [key, value] of Object.entries(memberMaps)) {
            item.children.push(new LeaderItem('Remove member: ' + key, item));
        }
        if (item.children.length === 0) {
            item.children.push(new LeaderItem('Empty: No team member yet', item));
        }
        // item.children = [
        //   new LeaderItem('etyuan@ucsd.edu', item),
        //   new LeaderItem('Member: aihsieh@ucsd.edu', item),
        // ];
        vscode_1.commands.executeCommand('LeaderView.refreshEntry');
    }
    else if (item.label.startsWith('Remove member: ')) {
        let selectedMemberEmail = item.label.substring(15);
        vscode_1.window
            .showInformationMessage(`Are you sure you want to remove ${selectedMemberEmail}?`, 'yes', 'no')
            .then((input) => {
            if (input === 'yes') {
                const member = memberMaps[selectedMemberEmail];
                const memberId = member['id'];
                const teamId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_ID);
                Firestore_1.leaveTeam(memberId, teamId).then(() => {
                    const newMemberMaps = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_MEMBERS);
                    item.parent.children = [];
                    for (let [key, value] of Object.entries(newMemberMaps)) {
                        item.parent.children.push(new LeaderItem('Member: ' + key, item));
                    }
                    vscode_1.commands.executeCommand('LeaderView.refreshEntry');
                    vscode_1.window.showInformationMessage('Successfully remove');
                });
            }
            else {
                vscode_1.window.showInformationMessage('Removal canceled');
            }
        });
    }
};
//# sourceMappingURL=LeaderDataProvider.js.map