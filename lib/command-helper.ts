import {commands, Disposable, workspace, window, TreeView} from 'vscode';
import {
  handleKpmClickedEvent,
  updatePreferences,
  sendTeamInvite,
} from './DataController';
import {
  TeamDataProvider,
  TeamItem,
  connectCloud9TeamInfoTreeView,
} from '../src/util/TeamDataProvider';
import {
  displayCodeTimeMetricsDashboard,
  showMenuOptions,
} from './menu/MenuManager';
import {
  launchWebUrl,
  handleCodeTimeStatusToggle,
  launchLogin,
  openFileInEditor,
  displayReadmeIfNotExists,
  toggleStatusBar,
} from './Util';
import {KpmManager} from './managers/KpmManager';

import {KpmItem} from './model/models';

import {sendOfflineData} from './managers/FileManager';
import {
  displayLeaderboard,
  displayTeamLeaderboard,
} from '../src/util/Leaderboard';

import {clearCachedUserId} from '../src/util/Authentication';
import {
  createAndJoinTeam,
  getTeamInfo,
  removeTeamNameAndId,
  joinTeam,
  removeTeamMember,
} from '../src/util/Team';
import {displayPersonalStats} from '../src/util/PersonalStats';
import {leaveTeam} from '../src/util/FireStore';
import {
  MenuDataProvider,
  MenuItem,
  connectCloud9MenuTreeView,
} from '../src/util/MenuDataProvider';
import {
  LeaderDataProvider,
  LeaderItem,
  connectCloud9LeaderTreeView,
} from '../src/util/LeaderDataProvider';

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
    'LeaderView',
    {
      treeDataProvider: cloud9LeaderTreeProvider,
      showCollapseAll: false,
    },
  );

  cmds.push(connectCloud9LeaderTreeView(cloud9LeaderTreeView));
  cloud9LeaderTreeProvider.bindView(cloud9LeaderTreeView);

  cmds.push(
    commands.registerCommand('LeaderView.refreshEntry', () =>
      cloud9LeaderTreeProvider.refresh(),
    ),
  );

  const cloud9MenuTreeView: TreeView<MenuItem> = window.createTreeView(
    'MenuView',
    {
      treeDataProvider: cloud9MenuTreeProvider,
      showCollapseAll: false,
    },
  );

  cloud9MenuTreeProvider.bindView(cloud9MenuTreeView);

  cmds.push(connectCloud9MenuTreeView(cloud9MenuTreeView));

  cmds.push(
    commands.registerCommand('MenuView.refreshEntry', () =>
      cloud9MenuTreeProvider.refresh(),
    ),
  );

  const cloud9TeamTreeView: TreeView<TeamItem> = window.createTreeView(
    'TeamMenuView',
    {
      treeDataProvider: cloud9TeamTreeProvider,
      showCollapseAll: false,
    },
  );

  cloud9TeamTreeProvider.bindView(cloud9TeamTreeView);
  cmds.push(connectCloud9TeamInfoTreeView(cloud9TeamTreeView));

  cmds.push(
    commands.registerCommand('TeamMenuView.refreshEntry', () =>
      cloud9TeamTreeProvider.refresh(),
    ),
  );

  // TEAM TREE: INVITE MEMBER
  cmds.push(
    commands.registerCommand(
      'codetime.inviteTeamMember',
      async (item: KpmItem) => {
        // the identifier will be in the value
        const identifier = item.value;
        // email will be the description
        const email = item.description;
        const name = item.label;
        const msg = `Send invitation to ${email}?`;
        const selection = await window.showInformationMessage(
          msg,
          {modal: true},
          ...['YES'],
        );
        if (selection && selection === 'YES') {
          sendTeamInvite(identifier, [email]);
        }
      },
    ),
  );

  // SEND OFFLINE DATA
  cmds.push(
    commands.registerCommand('codetime.sendOfflineData', () => {
      sendOfflineData();
    }),
  );

  // SHOW ASCII DASHBOARD
  cmds.push(
    commands.registerCommand('codetime.softwareKpmDashboard', () => {
      handleKpmClickedEvent();
    }),
  );

  // OPEN SPECIFIED FILE IN EDITOR
  cmds.push(
    commands.registerCommand('codetime.openFileInEditor', (file) => {
      openFileInEditor(file);
    }),
  );

  // REFRESH MENU
  cmds.push(
    commands.registerCommand('codetime.toggleStatusBar', () => {
      toggleStatusBar();
      setTimeout(() => {
        commands.executeCommand('codetime.refreshCodetimeMenuTree');
      }, 500);
    }),
  );

  // LAUNCH EMAIL LOGIN
  cmds.push(
    commands.registerCommand('codetime.codeTimeLogin', () => {
      launchLogin('software');
    }),
  );

  // LAUNCH GOOGLE LOGIN
  cmds.push(
    commands.registerCommand('codetime.googleLogin', () => {
      launchLogin('google');
    }),
  );

  // LAUNCH GITHUB LOGIN
  cmds.push(
    commands.registerCommand('codetime.githubLogin', () => {
      launchLogin('github');
    }),
  );

  // DISPLAY README MD
  cmds.push(
    commands.registerCommand('codetime.displayReadme', () => {
      displayReadmeIfNotExists(true /*override*/);
    }),
  );

  // DISPLAY CODE TIME METRICS REPORT
  cmds.push(
    commands.registerCommand('codetime.codeTimeMetrics', () => {
      displayCodeTimeMetricsDashboard();
    }),
  );

  /*
   * CLOUD 9 LEADERBOARD COMMAND
   */
  cmds.push(
    commands.registerCommand('cloud9.leaderboard', () => {
      displayLeaderboard();
    }),
  );

  // Cloud9: command used to see personal stats by date
  cmds.push(
    commands.registerCommand('cloud9.personalStats', () => {
      displayPersonalStats();
    }),
  );

  // Cloud9: command used to view private team leaderboard
  cmds.push(
    commands.registerCommand('cloud9.teamLeaderboard', () => {
      displayTeamLeaderboard();
    }),
  );

  // Cloud9: command used to create a new team
  cmds.push(
    commands.registerCommand('cloud9.createTeam', () => {
      createAndJoinTeam();
    }),
  );

  // Cloud9: command used to retrieve team code
  cmds.push(
    commands.registerCommand('cloud9.getTeamInfo', () => {
      getTeamInfo();
    }),
  );

  //password recovery
  cmds.push(
    commands.registerCommand('cloud9.resetPassword', () => {
      console.log('Cloud9: PASSWORD RECOVERY--TO BE IMPLEMENTED');
      //doing nothing rn
      window.showInformationMessage('PASSWORD RECOVERY--TO BE IMPLEMENTED');
    }),
  );

  cmds.push(
    commands.registerCommand('cloud9.debugClearTeamNameAndId', () => {
      console.log('cloud9: CLEAR CACHED TEAM NAME AND ID');

    
    }),
  );

  // Cloud9: command used to join a new team
  cmds.push(
    commands.registerCommand('cloud9.joinTeam', () => {
      console.log('Cloud9: JOIN A TEAM');
      joinTeam();
    }),
  );

  // Cloud9: command used to clear the cached id (for debugging and testing only)
  // ***can be used to sign the user out***
  cmds.push(
    commands.registerCommand('cloud9.debugClearUserId', () => {
      console.log('Cloud9: DEBUG CLEAR CACHED ID');
      clearCachedUserId();
    }),
  );

  // LAUNCH COMMIT URL
  cmds.push(
    commands.registerCommand('codetime.launchCommitUrl', (commitLink) => {
      launchWebUrl(commitLink);
    }),
  );

  // DISPLAY PALETTE MENU
  cmds.push(
    commands.registerCommand('codetime.softwarePaletteMenu', () => {
      showMenuOptions();
    }),
  );

  cmds.push(
    commands.registerCommand('codetime.viewSoftwareTop40', () => {
      launchWebUrl('https://api.software.com/music/top40');
    }),
  );

  cmds.push(
    commands.registerCommand('codetime.codeTimeStatusToggle', () => {
      handleCodeTimeStatusToggle();
    }),
  );

  cmds.push(
    commands.registerCommand('codetime.sendFeedback', () => {
      launchWebUrl('mailto:cody@software.com');
    }),
  );

  cmds.push(workspace.onDidChangeConfiguration((e) => updatePreferences()));

  return Disposable.from(...cmds);
}
