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
exports.handleMenuChangeSelection = exports.connectCloud9MenuTreeView = exports.TeamItem = exports.TeamDataProvider = void 0;
const vscode_1 = require("vscode");
/**
 * Menu Provider for treeview
 */
class TeamDataProvider {
    // Constructor simply for displaying
    constructor() {
        this.data = [new TeamItem('🛡Join team'), new TeamItem("View team leaderboard"), new TeamItem('Get Team Info'), new TeamItem('test', [new TeamItem('s')])];
    }
    /**
     * Method to bind view to Menu Provider
     * It will be called from command helper.ts
     *
     * @param menuTreeView
     */
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
            : vscode_1.TreeItemCollapsibleState.Expanded);
        this.children = children;
    }
}
exports.TeamItem = TeamItem;
/**
 * Method to check whether the current treeview item is selected
 *
 * @param view
 */
exports.connectCloud9MenuTreeView = (view) => {
    return vscode_1.Disposable.from(view.onDidChangeSelection((e) => __awaiter(void 0, void 0, void 0, function* () {
        if (!e.selection || e.selection.length === 0) {
            return;
        }
        // Right now it is only hard coded to when the first one is selected
        const item = e.selection[0];
        console.log(e.selection);
        console.log("item");
        console.log(item);
        exports.handleMenuChangeSelection(view, item);
    })));
};
exports.handleMenuChangeSelection = (view, item) => {
    // Hard coded now to invoke on joinTeam
    //commands.executeCommand('cloud9.joinTeam');
    if (item.label === "🛡Join team") {
        console.log("join a team");
        vscode_1.commands.executeCommand('cloud9.joinTeam');
    }
    else if (item.label === "View team leaderboard") {
        console.log("View team leaderboard");
        vscode_1.commands.executeCommand('cloud9.teamLeaderboard');
    }
    else if (item.label === "Get Team Info") {
        console.log("view team id");
        item.label = "hello";
    }
};
//# sourceMappingURL=MenuProvier.js.map