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

import {getExtensionContext} from './Authentication';
import {GLOBAL_STATE_USER_ID} from './Constants';

import {retrieveUserUpdateDailyMetric} from './Firestore';

const displayHeaderMap = {
  keystrokes: 'Keystrokes',
  linesChanged: 'Lines Changed',
  timeInterval: 'Time Interval',
  points: 'Total Points',
};

export class DailyMetricDataProvider
  implements TreeDataProvider<DailyMetricItem> {
  private _onDidChangeTreeData: EventEmitter<
    DailyMetricItem | undefined
  > = new EventEmitter<DailyMetricItem | undefined>();
  readonly onDidChangeTreeData: Event<DailyMetricItem | undefined> = this
    ._onDidChangeTreeData.event;

  refresh(): void {
    const ctx = getExtensionContext();

    if (ctx.globalState.get(GLOBAL_STATE_USER_ID) === undefined) {
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
      return;
    } else {
      retrieveUserUpdateDailyMetric().then((userDocument) => {
        var today = new Date();

        var time =
          today.getHours() +
          ':' +
          today.getMinutes() +
          ':' +
          today.getSeconds();
        this.data = [];

        let tempList = [];
        for (let key in userDocument) {
          if (key === 'teamId') {
            continue;
          }

          tempList.push(
            new DailyMetricItem(displayHeaderMap[key], [
              new DailyMetricItem(
                '🚀 Today: ' + userDocument[key] + ' (Updated: ' + time + ')',
              ),
            ]),
          );
        }

        this.data = tempList;
      });
    }

    this._onDidChangeTreeData.fire(null);
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
      var today = new Date();

      var time =
        today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();

      this.data = [];

      let tempList = [];
      for (let key in d) {
        if (key === 'teamId') {
          continue;
        }

        tempList.push(
          new DailyMetricItem(displayHeaderMap[key], [
            new DailyMetricItem(
              '🚀 Today: ' + d[key] + ' (Updated: ' + time + ')',
            ),
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
export class DailyMetricItem extends TreeItem {
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
