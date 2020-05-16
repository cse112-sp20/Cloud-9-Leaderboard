import {commands, Disposable, workspace, window, TreeView} from 'vscode';
import {
  handleKpmClickedEvent,
  updatePreferences,
  sendTeamInvite,
} from './DataController';
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
import {KpmProvider, connectKpmTreeView} from './tree/KpmProvider';
import {
  CodeTimeMenuProvider,
  connectCodeTimeMenuTreeView,
} from './tree/CodeTimeMenuProvider';
import {KpmItem} from './model/models';
import {KpmProviderManager} from './tree/KpmProviderManager';
import {ProjectCommitManager} from './menu/ProjectCommitManager';
import {
  CodeTimeTeamProvider,
  connectCodeTimeTeamTreeView,
} from './tree/CodeTimeTeamProvider';
import {displayProjectContributorCommitsDashboard} from './menu/ReportManager';
import {sendOfflineData} from './managers/FileManager';
import {displayLeaderboard} from '../src/util/Leaderboard';

import {clearCachedUserId} from '../src/util/Authentication';

export function createCommands(
  kpmController: KpmManager,
): {
  dispose: () => void;
} {
  let cmds = [];

  cmds.push(kpmController);

  // MENU TREE: INIT
  const codetimeMenuTreeProvider = new CodeTimeMenuProvider();
  const codetimeMenuTreeView: TreeView<KpmItem> = window.createTreeView(
    'ct-menu-tree',
    {
      treeDataProvider: codetimeMenuTreeProvider,
      showCollapseAll: false,
    },
  );
  codetimeMenuTreeProvider.bindView(codetimeMenuTreeView);
  cmds.push(connectCodeTimeMenuTreeView(codetimeMenuTreeView));

  // MENU TREE: REVEAL
  cmds.push(
    commands.registerCommand('codetime.displayTree', () => {
      codetimeMenuTreeProvider.revealTree();
    }),
  );

  // MENU TREE: REFRESH
  cmds.push(
    commands.registerCommand('codetime.refreshCodetimeMenuTree', () => {
      codetimeMenuTreeProvider.refresh();
    }),
  );

  // DAILY METRICS TREE: INIT
  const kpmTreeProvider = new KpmProvider();
  const kpmTreeView: TreeView<KpmItem> = window.createTreeView(
    'ct-metrics-tree',
    {
      treeDataProvider: kpmTreeProvider,
      showCollapseAll: false,
    },
  );
  kpmTreeProvider.bindView(kpmTreeView);
  cmds.push(connectKpmTreeView(kpmTreeView));

  // TEAM TREE: INIT
  const codetimeTeamTreeProvider = new CodeTimeTeamProvider();
  const codetimeTeamTreeView: TreeView<KpmItem> = window.createTreeView(
    'ct-team-tree',
    {
      treeDataProvider: codetimeTeamTreeProvider,
      showCollapseAll: false,
    },
  );
  codetimeTeamTreeProvider.bindView(codetimeTeamTreeView);
  cmds.push(connectCodeTimeTeamTreeView(codetimeTeamTreeView));

  // TEAM TREE: REFRESH
  cmds.push(
    commands.registerCommand('codetime.refreshCodetimeTeamTree', () => {
      codetimeTeamTreeProvider.refresh();
    }),
  );

  cmds.push(
    commands.registerCommand('codetime.refreshTreeViews', () => {
      codetimeMenuTreeProvider.refresh();
      kpmTreeProvider.refresh();
      codetimeTeamTreeProvider.refresh();
    }),
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

  // REFRESH DAILY METRICS
  cmds.push(
    commands.registerCommand('codetime.refreshKpmTree', (keystrokeStats) => {
      if (keystrokeStats) {
        KpmProviderManager.getInstance().setCurrentKeystrokeStats(
          keystrokeStats,
        );
      }
      kpmTreeProvider.refresh();
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
    commands.registerCommand('cloud9.cloud9Leaderboard', () => {
      displayLeaderboard();
    }),
  );

  // Cloud9: command used to create a new team
  cmds.push(
    commands.registerCommand('cloud9.createTeam', () => {
      console.log('Cloud9: CREATE A NEW TEAM');
    }),
  );

  // Cloud9: command used to join a new team
  cmds.push(
    commands.registerCommand('cloud9.joinTeam', () => {
      console.log('Cloud9: JOIN A TEAM');
    }),
  );

  // Cloud9: command used to clear the cached id (for debugging and testing only)
  cmds.push(
    commands.registerCommand('cloud9.debugClearUserId', () => {
      console.log('Cloud9: CLEAR CACHED ID');
      clearCachedUserId();
    }),
  );

  // DISPLAY PROJECT METRICS REPORT
  cmds.push(
    commands.registerCommand('codetime.generateProjectSummary', () => {
      ProjectCommitManager.getInstance().launchProjectCommitMenuFlow();
    }),
  );

  // DISPLAY REPO COMMIT CONTRIBUTOR REPORT
  cmds.push(
    commands.registerCommand(
      'codetime.generateContributorSummary',
      (identifier) => {
        displayProjectContributorCommitsDashboard(identifier);
      },
    ),
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
