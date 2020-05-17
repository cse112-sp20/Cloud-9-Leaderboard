"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = exports.clearCachedUserId = exports.getExtensionContext = void 0;
const vscode_1 = require("vscode");
const Firestore_1 = require("./Firestore");
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
 * removes the userId stored in extensionContext
 */
function clearCachedUserId() {
    extensionContext.globalState.update("cachedUserId", undefined);
    console.log("After clearing cached id: " +
        extensionContext.globalState.get("cachedUserId"));
}
exports.clearCachedUserId = clearCachedUserId;
/**
 *
 * @param ctx
 */
function authenticateUser(ctx) {
    //stores the extension context
    extensionContext = ctx;
    let cachedUserId = ctx.globalState.get("cachedUserId");
    if (cachedUserId === undefined) {
        // case1: new user, create an account for them
        vscode_1.window.showInformationMessage("Cloud9: Welcome new user!");
        console.log("No cachedUserId found.");
        Firestore_1.createNewUser(ctx);
    }
    else {
        // case2: existing user
        // do we need to actually sign the user in again??
        vscode_1.window.showInformationMessage("Cloud9: Welcome back!");
        console.log("Found cachedUserId: " + cachedUserId);
    }
}
exports.authenticateUser = authenticateUser;
//# sourceMappingURL=Authentication.js.map