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

import {retrieveUserUpdateDailyMetric} from './Firestore';

export class DailyMetricDataProvider
  implements TreeDataProvider<DailyMetricItem> {
  private _onDidChangeTreeData: EventEmitter<
    DailyMetricItem | undefined
  > = new EventEmitter<DailyMetricItem | undefined>();
  readonly onDidChangeTreeData: Event<DailyMetricItem | undefined> = this
    ._onDidChangeTreeData.event;

  refresh(): void {
    retrieveUserUpdateDailyMetric().then((userDocument) => {
      console.log(userDocument);
      this.data = [];

      let tempList = [];
      for (let key in userDocument) {
        if (key === 'teamId') {
          continue;
        }

        console.log('key: ' + key);
        tempList.push(
          new DailyMetricItem(key, [
            new DailyMetricItem(
              '🚀 Today: ' + userDocument[key] + ' (Latest Update)',
            ),
          ]),
        );
      }

      this.data = tempList;

      console.log('Refresh daily metric called');
      this._onDidChangeTreeData.fire(null);
    });
  }

  data: DailyMetricItem[];
  constructor(d) {
    if (d == undefined) {
      this.data = [
        new DailyMetricItem('Keystrokes', [
          new DailyMetricItem('🚀 Today: ' + '0' + ' (No data yet)'),
        ]),
        new DailyMetricItem('Lines Changed', [
          new DailyMetricItem('🚀 Today: ' + '0' + ' (No data yet)'),
        ]),
        new DailyMetricItem('Time Interval', [
          new DailyMetricItem('🚀 Today: ' + '0' + ' (No data yet)'),
        ]),
        new DailyMetricItem('Points', [
          new DailyMetricItem('🚀 Today: ' + '0' + ' (No data yet)'),
        ]),
      ];
    } else {
      console.log(d);

      this.data = [];

      let tempList = [];
      for (let key in d) {
        if (key === 'teamId') {
          continue;
        }

        tempList.push(
          new DailyMetricItem(key, [
            new DailyMetricItem('🚀 Today: ' + d[key] + ' (Latest Update)'),
          ]),
        );
      }

      this.data = tempList;
    }
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
  let cloud9DailyMetricDataProvier = new DailyMetricDataProvider(data);

  window.registerTreeDataProvider('DailyMetric', cloud9DailyMetricDataProvier);

  commands.registerCommand('DailyMetric.refreshEntry', () =>
    cloud9DailyMetricDataProvier.refresh(),
  );
}
