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
exports.registerNewUserWithGeneratedCredential = exports.registerNewUserWithUserInput = exports.authenticateUser = exports.clearCachedUserId = exports.getExtensionContext = void 0;
const vscode_1 = require("vscode");
const Firestore_1 = require("./Firestore");
const Utility_1 = require("./Utility");
const Constants_1 = require("./Constants");
//export let cachedUserId = undefined;
let extensionContext = undefined;
/**
 * returns the vscode ExtensionContext
 */
function getExtensionContext() {
    return extensionContext;
}
exports.getExtensionContext = getExtensionContext;
/**
 * *****for debugging purpose only******
 * removes the userId stored in extensionContext
 */
function clearCachedUserId() {
    extensionContext.globalState.update(Constants_1.GLOBAL_STATE_USER_ID, undefined);
    console.log('After clearing cached id: ' +
        extensionContext.globalState.get(Constants_1.GLOBAL_STATE_USER_ID));
}
exports.clearCachedUserId = clearCachedUserId;
/**
 * authentication entry point
 * @param ctx
 */
function authenticateUser(ctx) {
    //stores the extension context
    extensionContext = ctx;
    const cachedUserId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_ID);
    const cachedUserEmail = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_EMAIL);
    const cachedUserPassword = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_PASSWORD);
    const cachedTeamName = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_NAME);
    const cachedTeamId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_ID);
    console.log('AUTHENTICATION USERID IS: ' + cachedUserId);
    if (cachedUserId === undefined) {
        // case1: new user, create an account for them
        vscode_1.window.showInformationMessage('Cloud9: Welcome new user!');
        console.log('No cachedUserId found. Need to create a new user account.');
        //registerNewUserWithUserInput(ctx);
        registerNewUserWithGeneratedCredential(ctx);
        /**
         * post-mvp:
         * alow user to sign in to existing account when switching device
         */
    }
    else {
        // case2: existing user
        // do we need to actually sign the user in again??
        vscode_1.window.showInformationMessage('Cloud9: Welcome back!');
        console.log('Found cachedUserId: ' + cachedUserId);
        console.log('Found cachedTeamName: ' + cachedTeamName);
        console.log('Found cachedTeamId: ' + cachedTeamId);
        //loginUserWithEmailAndPassword(cachedUserEmail, cachedUserPassword);
    }
}
exports.authenticateUser = authenticateUser;
/**
 * prompts the user to enter an email and password and creates a new account for them
 * @param ctx
 */
function registerNewUserWithUserInput(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        let email = null;
        let password = null;
        //prompt for email and password
        yield vscode_1.window
            .showInputBox({ placeHolder: 'Enter your email' })
            .then((inputEmail) => {
            email = inputEmail;
            console.log('user input email: ' + email);
        })
            .then(() => __awaiter(this, void 0, void 0, function* () {
            yield vscode_1.window
                .showInputBox({ placeHolder: 'Enter your password' })
                .then((inputPassword) => {
                password = inputPassword;
                console.log('user input password: ' + password);
            });
        }))
            .then(() => __awaiter(this, void 0, void 0, function* () {
            yield Firestore_1.createNewUserInFirebase(ctx, email, password);
        }));
    });
}
exports.registerNewUserWithUserInput = registerNewUserWithUserInput;
function registerNewUserWithGeneratedCredential(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        const email = Utility_1.generateRandomEmail();
        yield Firestore_1.createNewUserInFirebase(ctx, email, Constants_1.DEFAULT_PASSWORD);
    });
}
exports.registerNewUserWithGeneratedCredential = registerNewUserWithGeneratedCredential;
//# sourceMappingURL=Authentication.js.map