/**
 * File that contains method and class that enable displaying
 * user's team info
 *
 * Contain TeamDataProvider and TeamItem class.
 *
 * @file   This files defines the MyClass class.
 * @author AuthorName.
 */

import {
  window,
  ExtensionContext,
  StatusBarAlignment,
  commands,
  Command,
  TreeDataProvider,
  TreeItemCollapsibleState,
  ProviderResult,
  TreeItem,
  Event,
  EventEmitter,
  TreeView,
  Disposable,
} from 'vscode';

import {
  getExtensionContext,
  checkIfCachedUserIdExistsAndPrompt,
} from './Authentication';

import {getTeamInfo} from './Team';

import {
  GLOBAL_STATE_USER_TEAM_NAME,
  GLOBAL_STATE_USER_TEAM_ID,
  GLOBAL_STATE_USER_IS_TEAM_LEADER,
  GLOBAL_STATE_USER_ID,
  AUTH_NOT_LOGGED_IN,
} from './Constants';

/**
 * Team data provider
 */
export class TeamDataProvider implements TreeDataProvider<TeamItem> {
  private _onDidChangeTreeData: EventEmitter<
    TeamItem | undefined
  > = new EventEmitter<TeamItem | undefined>();
  readonly onDidChangeTreeData: Event<TeamItem | undefined> = this
    ._onDidChangeTreeData.event;

  /**
   * Refreshs team data provider
   */
  refresh(): void {
    const ctx = getExtensionContext();
    const cachedTeamId = ctx.globalState.get(GLOBAL_STATE_USER_TEAM_ID);
    const teamName = ctx.globalState.get(GLOBAL_STATE_USER_TEAM_NAME);
    const teamId = ctx.globalState.get(GLOBAL_STATE_USER_TEAM_ID);

    if (cachedTeamId === undefined || cachedTeamId === '') {
      this.data = [
        new TeamItem('🛡 Create your Team'),
        new TeamItem('🔰 Join team'),
      ];
    } else {
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

  private view: TreeView<TeamItem>;
  data: TeamItem[];

  /**
   * Creates an instance of team data provider.
   */
  constructor() {
    this.data = [
      new TeamItem('🛡 Create your Team'),
      new TeamItem('🔰 Join team'),
    ];
  }

  /**
   * Binds view
   * @param menuTreeView 
   */
  bindView(menuTreeView: TreeView<TeamItem>): void {
    this.view = menuTreeView;
  }

  /**
   * Gets children
   * @param [task] 
   * @returns children 
   */
  getChildren(task?: TeamItem | undefined): ProviderResult<TeamItem[]> {
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
  getTreeItem(task: TeamItem): TreeItem | Thenable<TreeItem> {
    return task;
  }
}

/**
 * Team item
 */
export class TeamItem extends TreeItem {
  children: TeamItem[] | undefined;

  constructor(label: string, children?: TeamItem[]) {
    super(
      label,
      children === undefined
        ? TreeItemCollapsibleState.None
        : TreeItemCollapsibleState.Collapsed,
    );
    this.children = children;
  }
}

/**
 * Connect team info provider treeview with change selectioin.
 * @param view 
 */
export const connectCloud9TeamInfoTreeView = (view: TreeView<TeamItem>) => {
  return Disposable.from(
    view.onDidChangeSelection(async (e) => {
      if (!e.selection || e.selection.length === 0) {
        return;
      }

      const item: TeamItem = e.selection[0];

      handleTeamInfoChangeSelection(view, item);
    }),
  );
};


/**
 * Handles for team info treeview item selections
 * @param view 
 * @param item 
 */
export const handleTeamInfoChangeSelection = (
  view: TreeView<TeamItem>,
  item: TeamItem,
) => {
  if (item.label === '🛡 Create your Team') {
    commands.executeCommand('cloud9.createTeam');
  } else if (item.label === '🔰 Join team') {
    commands.executeCommand('cloud9.joinTeam');
  } else if (item.label === '📋 View team leaderboard') {
    commands.executeCommand('cloud9.teamLeaderboard');
  } else if (item.label === 'Get Team Info') {
    const ctx = getExtensionContext();
    const teamName = ctx.globalState.get(GLOBAL_STATE_USER_TEAM_NAME);
    const teamId = ctx.globalState.get(GLOBAL_STATE_USER_TEAM_ID);

    if (teamId == undefined || teamId == '') {
      item.children = [
        new TeamItem('TeamName', [
          new TeamItem('Empty (Please join a team first)'),
        ]),
        new TeamItem('teamId', [
          new TeamItem('Empty (Please join a team first)'),
        ]),
      ];
    } else {
      item.children = [
        new TeamItem('TeamName', [new TeamItem(teamName + '')]),
        new TeamItem('teamId', [new TeamItem(teamId + '')]),
      ];
    }

    commands.executeCommand('TeamMenuView.refreshEntry');
  }
};
