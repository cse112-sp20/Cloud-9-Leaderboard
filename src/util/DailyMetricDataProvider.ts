/**
 * File that contains method and class that enable displaying
 * user's daily metrics
 *
 * Contain DailyMetricData Provider and DailyMetricItem class.
 *
 * @file   This files defines DailyMetricData Provider, Daily Metric Item class.
 * @author AuthorName.
 */

import {
  window,
  commands,
  TreeDataProvider,
  TreeItemCollapsibleState,
  ProviderResult,
  TreeItem,
  Event,
  EventEmitter,
} from "vscode";

import {getExtensionContext} from "./Authentication";
import {
  GLOBAL_STATE_USER_ID,
  DAILY_METRIC_NO_DATA_YET_TREEVIEW,
  DAILY_METRIC_KEYSTROKES_TREEVIEW,
  DAILY_METRIC_LINES_CHANGED_TREEVIEW,
  DAILY_METRIC_TIME_INTERVAL_TREEVIEW,
  DAILY_METRIC_POINTS_TREEVIEW,
  DAILY_METRIC_DISPLAY_HEADER_MAP_TREEVIEW,
} from "./Constants";

import {retrieveUserUpdateDailyMetric} from "./Firestore";

/**
 * Daily metric data provider
 */
export class DailyMetricDataProvider
  implements TreeDataProvider<DailyMetricItem> {
  private _onDidChangeTreeData: EventEmitter<
    DailyMetricItem | undefined
  > = new EventEmitter<DailyMetricItem | undefined>();
  readonly onDidChangeTreeData: Event<DailyMetricItem | undefined> = this
    ._onDidChangeTreeData.event;

  /**
   * Refreshs daily metric data provider
   * @returns refresh
   */
  refresh(): void {
    const ctx = getExtensionContext();

    if (ctx.globalState.get(GLOBAL_STATE_USER_ID) === undefined) {
      this.data = [
        new DailyMetricItem(DAILY_METRIC_KEYSTROKES_TREEVIEW, [
          new DailyMetricItem(
            "🚀 Today: " + "0" + DAILY_METRIC_NO_DATA_YET_TREEVIEW,
          ),
        ]),
        new DailyMetricItem(DAILY_METRIC_LINES_CHANGED_TREEVIEW, [
          new DailyMetricItem(
            "🚀 Today: " + "0" + DAILY_METRIC_NO_DATA_YET_TREEVIEW,
          ),
        ]),
        new DailyMetricItem(DAILY_METRIC_TIME_INTERVAL_TREEVIEW, [
          new DailyMetricItem(
            "🚀 Today: " + "0" + DAILY_METRIC_NO_DATA_YET_TREEVIEW,
          ),
        ]),
        new DailyMetricItem(DAILY_METRIC_POINTS_TREEVIEW, [
          new DailyMetricItem(
            "🚀 Today: " + "0" + DAILY_METRIC_NO_DATA_YET_TREEVIEW,
          ),
        ]),
      ];
      return;
    } else {
      retrieveUserUpdateDailyMetric().then((userDocument) => {
        if (userDocument === undefined) {
          this.data = [
            new DailyMetricItem(DAILY_METRIC_KEYSTROKES_TREEVIEW, [
              new DailyMetricItem(
                "🚀 Today: " + "0" + DAILY_METRIC_NO_DATA_YET_TREEVIEW,
              ),
            ]),
            new DailyMetricItem(DAILY_METRIC_LINES_CHANGED_TREEVIEW, [
              new DailyMetricItem(
                "🚀 Today: " + "0" + DAILY_METRIC_NO_DATA_YET_TREEVIEW,
              ),
            ]),
            new DailyMetricItem(DAILY_METRIC_TIME_INTERVAL_TREEVIEW, [
              new DailyMetricItem(
                "🚀 Today: " + "0" + DAILY_METRIC_NO_DATA_YET_TREEVIEW,
              ),
            ]),
            new DailyMetricItem(DAILY_METRIC_POINTS_TREEVIEW, [
              new DailyMetricItem(
                "🚀 Today: " + "0" + DAILY_METRIC_NO_DATA_YET_TREEVIEW,
              ),
            ]),
          ];
        } else {
          var today = new Date();

          var time =
            today.getHours() +
            ":" +
            today.getMinutes() +
            ":" +
            today.getSeconds();
          this.data = [];

          let tempList = [];
          for (let key in userDocument) {
            if (key === "teamId") {
              continue;
            }

            tempList.push(
              new DailyMetricItem(
                DAILY_METRIC_DISPLAY_HEADER_MAP_TREEVIEW[key],
                [
                  new DailyMetricItem(
                    "🚀 Today: " +
                      +userDocument[key].toFixed(3) +
                      " (Updated: " +
                      time +
                      ")",
                  ),
                ],
              ),
            );
          }

          this.data = tempList;
        }
      });
    }

    this._onDidChangeTreeData.fire(null);
  }

  data: DailyMetricItem[];

  /**
   * Creates an instance of daily metric data provider.
   * @param d
   */
  constructor(d) {
    if (d == undefined) {
      this.data = [
        new DailyMetricItem(DAILY_METRIC_KEYSTROKES_TREEVIEW, [
          new DailyMetricItem(
            "🚀 Today: " + "0" + DAILY_METRIC_NO_DATA_YET_TREEVIEW,
          ),
        ]),
        new DailyMetricItem(DAILY_METRIC_LINES_CHANGED_TREEVIEW, [
          new DailyMetricItem(
            "🚀 Today: " + "0" + DAILY_METRIC_NO_DATA_YET_TREEVIEW,
          ),
        ]),
        new DailyMetricItem(DAILY_METRIC_TIME_INTERVAL_TREEVIEW, [
          new DailyMetricItem(
            "🚀 Today: " + "0" + DAILY_METRIC_NO_DATA_YET_TREEVIEW,
          ),
        ]),
        new DailyMetricItem(DAILY_METRIC_POINTS_TREEVIEW, [
          new DailyMetricItem(
            "🚀 Today: " + "0" + DAILY_METRIC_NO_DATA_YET_TREEVIEW,
          ),
        ]),
      ];
    } else {
      var today = new Date();

      var time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

      this.data = [];

      let tempList = [];
      for (let key in d) {
        if (key === "teamId") {
          continue;
        }

        tempList.push(
          new DailyMetricItem(DAILY_METRIC_DISPLAY_HEADER_MAP_TREEVIEW[key], [
            new DailyMetricItem(
              "🚀 Today: " + +d[key].toFixed(3) + " (Updated: " + time + ")",
            ),
          ]),
        );
      }

      this.data = tempList;
    }
  }

  /**
   * Gets children
   * @param [task]
   * @returns children
   */
  getChildren(
    task?: DailyMetricItem | undefined,
  ): ProviderResult<DailyMetricItem[]> {
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
  getTreeItem(task: DailyMetricItem): TreeItem | Thenable<TreeItem> {
    return task;
  }
}

/**
 * Daily metric item
 */
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

/**
 * Constructs daily metric data
 * @param data
 * @param ctx
 */
export function constructDailyMetricData(data, ctx) {
  let cloud9DailyMetricDataProvier = new DailyMetricDataProvider(data);

  window.registerTreeDataProvider("DailyMetric", cloud9DailyMetricDataProvier);

  commands.registerCommand("DailyMetric.refreshEntry", () =>
    cloud9DailyMetricDataProvier.refresh(),
  );
}
