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

import {getExtensionContext} from './Authentication';

import {getTeamInfo} from "./Team";

import {
  GLOBAL_STATE_USER_TEAM_NAME,
  GLOBAL_STATE_USER_TEAM_ID,
  GLOBAL_STATE_USER_IS_TEAM_LEADER,
  GLOBAL_STATE_USER_ID,
} from './Constants';

/**
 * Menu Provider for treeview
 */
export class TeamDataProvider implements TreeDataProvider<TeamItem> {
  //onDidChangeTreeData?: Event<TeamItem | null | undefined> | undefined;

  private _onDidChangeTreeData: EventEmitter<TeamItem | undefined> = new EventEmitter<TeamItem | undefined>();
  readonly onDidChangeTreeData: Event<TeamItem | undefined> = this._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire(null);
  }

  private view: TreeView<TeamItem>;
  data: TeamItem[];

  // Constructor simply for displaying
  constructor() {

    this.data = [new TeamItem('Join team'), new TeamItem("View team leaderboard"),new TeamItem('Get Team Info', [new TeamItem('')])];
  }


  /**
   * Method to bind view to Menu Provider
   * It will be called from command helper.ts
   *
   * @param menuTreeView
   */
  bindView(menuTreeView: TreeView<TeamItem>): void {
    this.view = menuTreeView;
  }

  getChildren(task?: TeamItem | undefined): ProviderResult<TeamItem[]> {
    if (task === undefined) {
      return this.data;
    }
    return task.children;
  }

  getTreeItem(task: TeamItem): TreeItem | Thenable<TreeItem> {
    return task;
  }
}

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
 * Method to check whether the current treeview item is selected
 *
 * @param view
 */
export const connectCloud9TeamInfoTreeView = (view: TreeView<TeamItem>) => {
  return Disposable.from(
    view.onDidChangeSelection(async (e) => {
      if (!e.selection || e.selection.length === 0) {
        return;
      }

      // Right now it is only hard coded to when the first one is selected
      const item: TeamItem = e.selection[0];

      console.log(e.selection)

      console.log("item");
      console.log(item);

      handleTeamInfoChangeSelection(view, item);
    }),
  );
};

export const handleTeamInfoChangeSelection = (
  view: TreeView<TeamItem>,
  item: TeamItem,
) => {
  // Hard coded now to invoke on joinTeam
  //commands.executeCommand('cloud9.joinTeam');
  if(item.label === "Join team"){
    console.log("join a team");
    commands.executeCommand('cloud9.joinTeam');
  }
  else if(item.label === "View team leaderboard"){
    console.log("View team leaderboard");
    commands.executeCommand('cloud9.teamLeaderboard');
  }
  else if (item.label === "Get Team Info"){
    console.log("Get Team Info");
    const ctx = getExtensionContext();
    const teamName = ctx.globalState.get(GLOBAL_STATE_USER_TEAM_NAME);
    const teamId = ctx.globalState.get(GLOBAL_STATE_USER_TEAM_ID);


    item.children = [new TeamItem('TeamName', [new TeamItem(teamName + '')]), new TeamItem('teamId', [new TeamItem(teamId + '')])];
    commands.executeCommand('TeamMenuView.refreshEntry');
  }



};
