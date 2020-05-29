/**
 * File that contains method and class that enable displaying
 * leader's team mangement info
 *
 * Contain LeaderDataProvider and LeaderItem class.
 *
 * @file   This files defines the MyClass class.
 * @author AuthorName.
 */

import {
  commands,
  TreeDataProvider,
  TreeItemCollapsibleState,
  ProviderResult,
  TreeItem,
  Event,
  EventEmitter,
  TreeView,
  Disposable,
  window,
} from 'vscode';
import {getExtensionContext} from './Authentication';
import {
  GLOBAL_STATE_USER_TEAM_MEMBERS,
  GLOBAL_STATE_USER_TEAM_ID,
} from './Constants';
import {leaveTeam} from './Firestore';

export class LeaderDataProvider implements TreeDataProvider<LeaderItem> {
  private _onDidChangeTreeData: EventEmitter<
    LeaderItem | undefined
  > = new EventEmitter<LeaderItem | undefined>();
  readonly onDidChangeTreeData: Event<LeaderItem | undefined> = this
    ._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire(null);
  }

  private view: TreeView<LeaderItem>;
  data: LeaderItem[];

  constructor() {
    let childLeaderItem = new LeaderItem('');
    let topLeaderItem = new LeaderItem('Remove Team members', undefined, [
      childLeaderItem,
    ]);
    childLeaderItem.parent = topLeaderItem;
    this.data = [topLeaderItem];
  }

  bindView(menuTreeView: TreeView<LeaderItem>): void {
    this.view = menuTreeView;
  }

  getChildren(task?: LeaderItem | undefined): ProviderResult<LeaderItem[]> {
    if (task === undefined) {
      return this.data;
    }
    return task.children;
  }

  getTreeItem(task: LeaderItem): TreeItem | Thenable<TreeItem> {
    return task;
  }
}

export class LeaderItem extends TreeItem {
  children: LeaderItem[] | undefined;
  parent: LeaderItem | undefined;

  constructor(label: string, parent?: LeaderItem, children?: LeaderItem[]) {
    super(
      label,
      children === undefined
        ? TreeItemCollapsibleState.None
        : TreeItemCollapsibleState.Collapsed,
    );
    this.children = children;
    this.parent = parent;
  }
}

export const connectCloud9LeaderTreeView = (view: TreeView<LeaderItem>) => {
  return Disposable.from(
    view.onDidChangeSelection(async (e) => {
      if (!e.selection || e.selection.length === 0) {
        return;
      }

      const item: LeaderItem = e.selection[0];

      handleLeaderInfoChangeSelection(view, item);
    }),
  );
};

export const handleLeaderInfoChangeSelection = (
  view: TreeView<LeaderItem>,
  item: LeaderItem,
) => {
  const ctx = getExtensionContext();
  const memberMaps: Map<string, Map<string, string>> = ctx.globalState.get(
    GLOBAL_STATE_USER_TEAM_MEMBERS,
  );

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
    commands.executeCommand('LeaderView.refreshEntry');
  } else if (item.label.startsWith('Member: ')) {
    let selectedMemberEmail = item.label.substring(8);

    window
      .showInformationMessage(
        `Are you sure you want to remove ${selectedMemberEmail}?`,
        'yes',
        'no',
      )
      .then((input) => {
        if (input === 'yes') {
          const member = memberMaps[selectedMemberEmail];
          const memberId = member['id'];
          const teamId = ctx.globalState.get(GLOBAL_STATE_USER_TEAM_ID);

          leaveTeam(memberId, teamId).then(() => {
            const newMemberMaps = ctx.globalState.get(
              GLOBAL_STATE_USER_TEAM_MEMBERS,
            );
            item.parent.children = [];
            for (let [key, value] of Object.entries(newMemberMaps)) {
              item.parent.children.push(new LeaderItem('Member: ' + key, item));
            }

            commands.executeCommand('LeaderView.refreshEntry');
            window.showInformationMessage('Successfully remove');
          });
        } else {
          window.showInformationMessage('Removal canceled');
        }
      });
  }
};
