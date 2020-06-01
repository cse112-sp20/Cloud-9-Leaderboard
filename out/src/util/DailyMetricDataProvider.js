"use strict";
/**
 * File that contains method and class that enable displaying
 * user's daily metrics
 *
 * Contain DailyMetricData Provider and DailyMetricItem class.
 *
 * @file   This files defines the MyClass class.
 * @author AuthorName.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.testCallback = exports.DailyMetricDataProvider = void 0;
const vscode_1 = require("vscode");
const Authentication_1 = require("./Authentication");
const Constants_1 = require("./Constants");
const Firestore_1 = require("./Firestore");
const displayHeaderMap = {
    keystrokes: 'Keystrokes',
    linesChanged: 'Lines Changed',
    timeInterval: 'Time Interval',
    points: 'Total Points',
};
class DailyMetricDataProvider {
    constructor(d) {
        this._onDidChangeTreeData = new vscode_1.EventEmitter();
        this.onDidChangeTreeData = this
            ._onDidChangeTreeData.event;
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
        }
        else {
            var today = new Date();
            var time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
            this.data = [];
            let tempList = [];
            for (let key in d) {
                if (key === 'teamId') {
                    continue;
                }
                tempList.push(new DailyMetricItem(displayHeaderMap[key], [
                    new DailyMetricItem('🚀 Today: ' + d[key] + ' (Updated: ' + time + ')'),
                ]));
            }
            this.data = tempList;
        }
    }
    refresh() {
        const ctx = Authentication_1.getExtensionContext();
        if (ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_ID) === undefined) {
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
        }
        else {
            Firestore_1.retrieveUserUpdateDailyMetric().then((userDocument) => {
                var today = new Date();
                var time = today.getHours() +
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
                    tempList.push(new DailyMetricItem(displayHeaderMap[key], [
                        new DailyMetricItem('🚀 Today: ' + userDocument[key] + ' (Updated: ' + time + ')'),
                    ]));
                }
                this.data = tempList;
            });
        }
        this._onDidChangeTreeData.fire(null);
    }
    getChildren(task) {
        if (task === undefined) {
            return this.data;
        }
        return task.children;
    }
    getTreeItem(task) {
        return task;
    }
}
exports.DailyMetricDataProvider = DailyMetricDataProvider;
class DailyMetricItem extends vscode_1.TreeItem {
    constructor(label, children) {
        super(label, children === undefined
            ? vscode_1.TreeItemCollapsibleState.None
            : vscode_1.TreeItemCollapsibleState.Expanded);
        this.children = children;
    }
}
function testCallback(data, ctx) {
    let cloud9DailyMetricDataProvier = new DailyMetricDataProvider(data);
    vscode_1.window.registerTreeDataProvider('DailyMetric', cloud9DailyMetricDataProvier);
    vscode_1.commands.registerCommand('DailyMetric.refreshEntry', () => cloud9DailyMetricDataProvier.refresh());
}
exports.testCallback = testCallback;
//# sourceMappingURL=DailyMetricDataProvider.js.map