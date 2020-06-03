"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommands = void 0;
const vscode_1 = require("vscode");
const DataController_1 = require("./DataController");
const TeamDataProvider_1 = require("../src/util/TeamDataProvider");
const Leaderboard_1 = require("../src/util/Leaderboard");
const Authentication_1 = require("../src/util/Authentication");
const Team_1 = require("../src/util/Team");
const PersonalStats_1 = require("../src/util/PersonalStats");
const MenuDataProvider_1 = require("../src/util/MenuDataProvider");
const LeaderDataProvider_1 = require("../src/util/LeaderDataProvider");
function createCommands(kpmController) {
    let cmds = [];
    cmds.push(kpmController);
    // MENU TREE: INIT
    const cloud9MenuTreeProvider = new MenuDataProvider_1.MenuDataProvider();
    const cloud9TeamTreeProvider = new TeamDataProvider_1.TeamDataProvider();
    const cloud9LeaderTreeProvider = new LeaderDataProvider_1.LeaderDataProvider();
    const cloud9LeaderTreeView = vscode_1.window.createTreeView('LeaderView', {
        treeDataProvider: cloud9LeaderTreeProvider,
        showCollapseAll: false,
    });
    cmds.push(LeaderDataProvider_1.connectCloud9LeaderTreeView(cloud9LeaderTreeView));
    cloud9LeaderTreeProvider.bindView(cloud9LeaderTreeView);
    cmds.push(vscode_1.commands.registerCommand('LeaderView.refreshEntry', () => cloud9LeaderTreeProvider.refresh()));
    const cloud9MenuTreeView = vscode_1.window.createTreeView('MenuView', {
        treeDataProvider: cloud9MenuTreeProvider,
        showCollapseAll: false,
    });
    cloud9MenuTreeProvider.bindView(cloud9MenuTreeView);
    cmds.push(MenuDataProvider_1.connectCloud9MenuTreeView(cloud9MenuTreeView));
    cmds.push(vscode_1.commands.registerCommand('MenuView.refreshEntry', () => cloud9MenuTreeProvider.refresh()));
    const cloud9TeamTreeView = vscode_1.window.createTreeView('TeamMenuView', {
        treeDataProvider: cloud9TeamTreeProvider,
        showCollapseAll: false,
    });
    cloud9TeamTreeProvider.bindView(cloud9TeamTreeView);
    cmds.push(TeamDataProvider_1.connectCloud9TeamInfoTreeView(cloud9TeamTreeView));
    cmds.push(vscode_1.commands.registerCommand('TeamMenuView.refreshEntry', () => cloud9TeamTreeProvider.refresh()));
    /*
     * CLOUD 9 LEADERBOARD COMMAND
     */
    cmds.push(vscode_1.commands.registerCommand('cloud9.leaderboard', () => {
        Leaderboard_1.displayLeaderboard();
    }));
    // Cloud9: command used to see personal stats by date
    cmds.push(vscode_1.commands.registerCommand('cloud9.personalStats', () => {
        PersonalStats_1.displayPersonalStats();
    }));
    // Cloud9: command used to view private team leaderboard
    cmds.push(vscode_1.commands.registerCommand('cloud9.teamLeaderboard', () => {
        Leaderboard_1.displayTeamLeaderboard();
    }));
    // Cloud9: command used to create a new team
    cmds.push(vscode_1.commands.registerCommand('cloud9.createTeam', () => {
        Team_1.createAndJoinTeam();
    }));
    // Cloud9: command used to retrieve team code
    cmds.push(vscode_1.commands.registerCommand('cloud9.getTeamInfo', () => {
        Team_1.getTeamInfo();
    }));
    //password recovery
    // cmds.push(
    //   commands.registerCommand('cloud9.resetPassword', () => {
    //     console.log('Cloud9: PASSWORD RECOVERY--TO BE IMPLEMENTED');
    //     //doing nothing rn
    //     window.showInformationMessage('PASSWORD RECOVERY--TO BE IMPLEMENTED');
    //   }),
    // );
    // cmds.push(
    //   commands.registerCommand('cloud9.debugClearTeamNameAndId', () => {
    //     console.log('cloud9: CLEAR CACHED TEAM NAME AND ID');
    //   }),
    // );
    // Cloud9: command used to join a new team
    cmds.push(vscode_1.commands.registerCommand('cloud9.joinTeam', () => {
        console.log('Cloud9: JOIN A TEAM');
        Team_1.joinTeam();
    }));
    // Cloud9: command used to clear the cached id (for debugging and testing only)
    // ***can be used to sign the user out***
    cmds.push(vscode_1.commands.registerCommand('cloud9.logOut', () => {
        console.log('Cloud9: LOG OUT FROM CLOUD9');
        Authentication_1.logOut();
    }));
    cmds.push(vscode_1.workspace.onDidChangeConfiguration((e) => DataController_1.updatePreferences()));
    return vscode_1.Disposable.from(...cmds);
}
exports.createCommands = createCommands;
//# sourceMappingURL=command-helper.js.map