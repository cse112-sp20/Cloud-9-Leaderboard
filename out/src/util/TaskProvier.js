"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testCallback = exports.TaskProvider = void 0;
const vscode_1 = require("vscode");
class TaskProvider {
    constructor(d) {
        console.log(d);
        this.data = [];
        let tempList = [];
        for (let key in d) {
            tempList.push(new TreeTask(key, [new TreeTask(d[key] + '')]));
        }
        this.data = [new TreeTask('DAILY METRICS', tempList)];
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
exports.TaskProvider = TaskProvider;
class TreeTask extends vscode_1.TreeItem {
    constructor(label, children) {
        super(label, children === undefined
            ? vscode_1.TreeItemCollapsibleState.None
            : vscode_1.TreeItemCollapsibleState.Expanded);
        this.children = children;
    }
}
function testCallback(data, ctx) {
    vscode_1.window.registerTreeDataProvider('exampleView', new TaskProvider(data));
}
exports.testCallback = testCallback;
//# sourceMappingURL=TaskProvier.js.map