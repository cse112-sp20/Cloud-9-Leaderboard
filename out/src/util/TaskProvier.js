"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testCallback = exports.DailyMetricDataProvider = void 0;
const vscode_1 = require("vscode");
class DailyMetricDataProvider {
    constructor(d) {
        console.log(d);
        this.data = [];
        let tempList = [];
        for (let key in d) {
            tempList.push(new DailyMetricItem(key, [new DailyMetricItem(d[key] + '')]));
        }
        this.data = tempList;
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
    vscode_1.window.registerTreeDataProvider('DailyMetric', new DailyMetricDataProvider(data));
}
exports.testCallback = testCallback;
//# sourceMappingURL=TaskProvier.js.map