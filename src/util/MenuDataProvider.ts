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
} from 'vscode';

import {getExtensionContext} from './Authentication';

export class MenuDataProvider implements TreeDataProvider<MenuItem> {
  private _onDidChangeTreeData: EventEmitter<
    MenuItem | undefined
  > = new EventEmitter<MenuItem | undefined>();
  readonly onDidChangeTreeData: Event<MenuItem | undefined> = this
    ._onDidChangeTreeData.event;

  refresh(): void {
    this._onDidChangeTreeData.fire(null);
  }

  private view: TreeView<MenuItem>;
  data: MenuItem[];

  constructor() {
    this.data = [new MenuItem('View Stats')];
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
  if (item.label === 'View personal stats') {
    commands.executeCommand('cloud9.personalStats');
  }
};
