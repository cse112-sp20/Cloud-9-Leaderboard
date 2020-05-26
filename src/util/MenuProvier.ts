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


/**
 * Menu Provider for treeview
 */
export class MenuProvider implements TreeDataProvider<MenuTask> {
    onDidChangeTreeData?: Event<MenuTask | null | undefined> | undefined;
  
    private view: TreeView<MenuTask>;
    data: MenuTask[];

    // Constructor simply for displaying
    constructor() {
      this.data = [new MenuTask('Join team')];
    }
  
    /**
     * Method to bind view to Menu Provider
     * It will be called from command helper.ts
     * 
     * @param menuTreeView 
     */
    bindView(menuTreeView: TreeView<MenuTask>): void {
      this.view = menuTreeView;
  }
  
  
    getChildren(task?: MenuTask | undefined): ProviderResult<MenuTask[]> {
      if (task === undefined) {
        return this.data;
      }
      return task.children;
    }
  
    getTreeItem(task: MenuTask): TreeItem | Thenable<TreeItem> {
      return task;
    }
  }
  
  export class MenuTask extends TreeItem {
    children: MenuTask[] | undefined;
  
    constructor(label: string, children?: MenuTask[]) {
      super(
        label,
        children === undefined
          ? TreeItemCollapsibleState.None
          : TreeItemCollapsibleState.Expanded,
      );
      this.children = children;
    }
  }
  
  /**
   * Method to check whether the current treeview item is selected
   * 
   * @param view 
   */
  export const connectCloud9MenuTreeView = (view: TreeView<MenuTask>) => {
    return Disposable.from(
  
        view.onDidChangeSelection(async e => {
            if (!e.selection || e.selection.length === 0) {
                return;
            }
  
            // Right now it is only hard coded to when the first one is selected
            const item: MenuTask = e.selection[0];
  
            handleMenuChangeSelection(view, item);
        })
  
    );
  };
  
  export const handleMenuChangeSelection = (
    view: TreeView<MenuTask>,
    item: MenuTask
  ) => {
  
    // Hard coded now to invoke on joinTeam
    commands.executeCommand('cloud9.joinTeam');
    
  };