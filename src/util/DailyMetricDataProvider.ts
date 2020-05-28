/**
 * File that contains method and class that enable displaying
 * user's daily metrics
 *
 * Contain DailyMetricData Provider and DailyMetricItem class.
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

export class DailyMetricDataProvider
  implements TreeDataProvider<DailyMetricItem> {
  onDidChangeTreeData?: Event<DailyMetricItem | null | undefined> | undefined;

  data: DailyMetricItem[];
  constructor(d) {
    console.log(d);

    this.data = [];

    let tempList = [];
    for (let key in d) {
      tempList.push(
        new DailyMetricItem(key, [
          new DailyMetricItem('Today: ' + d[key] + ' (Latest Update)'),
        ]),
      );
    }

    this.data = tempList;
  }

  getChildren(
    task?: DailyMetricItem | undefined,
  ): ProviderResult<DailyMetricItem[]> {
    if (task === undefined) {
      return this.data;
    }
    return task.children;
  }

  getTreeItem(task: DailyMetricItem): TreeItem | Thenable<TreeItem> {
    return task;
  }
}
class DailyMetricItem extends TreeItem {
  children: DailyMetricItem[] | undefined;

  constructor(label: string, children?: DailyMetricItem[]) {
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
  window.registerTreeDataProvider(
    'DailyMetric',
    new DailyMetricDataProvider(data),
  );
}
