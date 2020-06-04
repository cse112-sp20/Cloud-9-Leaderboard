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
  commands,
  TreeDataProvider,
  TreeItemCollapsibleState,
  ProviderResult,
  TreeItem,
  Event,
  EventEmitter,
  TreeView,
  Disposable,
} from "vscode";

import {GLOBAL_STATE_USER_ID, GLOBAL_STATE_USER_NICKNAME} from "./Constants";

import {signInOrSignUpUserWithUserInput} from "./Authentication";

import {getExtensionContext} from "./Authentication";

/**
 * Menu data provider
 */
export class MenuDataProvider implements TreeDataProvider<MenuItem> {
  private _onDidChangeTreeData: EventEmitter<
    MenuItem | undefined
  > = new EventEmitter<MenuItem | undefined>();
  readonly onDidChangeTreeData: Event<MenuItem | undefined> = this
    ._onDidChangeTreeData.event;

  /**
   * Refreshs menu data provider
   */
  refresh(): void {
    const ctx = getExtensionContext();

    if (ctx.globalState.get(GLOBAL_STATE_USER_ID) !== undefined) {
      this.data = [
        new MenuItem(
          `Welcome, ${ctx.globalState.get(GLOBAL_STATE_USER_NICKNAME)}!`,
        ),
        new MenuItem("📊 View personal stats"),
        new MenuItem("🌐 Leaderboard"),
        new MenuItem("💻 Log out account"),
      ];
    } else {
      this.data = [
        new MenuItem("Sign in / Create Account"),
        new MenuItem("📊 View personal stats"),
        new MenuItem("🌐 Leaderboard"),
      ];
    }

    this._onDidChangeTreeData.fire(null);
  }

  private view: TreeView<MenuItem>;
  data: MenuItem[];

  /**
   * Creates an instance of menu data provider.
   */
  constructor() {
    this.data = [
      new MenuItem("Sign in / Create Account"),
      new MenuItem("📊 View personal stats"),
      new MenuItem("🌐 Leaderboard"),
    ];
  }

  /**
   * Binds view
   * @param menuTreeView
   */
  bindView(menuTreeView: TreeView<MenuItem>): void {
    this.view = menuTreeView;
  }

  /**
   * Gets children
   * @param [task]
   * @returns children
   */
  getChildren(task?: MenuItem | undefined): ProviderResult<MenuItem[]> {
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
  getTreeItem(task: MenuItem): TreeItem | Thenable<TreeItem> {
    return task;
  }
}

/**
 * Menu item
 */
export class MenuItem extends TreeItem {
  children: MenuItem[] | undefined;

  /**
   * Creates an instance of menu item.
   * @param label
   * @param [children]
   */
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

/**
 * Connect menu data provider treeview with change selectioin.
 * @param view
 */
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

/**
 * Handles for menu treeview item selections
 * @param view
 * @param item
 */
export const handleMenuChangeSelection = (
  view: TreeView<MenuItem>,
  item: MenuItem,
) => {
  if (item.label === "Sign in / Create Account") {
    signInOrSignUpUserWithUserInput();
  } else if (item.label === "📊 View personal stats") {
    commands.executeCommand("cloud9.personalStats");
  } else if (item.label === "🌐 Leaderboard") {
    commands.executeCommand("cloud9.leaderboard");
  } else if (item.label === "💻 Log out account") {
    commands.executeCommand("cloud9.logOut");
  }
};
