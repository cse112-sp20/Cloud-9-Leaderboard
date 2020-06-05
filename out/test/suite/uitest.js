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
describe('Cloud 9 UI Tests', () => {
    it('End to End Test', function () {
        return __awaiter(this, void 0, void 0, function* () {
            this.timeout(10000);
            this.retries();
            const activityBar = new vscode_extension_tester_1.ActivityBar();
            const control = yield activityBar.getViewControl('Cloud9');
            yield control.openView();
            //Click sign in on tree view
            const sidebar = new vscode_extension_tester_1.SideBarView();
            const menuInfo = yield sidebar.getContent().getSection('Menu');
            yield (yield menuInfo.findItem('Sign in / Create Account')).click();
            //Click sign in on notfication
            const signInNotif = (yield new vscode_extension_tester_1.Workbench().getNotifications());
            //Get info from nofication
            const message = yield signInNotif[0].getMessage();
            assert.equal(message, 'Please sign in or create a new account!');
            //Click sign in and set email to be test@test.com
            yield signInNotif[0].takeAction((yield signInNotif[0].getActions())[0].getTitle());
            const input = yield vscode_extension_tester_1.InputBox.create();
            yield input.setText('tester@test.com');
            yield input.confirm(); // press enter
            yield input.setText('password');
            yield input.confirm(); // press enter
            assert.equal((yield (yield new vscode_extension_tester_1.Workbench().getNotifications())[0].getMessage()) == '', false);
            //View personal stats
            console.log('1');
            yield (yield menuInfo.findItem('📊 View personal stats')).click();
            console.log('2');
            const personalStats = new vscode_extension_tester_1.TextEditor();
            console.log('3');
            const personalStatsTitle = yield personalStats.getTitle();
            console.log('4');
            assert(personalStatsTitle, "personal_statistics.txt");
            //View global leaderboard
            console.log('5');
            yield (yield menuInfo.findItem('🌐 Leaderboard')).click();
            console.log('6');
            const globalStats = yield new vscode_extension_tester_1.EditorView().openEditor('leaderboard.txt');
            console.log('7');
            assert.equal((yield globalStats.getTitle()) == "", false); // check actual text
            console.log('8');
            //console.log(await globalStats.getText()); */
            //Load up team
            console.log('9');
            const teamInfo = yield sidebar.getContent().getSection('Team Info');
            console.log('10');
            yield (yield teamInfo.findItem('🛡 Create your Team')).click();
            console.log('11');
            //Check that testTeam is the team name
            yield (yield teamInfo.findItem('Get Team Info')).click();
            console.log('12');
            yield (yield (yield teamInfo.findItem('Get Team Info')).findChildItem("TeamName")).click();
            assert.equal((yield (yield (yield teamInfo.findItem('Get Team Info')).findChildItem("TeamName"))) == undefined, false);
            console.log('13');
        });
    });
});
//# sourceMappingURL=uitest.js.map