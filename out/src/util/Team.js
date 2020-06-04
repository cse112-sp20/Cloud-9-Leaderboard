"use strict";
/**
 * This file contains functions for team management.
 * Functions from Firestore.ts are called to update/retrieve data on firebase.
 *
 * @file   Team.ts
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
exports.joinTeam = exports.getTeamInfo = exports.createAndJoinTeam = void 0;
const vscode_1 = require("vscode");
const Firestore_1 = require("./Firestore");
const Authentication_1 = require("./Authentication");
const Constants_1 = require("./Constants");
/**
 * prompts the user to enter a team name and updates the firebase
 * @return nothing
 */
function createAndJoinTeam() {
    return __awaiter(this, void 0, void 0, function* () {
        //ID check
        yield Authentication_1.checkIfCachedUserIdExistsAndPrompt();
        const ctx = Authentication_1.getExtensionContext();
        const cachedUserId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_ID);
        if (cachedUserId === undefined || cachedUserId === '') {
            vscode_1.window.showErrorMessage(Constants_1.AUTH_NOT_LOGGED_IN);
            return;
        }
        else {
            // First check if already in team
            const inTeam = yield Firestore_1.checkIfInTeam();
            // If the user is already in a team, they cannot create a new team
            if (inTeam) {
                vscode_1.window.showInformationMessage('You have already joined a team!');
                return;
            }
            vscode_1.window.showInformationMessage('Enter a name for your new team!');
            //prompt the user to enter a name for their team and create a new doc for the team
            yield vscode_1.window
                .showInputBox({ placeHolder: 'Enter a new team name' })
                .then((teamName) => __awaiter(this, void 0, void 0, function* () {
                if (teamName == undefined || teamName == '') {
                    vscode_1.window.showInformationMessage('Please enter a valid team name!');
                    return;
                }
                //function call to add a firebase document for this new team
                Firestore_1.addNewTeamToDbAndJoin(teamName);
            }));
        }
    });
}
exports.createAndJoinTeam = createAndJoinTeam;
/**
 * returns user's team name and ID
 * values retrieved from persistent storage
 */
function getTeamInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Authentication_1.checkIfCachedUserIdExistsAndPrompt();
        const ctx = Authentication_1.getExtensionContext();
        const teamName = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_NAME);
        const teamId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_ID);
        const cachedUserId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_ID);
        if (cachedUserId == undefined || cachedUserId == '') {
            vscode_1.window.showErrorMessage(Constants_1.AUTH_NOT_LOGGED_IN);
            return;
        }
        if (teamId == undefined || teamId == '') {
            vscode_1.window.showInformationMessage('No team info found.');
            return;
        }
        let messageStr = 'Your team name: ' + teamName + '\n';
        messageStr += 'Your team ID: ' + teamId;
        console.log(messageStr);
        vscode_1.window.showInformationMessage(messageStr, { modal: true });
        return messageStr;
    });
}
exports.getTeamInfo = getTeamInfo;
/**
 * prompts the user to enter a team code and add them to the team
 */
function joinTeam() {
    return __awaiter(this, void 0, void 0, function* () {
        //ID check
        yield Authentication_1.checkIfCachedUserIdExistsAndPrompt();
        //first check if user is already in a team
        const inTeam = yield Firestore_1.checkIfInTeam();
        if (inTeam) {
            vscode_1.window.showInformationMessage('You have already joined a team!');
            return;
        }
        const ctx = Authentication_1.getExtensionContext();
        const cachedUserId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_ID);
        if (cachedUserId === undefined || cachedUserId === '') {
            vscode_1.window.showErrorMessage(Constants_1.AUTH_NOT_LOGGED_IN);
        }
        else {
            yield vscode_1.window
                .showInputBox({ placeHolder: 'Enter a team code' })
                .then((teamCode) => __awaiter(this, void 0, void 0, function* () {
                if (teamCode == undefined) {
                    vscode_1.window.showInformationMessage('Please enter a valid team name!');
                    return;
                }
                Firestore_1.joinTeamWithTeamId(teamCode, false);
            }));
        }
    });
}
exports.joinTeam = joinTeam;
//# sourceMappingURL=Team.js.map