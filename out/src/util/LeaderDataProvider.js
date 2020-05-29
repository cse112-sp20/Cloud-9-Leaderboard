"use strict";
/**
 * File that contains method and class that enable displaying
 * leader's team mangement info
 *
 * Contain LeaderDataProvider and LeaderItem class.
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
exports.handleLeaderInfoChangeSelection = exports.connectCloud9LeaderTreeView = exports.LeaderItem = exports.LeaderDataProvider = void 0;
const vscode_1 = require("vscode");
const Authentication_1 = require("./Authentication");
const Constants_1 = require("./Constants");
const Firestore_1 = require("./Firestore");
class LeaderDataProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode_1.EventEmitter();
        this.onDidChangeTreeData = this
            ._onDidChangeTreeData.event;
        let childLeaderItem = new LeaderItem('');
        let topLeaderItem = new LeaderItem('Remove Team members', undefined, [
            childLeaderItem,
        ]);
        childLeaderItem.parent = topLeaderItem;
        this.data = [topLeaderItem];
    }
    refresh() {
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
exports.LeaderDataProvider = LeaderDataProvider;
class LeaderItem extends vscode_1.TreeItem {
    constructor(label, parent, children) {
        super(label, children === undefined
            ? vscode_1.TreeItemCollapsibleState.None
            : vscode_1.TreeItemCollapsibleState.Collapsed);
        this.children = children;
        this.parent = parent;
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
    if (item.label === 'Remove Team members') {
        console.log('Team members selected');
        item.children = [];
        for (let [key, value] of Object.entries(memberMaps)) {
            item.children.push(new LeaderItem('Member: ' + key, item));
        }
        console.log(item.children);
        // item.children = [
        //   new LeaderItem('etyuan@ucsd.edu', item),
        //   new LeaderItem('Member: aihsieh@ucsd.edu', item),
        // ];
        vscode_1.commands.executeCommand('LeaderView.refreshEntry');
    }
    else if (item.label.startsWith('Member: ')) {
        let selectedMemberEmail = item.label.substring(8);
        vscode_1.window
            .showInformationMessage(`Are you sure you want to remove ${selectedMemberEmail}?`, 'yes', 'no')
            .then((input) => {
            if (input === 'yes') {
                const member = memberMaps[selectedMemberEmail];
                const memberId = member['id'];
                const teamId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_ID);
                Firestore_1.leaveTeam(memberId, teamId)
                    .then(() => {
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