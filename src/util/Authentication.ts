/**
 * Summary. (use period)
 *
 * Description. (use period)
 *
 * @file   This files defines the MyClass class.
 * @author AuthorName.
 * @since  x.x.x
 */

import {window, ExtensionContext} from 'vscode';
import {
  createNewUserInFirebase,
  loginUserWithEmailAndPassword,
} from './Firestore';
import {generateRandomEmail} from './Utility';
import {
  DEFAULT_PASSWORD,
  GLOBAL_STATE_USER_ID,
  GLOBAL_STATE_USER_EMAIL,
  GLOBAL_STATE_USER_PASSWORD,
  GLOBAL_STATE_USER_TEAM_ID,
  GLOBAL_STATE_USER_TEAM_NAME,
} from './Constants';

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
  extensionContext.globalState.update(GLOBAL_STATE_USER_ID, undefined);
  console.log(
    'After clearing cached id: ' +
      extensionContext.globalState.get(GLOBAL_STATE_USER_ID),
  );
}

/**
 * authentication entry point
 * @param ctx
 */
export function authenticateUser(ctx: ExtensionContext) {
  //stores the extension context
  extensionContext = ctx;
  const cachedUserId = ctx.globalState.get(GLOBAL_STATE_USER_ID);
  const cachedUserEmail = ctx.globalState.get(GLOBAL_STATE_USER_EMAIL);
  const cachedUserPassword = ctx.globalState.get(GLOBAL_STATE_USER_PASSWORD);

  const cachedTeamName = ctx.globalState.get(GLOBAL_STATE_USER_TEAM_NAME);
  const cachedTeamId = ctx.globalState.get(GLOBAL_STATE_USER_TEAM_ID);

  console.log('AUTHENTICATION USERID IS: ' + cachedUserId);
  if (cachedUserId === undefined) {
    // case1: new user, create an account for them
    window.showInformationMessage('Cloud9: Welcome new user!');
    console.log('No cachedUserId found. Need to create a new user account.');
    //registerNewUserWithUserInput(ctx);
    registerNewUserWithGeneratedCredential(ctx);
  } else {
    // case2: existing user
    // do we need to actually sign the user in again??
    window.showInformationMessage('Cloud9: Welcome back!');
    console.log('Found cachedUserId: ' + cachedUserId);
    console.log('Found cachedTeamName: ' + cachedTeamName);
    console.log('Found cachedTeamId: ' + cachedTeamId);

    //loginUserWithEmailAndPassword(cachedUserEmail, cachedUserPassword);
  }
}

/**
 * prompts the user to enter an email and password and creates a new account for them
 * @param ctx
 */
export async function registerNewUserWithUserInput(ctx: ExtensionContext) {
  let email = null;
  let password = null;
  //prompt for email and password
  await window
    .showInputBox({placeHolder: 'Enter your email'})
    .then((inputEmail) => {
      email = inputEmail;
      console.log('user input email: ' + email);
    })
    .then(async () => {
      await window
        .showInputBox({placeHolder: 'Enter your password'})
        .then((inputPassword) => {
          password = inputPassword;
          console.log('user input password: ' + password);
        });
    })
    .then(async () => {
      await createNewUserInFirebase(ctx, email, password);
    });
}

export async function registerNewUserWithGeneratedCredential(
  ctx: ExtensionContext,
) {
  const email = generateRandomEmail();

  await createNewUserInFirebase(ctx, email, DEFAULT_PASSWORD);
}
