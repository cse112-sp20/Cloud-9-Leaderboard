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

export class DailyMetricDataProvider implements TreeDataProvider<TreeTask> {
  onDidChangeTreeData?: Event<TreeTask | null | undefined> | undefined;

  data: TreeTask[];
  constructor(d) {
    console.log(d);

    this.data = [];

    let tempList = [];
    for (let key in d) {
      tempList.push(new TreeTask(key, [ new TreeTask('Today: ' + d[key] + ' (Latest Update)')]));
    }

    this.data = tempList;
  }

  getChildren(task?: TreeTask | undefined): ProviderResult<TreeTask[]> {
    if (task === undefined) {
      return this.data;
    }
    return task.children;
  }

  getTreeItem(task: TreeTask): TreeItem | Thenable<TreeItem> {
    return task;
  }
}
class TreeTask extends TreeItem {
  children: TreeTask[] | undefined;

  constructor(label: string, children?: TreeTask[]) {
    super(
      label,
      children === undefined
        ? TreeItemCollapsibleState.None
        : TreeItemCollapsibleState.Expanded,
    );
    this.children = children;
  }
}

export function testCallback(data, ctx) {
  window.registerTreeDataProvider('DailyMetric', new DailyMetricDataProvider(data));
}
