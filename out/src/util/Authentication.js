"use strict";
/**
 * Summary. (use period)
 *
 * Description. (use period)
 *
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
exports.registerNewUserWithGeneratedCredential = exports.passwordRecovery = exports.registerNewUserOrSigInWithUserInput = exports.authenticateUser = exports.clearCachedUserId = exports.getExtensionContext = exports.storeExtensionContext = void 0;
const vscode_1 = require("vscode");
const Firestore_1 = require("./Firestore");
const Utility_1 = require("./Utility");
const Constants_1 = require("./Constants");
//export let cachedUserId = undefined;
let extensionContext = undefined;
/**
 * stores the extension context
 * @param ctx vscode extension context
 */
function storeExtensionContext(ctx) {
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
function clearCachedUserId() {
    let ctx = getExtensionContext();
    ctx.globalState.update(Constants_1.GLOBAL_STATE_USER_ID, undefined);
    ctx.globalState.update(Constants_1.GLOBAL_STATE_USER_EMAIL, undefined);
    ctx.globalState.update(Constants_1.GLOBAL_STATE_USER_PASSWORD, undefined);
    ctx.globalState.update(Constants_1.GLOBAL_STATE_USER_TEAM_ID, undefined);
    ctx.globalState.update(Constants_1.GLOBAL_STATE_USER_TEAM_NAME, undefined);
    ctx.globalState.update(Constants_1.GLOBAL_STATE_USER_IS_TEAM_LEADER, undefined);
    console.log('After clearing persistent storage: ' + extensionContext.globalState);
}
exports.clearCachedUserId = clearCachedUserId;
/**
 * authentication entry point
 * @param ctx
 */
function authenticateUser() {
    return __awaiter(this, void 0, void 0, function* () {
        //get ref to extension context
        let ctx = getExtensionContext();
        const cachedUserId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_ID);
        const cachedUserEmail = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_EMAIL);
        const cachedUserPassword = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_PASSWORD);
        const cachedUserNickName = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_NICKNAME);
        const cachedTeamName = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_NAME);
        const cachedTeamId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_ID);
        console.log('--AUTHENTICATION-- USER ID IS: ' + cachedUserId);
        if (cachedUserId === undefined) {
            // case1: sign in or create new account
            vscode_1.window.showInformationMessage('Cloud9: Welcome to Cloud 9!');
            console.log('No cachedUserId found. Need to sign in or create a new account.');
            registerNewUserOrSigInWithUserInput();
        }
        else {
            // case2: existing user's id found
            console.log('Found cachedUserId: ' + cachedUserId);
            console.log('Found cachedUserEmail: ' + cachedUserEmail);
            console.log('Found cachedUserPassword: ' + cachedUserPassword);
            console.log('Found cachedTeamName: ' + cachedTeamName);
            console.log('Found cachedTeamId: ' + cachedTeamId);
            console.log('Found cachedUserNickname: ' + cachedUserNickName);
            //check if user doc exists in firebase
            let exists = yield Firestore_1.userDocExists(cachedUserId);
            if (exists) {
                console.log('User doc exists in db.');
                vscode_1.window.showInformationMessage('Welcome back, ' + cachedUserNickName + '!!');
            }
            else {
                console.log('Need to log in or register for a new account.');
                registerNewUserOrSigInWithUserInput();
            }
            //.then((result) => {
            //   if (result==true) {
            //     console.log('User doc exists in db');
            //     //true, do nothing
            //     window.showInformationMessage(
            //       'Welcome back, ' + cachedUserNickName + '!!',
            //     );
            //   } else {
            //     //false prompt user to sign in
            //     console.log('Need to login or register for a new account.');
            //     registerNewUserOrSigInWithUserInput();
            //   }
            // });
        }
    });
}
exports.authenticateUser = authenticateUser;
/**
 * prompt the user to enter an email and password and sign in or create a new account for them
 */
function registerNewUserOrSigInWithUserInput() {
    return __awaiter(this, void 0, void 0, function* () {
        const ctx = getExtensionContext();
        let email = null;
        let password = null;
        let completed = false;
        while (!completed) {
            //forcing the user to always sign in
            vscode_1.window.showInformationMessage('Please sign in or create a new account.');
            //prompt for email and password
            yield vscode_1.window
                .showInputBox({ placeHolder: 'Enter your email' })
                .then((inputEmail) => {
                email = inputEmail;
                console.log('user input email: ' + email);
            })
                .then(() => __awaiter(this, void 0, void 0, function* () {
                yield vscode_1.window
                    .showInputBox({
                    placeHolder: 'Enter your password (must be 6 characters long or more)',
                })
                    .then((inputPassword) => {
                    password = inputPassword;
                    console.log('user input password: ' + password);
                });
            }))
                .then(() => __awaiter(this, void 0, void 0, function* () {
                if (email == undefined ||
                    password == undefined ||
                    email == '' ||
                    password == '') {
                    vscode_1.window.showInformationMessage('Invalid email or password! Please try again!');
                }
                else {
                    //first try creating a new user account
                    //if email is already in use, try logging them in with the credential
                    yield Firestore_1.createNewUserInFirebase(email, password).then((result) => __awaiter(this, void 0, void 0, function* () {
                        console.log(result.created);
                        console.log(result.errorCode);
                        if (result.created) {
                            vscode_1.window.showInformationMessage('Successfully created new account, your nickname is ' +
                                ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_NICKNAME));
                        }
                        //email already in use, now log the user in
                        else if (result.errorCode == 'auth/email-already-in-use') {
                            yield Firestore_1.loginUserWithEmailAndPassword(email, password).then((result) => __awaiter(this, void 0, void 0, function* () {
                                console.log(result.loggedIn);
                                console.log(result.errorCode);
                                //successfully logged the user in, return
                                if (result.loggedIn == true) {
                                    completed = true;
                                    vscode_1.window.showInformationMessage('Hello, ' +
                                        ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_NICKNAME) +
                                        '!!');
                                    return;
                                }
                                else if (result.errorCode == 'auth/wrong-password') {
                                    vscode_1.window.showInformationMessage('Wrong password! Please try again!');
                                }
                            }));
                        }
                        else if (result.errorCode == 'auth/weak-password') {
                            vscode_1.window.showInformationMessage('Password must to be 6 characters or longer! Please try again!');
                        }
                    }));
                }
            }));
        }
    });
}
exports.registerNewUserOrSigInWithUserInput = registerNewUserOrSigInWithUserInput;
function passwordRecovery() { }
exports.passwordRecovery = passwordRecovery;
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