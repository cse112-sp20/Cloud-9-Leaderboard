"use strict";
/**
 * Summary. (use period)
 *
 * Description. (use period)
 *
 * @link   URL
 * @file   This files defines the MyClass class.
 * @author AuthorName.
 * @since  x.x.x
 */
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
exports.removeTeamMember = exports.joinTeam = exports.getTeamInfo = exports.removeTeamNameAndId = exports.createAndJoinTeam = void 0;
const vscode_1 = require("vscode");
const Firestore_1 = require("./Firestore");
const Authentication_1 = require("./Authentication");
const Constants_1 = require("./Constants");
/**
 * prompts the user to enter a team name and updates the firebase 2
 */
function createAndJoinTeam() {
    return __awaiter(this, void 0, void 0, function* () {
        //first check if already in team
        const inTeam = yield Firestore_1.checkIfInTeam();
        if (inTeam) {
            vscode_1.window.showInformationMessage('You have already joined a team!');
            return;
        }
        vscode_1.window.showInformationMessage('Enter a name for your new team!');
        yield vscode_1.window
            .showInputBox({ placeHolder: 'Enter a new team name' })
            .then((teamName) => __awaiter(this, void 0, void 0, function* () {
            if (teamName == undefined || teamName == '') {
                vscode_1.window.showInformationMessage('Please enter a valid team name!');
                return;
            }
            Firestore_1.addNewTeamToDbAndJoin(teamName);
        }));
    });
}
exports.createAndJoinTeam = createAndJoinTeam;
/**
 * DEBUG: REMOVE CACHED TEAM NAME AND ID
 * leave the team
 */
function removeTeamNameAndId() {
    return __awaiter(this, void 0, void 0, function* () {
        const ctx = Authentication_1.getExtensionContext();
        const teamId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_ID);
        const userId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_ID);
        console.log('team id: ' + teamId);
        console.log('user id: ' + userId);
        if (teamId == undefined) {
            vscode_1.window.showInformationMessage('Not in a team!');
            return;
        }
        Firestore_1.leaveTeam(userId, teamId);
    });
}
exports.removeTeamNameAndId = removeTeamNameAndId;
/**
 * returns user's team name and ID
 * values retrieved from persistent storage
 */
function getTeamInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        const ctx = Authentication_1.getExtensionContext();
        const teamName = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_NAME);
        const teamId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_ID);
        //check if is leader
        const isLeader = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_IS_TEAM_LEADER);
        if (teamName == '' && teamId == '') {
            vscode_1.window.showInformationMessage('No team info found.');
            return;
        }
        let messageStr = 'Your team name: ' + teamName + '\n';
        //if(isLeader){
        messageStr += 'Your team ID: ' + teamId;
        //}
        vscode_1.window.showInformationMessage(messageStr);
        if (isLeader) {
            vscode_1.window.showInformationMessage('You are the leader of your team.');
        }
        else {
            vscode_1.window.showInformationMessage('You are a member of your team.');
        }
        console.log(messageStr);
    });
}
exports.getTeamInfo = getTeamInfo;
/**
 * prompts the user to enter a team code and add them to the team
 */
function joinTeam() {
    return __awaiter(this, void 0, void 0, function* () {
        //first check if user is already in a team
        const inTeam = yield Firestore_1.checkIfInTeam();
        if (inTeam) {
            vscode_1.window.showInformationMessage('You have already joined a team!');
            return;
        }
        yield vscode_1.window
            .showInputBox({ placeHolder: 'Enter a team code' })
            .then((teamCode) => __awaiter(this, void 0, void 0, function* () {
            if (teamCode == undefined) {
                vscode_1.window.showInformationMessage('Please enter a valid team name!');
                return;
            }
            Firestore_1.joinTeamWithTeamId(teamCode, false);
        }));
    });
}
exports.joinTeam = joinTeam;
function removeTeamMember() {
    return __awaiter(this, void 0, void 0, function* () {
        const ctx = Authentication_1.getExtensionContext();
        const isTeamLeader = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_IS_TEAM_LEADER);
        if (!isTeamLeader) {
            vscode_1.window.showErrorMessage('Sorry! Only the team leader is allowed to remove team members!');
            return;
        }
        const teamId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_ID);
        yield Firestore_1.fetchTeamMembersList(teamId)
            .then((memberMap) => {
            console.log('memberMap: ');
            console.log(memberMap);
            let quickpick = vscode_1.window.createQuickPick();
        })
            .catch(() => {
            console.log('Error getting team members!');
        });
    });
}
exports.removeTeamMember = removeTeamMember;
//# sourceMappingURL=Team.js.map