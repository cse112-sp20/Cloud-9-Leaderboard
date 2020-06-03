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
describe('Hello World Example UI Tests', () => {
    let driver;
    before(() => {
        driver = vscode_extension_tester_1.VSBrowser.instance.driver;
    });
    it('Command shows a notification with the correct text', () => __awaiter(void 0, void 0, void 0, function* () {
        const activityBar = new vscode_extension_tester_1.ActivityBar();
        const control = yield activityBar.getViewControl('Cloud9');
        const view = yield control.openView();
    }));
});
//# sourceMappingURL=uitest.js.map