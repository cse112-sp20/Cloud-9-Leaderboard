/**
 * File that contains method and class that enable displaying
 * user's personal info
 *
 * Contain MenuDataProvider and MenuItem class.
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
  FileType,
} from 'vscode';

import {GLOBAL_STATE_USER_ID, GLOBAL_STATE_USER_NICKNAME} from './Constants';

import {signInOrSignUpUserWithUserInput} from './Authentication';

import {getExtensionContext} from './Authentication';

const path = require('path');

const resourcePath: string = path.join(
  __filename,
  '..',
  '..',
  '..',
  'resources',
);

export class MenuDataProvider implements TreeDataProvider<MenuItem> {
  private _onDidChangeTreeData: EventEmitter<
    MenuItem | undefined
  > = new EventEmitter<MenuItem | undefined>();
  readonly onDidChangeTreeData: Event<MenuItem | undefined> = this
    ._onDidChangeTreeData.event;

  refresh(): void {
    console.log('Refresh called**************************');
    const ctx = getExtensionContext();

    if (ctx.globalState.get(GLOBAL_STATE_USER_ID) !== undefined) {
      this.data = [
        new MenuItem(
          `Welcome, ${ctx.globalState.get(GLOBAL_STATE_USER_NICKNAME)}!`,
        ),
        new MenuItem('📊 View personal stats'),
        new MenuItem('🌐 Leaderboard'),
      ];
    } else {
      console.log('User not logged in');
    }

    this._onDidChangeTreeData.fire(null);
  }

  private view: TreeView<MenuItem>;
  data: MenuItem[];

  constructor() {
    this.data = [
      new MenuItem('Sign in / Create Account'),
      new MenuItem('📊 View personal stats'),
      new MenuItem('🌐 Leaderboard'),
    ];
  }

  bindView(menuTreeView: TreeView<MenuItem>): void {
    this.view = menuTreeView;
  }

  getChildren(task?: MenuItem | undefined): ProviderResult<MenuItem[]> {
    if (task === undefined) {
      return this.data;
    }
    return task.children;
  }

  getTreeItem(task: MenuItem): TreeItem | Thenable<TreeItem> {
    return task;
  }
}

export class MenuItem extends TreeItem {
  children: MenuItem[] | undefined;

  constructor(label: string, children?: MenuItem[]) {
    super(
      label,
      children === undefined
        ? TreeItemCollapsibleState.None
        : TreeItemCollapsibleState.Collapsed,
    );
    this.children = children;
  }
}

export const connectCloud9MenuTreeView = (view: TreeView<MenuItem>) => {
  return Disposable.from(
    view.onDidChangeSelection(async (e) => {
      if (!e.selection || e.selection.length === 0) {
        return;
      }

      const item: MenuItem = e.selection[0];

      handleMenuChangeSelection(view, item);
    }),
  );
};

export const handleMenuChangeSelection = (
  view: TreeView<MenuItem>,
  item: MenuItem,
) => {
  if (item.label === 'Sign in / Create Account') {
    signInOrSignUpUserWithUserInput();
  } else if (item.label === '📊 View personal stats') {
    commands.executeCommand('cloud9.personalStats');
  } else if (item.label === '🌐 Leaderboard') {
    commands.executeCommand('cloud9.leaderboard');
  }
};
