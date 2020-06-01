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
exports.registerNewUserWithGeneratedCredential = exports.checkIfCachedUserIdExistsAndPrompt = exports.signInOrSignUpUserWithUserInput = exports.registerNewUserOrSigInWithUserInput = exports.authenticateUser = exports.logOut = exports.getExtensionContext = exports.storeExtensionContext = void 0;
const vscode_1 = require("vscode");
const Firestore_1 = require("./Firestore");
const Utility_1 = require("./Utility");
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
 * *****for debugging purpose only******
 * removes extensionContext data
 */
function logOut() {
    let ctx = getExtensionContext();
    ctx.globalState.update(Constants_1.GLOBAL_STATE_USER_ID, undefined);
    ctx.globalState.update(Constants_1.GLOBAL_STATE_USER_TEAM_ID, undefined);
    ctx.globalState.update(Constants_1.GLOBAL_STATE_USER_TEAM_NAME, undefined);
    ctx.globalState.update(Constants_1.GLOBAL_STATE_USER_IS_TEAM_LEADER, undefined);
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
        if (cachedUserId === undefined) {
            // case1: sign in or create new account
            vscode_1.window.showInformationMessage('Cloud9: Welcome to Cloud 9!');
            signInOrSignUpUserWithUserInput().then(() => {
                Firestore_1.retrieveUserDailyMetric(DailyMetricDataProvider_1.testCallback, ctx);
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
                Firestore_1.updatePersistentStorageWithUserDocData(cachedUserId).then(() => {
                    Firestore_1.retrieveUserDailyMetric(DailyMetricDataProvider_1.testCallback, ctx);
                });
                vscode_1.window.showInformationMessage('Welcome back, ' + cachedUserNickName + '!!');
                vscode_1.commands.executeCommand('MenuView.refreshEntry');
                vscode_1.commands.executeCommand('LeaderView.refreshEntry');
                vscode_1.commands.executeCommand('TeamMenuView.refreshEntry');
            }
            else {
                // user doc does not exist, prompt user to sign in or sign up
                signInOrSignUpUserWithUserInput().then(() => {
                    Firestore_1.retrieveUserDailyMetric(DailyMetricDataProvider_1.testCallback, ctx);
                });
            }
        }
    });
}
exports.authenticateUser = authenticateUser;
/**
 * prompt the user to enter an email and password and sign in or create a new account for them
 */
function registerNewUserOrSigInWithUserInput() {
    return __awaiter(this, void 0, void 0, function* () {
        // const ctx = getExtensionContext();
        // let email = null;
        // let password = null;
        // let completed = false;
        // while (!completed) {
        //   //forcing the user to always sign in
        //   window
        //     .showInformationMessage(
        //       'Please sign in or create a new account.',
        //       'Sign in',
        //       'Create account',
        //     )
        //     .then(async (selection) => {
        //       console.log(selection);
        //     });
        //   //prompt for email and password
        //   await window
        //     .showInputBox({placeHolder: 'Enter your email'})
        //     .then((inputEmail) => {
        //       email = inputEmail;
        //       console.log('user input email: ' + email);
        //     })
        //     .then(async () => {
        //       await window
        //         .showInputBox({
        //           placeHolder:
        //             'Enter your password (must be 6 characters long or more)',
        //           password: true,
        //         })
        //         .then((inputPassword) => {
        //           password = inputPassword;
        //           console.log('user input password: ' + password);
        //         });
        //     })
        //     .then(async () => {
        //       if (
        //         email == undefined ||
        //         password == undefined ||
        //         email == '' ||
        //         password == ''
        //       ) {
        //         window.showInformationMessage(
        //           'Invalid email or password! Please try again!',
        //         );
        //       } else {
        //         //first try creating a new user account
        //         //if email is already in use, try logging them in with the credential
        //         await createNewUserInFirebase(email, password).then(
        //           async (result) => {
        //             console.log(result.created);
        //             console.log(result.errorCode);
        //             if (result.created) {
        //               window.showInformationMessage(
        //                 'Successfully created new account, your nickname is ' +
        //                   ctx.globalState.get(GLOBAL_STATE_USER_NICKNAME),
        //               );
        //               commands.executeCommand('MenuView.refreshEntry');
        //             }
        //             //email already in use, now log the user in
        //             else if (result.errorCode == 'auth/email-already-in-use') {
        //               await loginUserWithEmailAndPassword(email, password).then(
        //                 async (result) => {
        //                   console.log(result.loggedIn);
        //                   console.log(result.errorCode);
        //                   //successfully logged the user in, return
        //                   if (result.loggedIn == true) {
        //                     completed = true;
        //                     window.showInformationMessage(
        //                       'Hello, ' +
        //                         ctx.globalState.get(GLOBAL_STATE_USER_NICKNAME) +
        //                         '!!',
        //                     );
        //                     commands.executeCommand('MenuView.refreshEntry');
        //                     commands.executeCommand('LeaderView.refreshEntry');
        //                     return;
        //                   } else if (result.errorCode == 'auth/wrong-password') {
        //                     window.showInformationMessage(
        //                       'Wrong password! Please try again!',
        //                     );
        //                   }
        //                 },
        //               );
        //             } else if (result.errorCode == 'auth/weak-password') {
        //               window.showInformationMessage(
        //                 'Password must to be 6 characters or longer! Please try again!',
        //               );
        //             }
        //           },
        //         );
        //       }
        //     });
        //   completed = true;
        //   commands.executeCommand('MenuView.refreshEntry');
        //   commands.executeCommand('LeaderView.refreshEntry');
        // }
    });
}
exports.registerNewUserOrSigInWithUserInput = registerNewUserOrSigInWithUserInput;
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
                vscode_1.window.showInformationMessage('Sign in or sign up to unlock Cloud9 features!');
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
                    yield Firestore_1.retrieveUserDailyMetric(DailyMetricDataProvider_1.testCallback, ctx);
                }
            }));
        }
        return loggedIn;
    });
}
exports.checkIfCachedUserIdExistsAndPrompt = checkIfCachedUserIdExistsAndPrompt;
/**
 * not using this function
 */
function registerNewUserWithGeneratedCredential() {
    return __awaiter(this, void 0, void 0, function* () {
        const email = Utility_1.generateRandomEmail();
        yield Firestore_1.createNewUserInFirebase(email, Constants_1.DEFAULT_PASSWORD);
    });
}
exports.registerNewUserWithGeneratedCredential = registerNewUserWithGeneratedCredential;
//# sourceMappingURL=Authentication.js.map