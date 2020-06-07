import {commands, Disposable, workspace, window, TreeView} from "vscode";
import {
  updatePreferences,
} from "./DataController";
import {
  TeamDataProvider,
  TeamItem,
  connectCloud9TeamInfoTreeView,
} from "../src/util/TeamDataProvider";

import {KpmManager} from "./managers/KpmManager";

import {
  displayLeaderboard,
  displayTeamLeaderboard,
} from "../src/util/Leaderboard";

import {logOut} from "../src/util/Authentication";
import {createAndJoinTeam, getTeamInfo, joinTeam} from "../src/util/Team";
import {displayPersonalStats} from "../src/util/PersonalStats";

import {
  MenuDataProvider,
  MenuItem,
  connectCloud9MenuTreeView,
} from "../src/util/MenuDataProvider";
import {
  LeaderDataProvider,
  LeaderItem,
  connectCloud9LeaderTreeView,
} from "../src/util/LeaderDataProvider";

export function createCommands(
  kpmController: KpmManager,
): {
  dispose: () => void;
} {
  let cmds = [];

  cmds.push(kpmController);

  // MENU TREE: INIT
  const cloud9MenuTreeProvider = new MenuDataProvider();
  const cloud9TeamTreeProvider = new TeamDataProvider();
  const cloud9LeaderTreeProvider = new LeaderDataProvider();

  const cloud9LeaderTreeView: TreeView<LeaderItem> = window.createTreeView(
    "LeaderView",
    {
      treeDataProvider: cloud9LeaderTreeProvider,
      showCollapseAll: false,
    },
  );

  cmds.push(connectCloud9LeaderTreeView(cloud9LeaderTreeView));
  cloud9LeaderTreeProvider.bindView(cloud9LeaderTreeView);

  cmds.push(
    commands.registerCommand("LeaderView.refreshEntry", () =>
      cloud9LeaderTreeProvider.refresh(),
    ),
  );

  const cloud9MenuTreeView: TreeView<MenuItem> = window.createTreeView(
    "MenuView",
    {
      treeDataProvider: cloud9MenuTreeProvider,
      showCollapseAll: false,
    },
  );

  cloud9MenuTreeProvider.bindView(cloud9MenuTreeView);

  cmds.push(connectCloud9MenuTreeView(cloud9MenuTreeView));

  cmds.push(
    commands.registerCommand("MenuView.refreshEntry", () =>
      cloud9MenuTreeProvider.refresh(),
    ),
  );

  const cloud9TeamTreeView: TreeView<TeamItem> = window.createTreeView(
    "TeamMenuView",
    {
      treeDataProvider: cloud9TeamTreeProvider,
      showCollapseAll: false,
    },
  );

  cloud9TeamTreeProvider.bindView(cloud9TeamTreeView);
  cmds.push(connectCloud9TeamInfoTreeView(cloud9TeamTreeView));

  cmds.push(
    commands.registerCommand("TeamMenuView.refreshEntry", () =>
      cloud9TeamTreeProvider.refresh(),
    ),
  );

  /*
   * CLOUD 9 LEADERBOARD COMMAND
   */
  cmds.push(
    commands.registerCommand("cloud9.leaderboard", () => {
      displayLeaderboard();
    }),
  );

  // Cloud9: command used to see personal stats by date
  cmds.push(
    commands.registerCommand("cloud9.personalStats", () => {
      displayPersonalStats();
    }),
  );

  // Cloud9: command used to view private team leaderboard
  cmds.push(
    commands.registerCommand("cloud9.teamLeaderboard", () => {
      displayTeamLeaderboard();
    }),
  );

  // Cloud9: command used to create a new team
  cmds.push(
    commands.registerCommand("cloud9.createTeam", () => {
      createAndJoinTeam();
    }),
  );

  // Cloud9: command used to retrieve team code
  cmds.push(
    commands.registerCommand("cloud9.getTeamInfo", () => {
      getTeamInfo();
    }),
  );

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
  cmds.push(
    commands.registerCommand("cloud9.joinTeam", () => {
      console.log("Cloud9: JOIN A TEAM");
      joinTeam();
    }),
  );

  // Cloud9: command used to clear the cached id (for debugging and testing only)
  // ***can be used to sign the user out***
  cmds.push(
    commands.registerCommand("cloud9.logOut", () => {
      console.log("Cloud9: LOG OUT FROM CLOUD9");
      logOut();
    }),
  );

  cmds.push(workspace.onDidChangeConfiguration((e) => updatePreferences()));

  return Disposable.from(...cmds);
}
