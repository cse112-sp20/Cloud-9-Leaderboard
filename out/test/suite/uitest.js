"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_extension_tester_1 = require("vscode-extension-tester");
const chai_1 = require("chai");
describe('Hello World Example UI Tests', () => {
    let driver;
    before(() => {
        driver = vscode_extension_tester_1.VSBrowser.instance.driver;
    });
    it('Command shows a notification with the correct text', () => __awaiter(void 0, void 0, void 0, function* () {
        const workbench = new vscode_extension_tester_1.Workbench();
        yield workbench.executeCommand('Hello World');
        const notification = yield driver.wait(() => { return notificationExists('Hello'); }, 10000);
        chai_1.expect(yield notification.getMessage()).equals('Hello World!');
        chai_1.expect(yield notification.getType()).equals(vscode_extension_tester_1.NotificationType.Info);
    }));
});
function notificationExists(text) {
    return __awaiter(this, void 0, void 0, function* () {
        const notifications = yield new vscode_extension_tester_1.Workbench().getNotifications();
        for (const notification of notifications) {
            const message = yield notification.getMessage();
            if (message.indexOf(text) >= 0) {
                return notification;
            }
        }
    });
}
//# sourceMappingURL=uitest.js.map