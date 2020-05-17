import { window, ExtensionContext } from "vscode";
import { createNewUserInFirebase } from "./Firestore";
import { generateRandomEmail } from './Utility';
import { DEFAULT_PASSWORD } from "./Constants";

//export let cachedUserId = undefined;
let extensionContext: ExtensionContext = undefined;

/**
 * returns the vscode ExtensionContext
 */
export function getExtensionContext() {
  return extensionContext;
}

/**
 * *****for debugging purpose only******
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
 * authentication entry point 
 * @param ctx
 */
export function authenticateUser(ctx: ExtensionContext) {
  //stores the extension context
  extensionContext = ctx;
  let cachedUserId = ctx.globalState.get("cachedUserId");

  if (cachedUserId === undefined) {
    // case1: new user, create an account for them
    window.showInformationMessage("Cloud9: Welcome new user!");
    console.log("No cachedUserId found. Need to create a new user account.");
    //registerNewUserWithUserInput(ctx); 
    registerNewUserWithGeneratedCredential(ctx);
  } else {
    // case2: existing user
    // do we need to actually sign the user in again??
    window.showInformationMessage("Cloud9: Welcome back!");
    console.log("Found cachedUserId: " + cachedUserId);
  }
}

/**
 * prompts the user to enter an email and password and creates a new account for them
 * @param ctx 
 */
export async function registerNewUserWithUserInput(ctx: ExtensionContext){
  let email = null;
  let password = null;
  //prompt for email and password 
  await window.showInputBox({placeHolder: 'Enter your email'})
        .then( (inputEmail) => {
          email = inputEmail;
          console.log('user input email: ' +email);
        })
        .then( async () => {
          await window.showInputBox({placeHolder: 'Enter your password'})
          .then( (inputPassword) => {
            password = inputPassword
            console.log('user input password: '+password);
          })
        })
        .then( async () => {
          await createNewUserInFirebase(ctx, email, password);
        });
}

export async function registerNewUserWithGeneratedCredential(ctx: ExtensionContext){
  const email = generateRandomEmail();

  await createNewUserInFirebase(ctx, email, DEFAULT_PASSWORD);
}
