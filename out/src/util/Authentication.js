"use strict";
/**
 * Summary. (use period)
 *
 * Description. (use period)
 *
 * @file   This files defines the MyClass class.
 * @author AuthorName.
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
exports.checkIfCachedUserIdExistsAndPrompt = exports.signInOrSignUpUserWithUserInput = exports.authenticateUser = exports.logOut = exports.getExtensionContext = exports.storeExtensionContext = void 0;
const vscode_1 = require("vscode");
const Firestore_1 = require("./Firestore");
const Constants_1 = require("./Constants");
const DailyMetricDataProvider_1 = require("./DailyMetricDataProvider");
let extensionContext = undefined;
/**
 * stores the extension context
 * @param ctx vscode extension context
 */
function storeExtensionContext(ctx) {
    console.log('storing extension context');
    extensionContext = ctx;
}
exports.storeExtensionContext = storeExtensionContext;
/**
 * returns the vscode ExtensionContext
 */
function getExtensionContext() {
    return extensionContext;
}
exports.getExtensionContext = getExtensionContext;
/**
 *
 * removes extensionContext data
 */
function logOut() {
    let ctx = getExtensionContext();
    ctx.globalState.update(Constants_1.GLOBAL_STATE_USER_ID, undefined);
    ctx.globalState.update(Constants_1.GLOBAL_STATE_USER_TEAM_ID, undefined);
    ctx.globalState.update(Constants_1.GLOBAL_STATE_USER_TEAM_NAME, undefined);
    ctx.globalState.update(Constants_1.GLOBAL_STATE_USER_IS_TEAM_LEADER, false);
    ctx.globalState.update(Constants_1.GLOBAL_STATE_USER_NICKNAME, undefined);
    ctx.globalState.update(Constants_1.GLOBAL_STATE_USER_TEAM_MEMBERS, undefined);
    console.log('Logging out: ' + extensionContext.globalState);
    vscode_1.window.showInformationMessage('Goodbye!');
    vscode_1.commands.executeCommand('MenuView.refreshEntry');
    vscode_1.commands.executeCommand('LeaderView.refreshEntry');
    vscode_1.commands.executeCommand('DailyMetric.refreshEntry');
    vscode_1.commands.executeCommand('TeamMenuView.refreshEntry');
}
exports.logOut = logOut;
/**
 * authentication entry point
 * @param ctx
 */
function authenticateUser() {
    return __awaiter(this, void 0, void 0, function* () {
        const ctx = getExtensionContext();
        const cachedUserId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_ID);
        const cachedUserNickName = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_NICKNAME);
        const cachedTeamName = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_NAME);
        const cachedTeamId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_ID);
        const cachedTeamLeadId = ctx.globalState.get(Constants_1.FIELD_ID_TEAM_LEAD_USER_ID);
        const isTeamLeadr = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_IS_TEAM_LEADER);
        if (cachedUserId === undefined) {
            // case1: sign in or create new account
            vscode_1.window.showInformationMessage('Cloud9: Welcome to Cloud 9!');
            signInOrSignUpUserWithUserInput().then(() => {
                Firestore_1.retrieveUserDailyMetric(DailyMetricDataProvider_1.constructDailyMetricData, ctx);
            });
        }
        else {
            // case2: existing user's id found
            console.log('Found cachedUserId: ' + cachedUserId);
            console.log('Found cachedTeamName: ' + cachedTeamName);
            console.log('Found cachedTeamId: ' + cachedTeamId);
            console.log('Found cachedUserNickname: ' + cachedUserNickName);
            //check if user doc exists in firebase
            let exists = yield Firestore_1.userDocExists(cachedUserId);
            if (exists) {
                console.log('user doc exists');
                Firestore_1.updatePersistentStorageWithUserDocData(cachedUserId).then(() => {
                    Firestore_1.retrieveUserDailyMetric(DailyMetricDataProvider_1.constructDailyMetricData, ctx);
                });
                vscode_1.window.showInformationMessage('Welcome back, ' + cachedUserNickName + '!!');
                console.log('is team leade ' + isTeamLeadr);
                vscode_1.commands.executeCommand('MenuView.refreshEntry');
                vscode_1.commands.executeCommand('LeaderView.refreshEntry');
                vscode_1.commands.executeCommand('TeamMenuView.refreshEntry');
            }
            else {
                // user doc does not exist, prompt user to sign in or sign up
                signInOrSignUpUserWithUserInput().then(() => {
                    Firestore_1.retrieveUserDailyMetric(DailyMetricDataProvider_1.constructDailyMetricData, ctx);
                });
            }
        }
    });
}
exports.authenticateUser = authenticateUser;
/**
 * prompts the user to sign in or sign up with input email and password
 */
