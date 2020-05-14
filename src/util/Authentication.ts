import { window, ExtensionContext } from "vscode";
import { createNewUser } from "./Firestore";

//export let cachedUserId = undefined;
let extensionContext: ExtensionContext = undefined;

/**
 * returns the vscode ExtensionContext
 */
export function getExtensionContext() {
  return extensionContext;
}

/**
 * removes the userId stored in extensionContext
 */
export function clearCachedUserId() {
  extensionContext.globalState.update("cachedUserId", undefined);
  console.log(
    "After clearing cached id: " +
      extensionContext.globalState.get("cachedUserId")
  );
}

/**
 *
 * @param ctx
 */
export function authenticateUser(ctx: ExtensionContext) {
  //stores the extension context
  extensionContext = ctx;
  let cachedUserId = ctx.globalState.get("cachedUserId");

  if (cachedUserId === undefined) {
    // case1: new user, create an account for them
    window.showInformationMessage("Cloud9: Welcome new user!");
    console.log("No cachedUserId found.");
    createNewUser(ctx);
  } else {
    // case2: existing user
    // do we need to actually sign the user in again??
    window.showInformationMessage("Cloud9: Welcome back!");
    console.log("Found cachedUserId: " + cachedUserId);
  }
}
