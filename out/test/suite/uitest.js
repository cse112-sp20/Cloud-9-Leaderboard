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
const assert = require('chai').assert;
describe('Hello World Example UI Tests', () => {
    let driver;
    before(() => {
        driver = vscode_extension_tester_1.VSBrowser.instance.driver;
    });
    it('Create a Team', () => __awaiter(void 0, void 0, void 0, function* () {
        const activityBar = new vscode_extension_tester_1.ActivityBar();
        const control = yield activityBar.getViewControl('Cloud9');
        const view = yield control.openView();
        //Click sign in on tree view
        const menuInfo = yield new vscode_extension_tester_1.SideBarView().getContent().getSection('Menu');
        yield (yield menuInfo.findItem('Sign in / Create Account')).click();
        //Click sign in on notfication
        const signInNotif = (yield new vscode_extension_tester_1.Workbench().getNotifications());
        //Get info from nofication
        const message = yield signInNotif[0].getMessage();
        assert.equal(message, 'Please sign in or create a new account!');
        //Click sign in and set email to be test@test.com
        yield signInNotif[0].takeAction('Create a new account');
        const input = yield vscode_extension_tester_1.InputBox.create();
        yield input.setText('test@test.com');
        //await input.confirm(); // press enter
        //await input.setText('password');
        const teamInfo = yield new vscode_extension_tester_1.SideBarView().getContent().getSection('Team Info');
        //Clicking an item in a
        yield (yield teamInfo.findItem('🛡 Create your Team')).click();
        // /await section.findItem('🛡 Create your Team')
    }));
});
//# sourceMappingURL=uitest.js.map