function signInOrSignUpUserWithUserInput() {
    return __awaiter(this, void 0, void 0, function* () {
        const ctx = getExtensionContext();
        let email = undefined;
        let password = undefined;
        //prompt the user to sign in or create an account upon activating the extension
        vscode_1.window
            .showInformationMessage('Please sign in or create a new account!', Constants_1.AUTH_SIGN_IN, Constants_1.AUTH_CREATE_ACCOUNT)
            .then((selection) => __awaiter(this, void 0, void 0, function* () {
            if (selection == undefined) {
                return;
            }
            yield vscode_1.window
                .showInputBox({ placeHolder: 'Enter your email: example@gmail.com' })
                .then((inputEmail) => {
                email = inputEmail;
            })
                .then(() => __awaiter(this, void 0, void 0, function* () {
                yield vscode_1.window
                    .showInputBox({
                    placeHolder: 'Enter your password (must be 6 characters long or more)',
                    password: true,
                })
                    .then((inputPassword) => {
                    password = inputPassword;
                });
            }))
                .then(() => __awaiter(this, void 0, void 0, function* () {
                if (email == undefined ||
                    password == undefined ||
                    email == '' ||
                    password == '') {
                    vscode_1.window.showErrorMessage('Invalid email or password!');
                }
                else {
                    if (selection == Constants_1.AUTH_SIGN_IN) {
                        yield Firestore_1.loginUserWithEmailAndPassword(email, password).then((result) => __awaiter(this, void 0, void 0, function* () {
                            console.log(result.loggedIn);
                            console.log(result.errorCode);
                            if (result.loggedIn) {
                                //successfully logged in
                                vscode_1.window.showInformationMessage('Welcome back, ' +
                                    ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_NICKNAME) +
                                    '!!');
                                vscode_1.commands.executeCommand('MenuView.refreshEntry');
                                vscode_1.commands.executeCommand('LeaderView.refreshEntry');
                                vscode_1.commands.executeCommand('TeamMenuView.refreshEntry');
                                vscode_1.commands.executeCommand('DailyMetric.refreshEntry');
                                return;
                            }
                            //not logged in
                            if (result.errorCode == Constants_1.AUTH_ERR_CODE_WRONG_PASSWORD) {
                                vscode_1.window.showErrorMessage('Wrong password!');
                            }
                            else if (result.errorCode == Constants_1.AUTH_ERR_CODE_USER_NOT_FOUND) {
                                vscode_1.window.showErrorMessage('User not found!');
                            }
                            else if (result.errorCode == Constants_1.AUTH_ERR_CODE_INVALID_EMAIL) {
                                vscode_1.window.showErrorMessage('Invalid email!');
                            }
                        }));
                        vscode_1.commands.executeCommand('MenuView.refreshEntry');
                        vscode_1.commands.executeCommand('LeaderView.refreshEntry');
                        vscode_1.commands.executeCommand('TeamMenuView.refreshEntry');
                        vscode_1.commands.executeCommand('DailyMetric.refreshEntry');
                    }
                    else if (selection == Constants_1.AUTH_CREATE_ACCOUNT) {
                        yield Firestore_1.createNewUserInFirebase(email, password).then((result) => __awaiter(this, void 0, void 0, function* () {
                            console.log(result.created);
                            console.log(result.errorCode);
                            if (result.created) {
                                vscode_1.window.showInformationMessage('Welcome! Your nickname is: ' +
                                    ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_NICKNAME) +
                                    '!!');
                                vscode_1.commands.executeCommand('MenuView.refreshEntry');
                                vscode_1.commands.executeCommand('LeaderView.refreshEntry');
                                vscode_1.commands.executeCommand('TeamMenuView.refreshEntry');
                                return;
                            }
                            //not created
                            if (result.errorCode == Constants_1.AUTH_ERR_CODE_EMAIL_USED) {
                                vscode_1.window.showErrorMessage('Email already in use!');
                            }
                            else if (result.errorCode == Constants_1.AUTH_ERR_CODE_WEAK_PASSWORD) {
                                vscode_1.window.showErrorMessage('Password is too weak! Needs to be 6 characters long or more!');
                            }
                            else if (result.errorCode == Constants_1.AUTH_ERR_CODE_INVALID_EMAIL) {
                                vscode_1.window.showErrorMessage('Invalid email!');
                            }
                            else {
                                vscode_1.window.showErrorMessage(result.errorCode);
                            }
                        }));
                    }
                }
            }));
        }));
    });
}
exports.signInOrSignUpUserWithUserInput = signInOrSignUpUserWithUserInput;
/**
 * if user id is not found in persistent storage, prompt the user to sign in or sign up
 * return whether the id is found (after the prompt)
 */
function checkIfCachedUserIdExistsAndPrompt() {
    return __awaiter(this, void 0, void 0, function* () {
        const ctx = getExtensionContext();
        let cachedUserId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_ID);
        let loggedIn = false;
        if (cachedUserId != undefined) {
            loggedIn = true;
        }
        else {
            yield signInOrSignUpUserWithUserInput().then(() => __awaiter(this, void 0, void 0, function* () {
                cachedUserId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_ID);
                if (cachedUserId != undefined) {
                    loggedIn = true;
                    yield Firestore_1.retrieveUserDailyMetric(DailyMetricDataProvider_1.constructDailyMetricData, ctx);
                }
            }));
        }
        return loggedIn;
    });
}
exports.checkIfCachedUserIdExistsAndPrompt = checkIfCachedUserIdExistsAndPrompt;
//# sourceMappingURL=Authentication.js.map