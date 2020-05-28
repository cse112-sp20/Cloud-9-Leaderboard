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
  retrieveUserDailyMetric,
  userDocExists,
} from './Firestore';
import {generateRandomEmail} from './Utility';
import {
  DEFAULT_PASSWORD,
  GLOBAL_STATE_USER_ID,
  GLOBAL_STATE_USER_EMAIL,
  GLOBAL_STATE_USER_PASSWORD,
  GLOBAL_STATE_USER_TEAM_ID,
  GLOBAL_STATE_USER_TEAM_NAME,
  GLOBAL_STATE_USER_IS_TEAM_LEADER,
  GLOBAL_STATE_USER_NICKNAME,
} from './Constants';
import {getMaxListeners} from 'cluster';

import {testCallback} from './DailyMetricDataProvider';

//export let cachedUserId = undefined;
let extensionContext: ExtensionContext = undefined;

/**
 * stores the extension context
 * @param ctx vscode extension context
 */
export function storeExtensionContext(ctx) {
  extensionContext = ctx;
}

/**
 * returns the vscode ExtensionContext
 */
export function getExtensionContext() {
  return extensionContext;
}

/**
 * *****for debugging purpose only******
 * removes extensionContext data
 */
export function clearCachedUserId() {
  let ctx = getExtensionContext();
  ctx.globalState.update(GLOBAL_STATE_USER_ID, undefined);
  ctx.globalState.update(GLOBAL_STATE_USER_EMAIL, undefined);
  ctx.globalState.update(GLOBAL_STATE_USER_PASSWORD, undefined);
  ctx.globalState.update(GLOBAL_STATE_USER_TEAM_ID, undefined);
  ctx.globalState.update(GLOBAL_STATE_USER_TEAM_NAME, undefined);
  ctx.globalState.update(GLOBAL_STATE_USER_IS_TEAM_LEADER, undefined);

  console.log(
    'After clearing persistent storage: ' + extensionContext.globalState,
  );
}

/**
 * authentication entry point
 * @param ctx
 */
export async function authenticateUser(ctx: ExtensionContext) {
  //stores the extension context
  extensionContext = ctx;
  const cachedUserId = ctx.globalState.get(GLOBAL_STATE_USER_ID);
  const cachedUserEmail = ctx.globalState.get(GLOBAL_STATE_USER_EMAIL);
  const cachedUserPassword = ctx.globalState.get(GLOBAL_STATE_USER_PASSWORD);
  const cachedUserNickName = ctx.globalState.get(GLOBAL_STATE_USER_NICKNAME);

  const cachedTeamName = ctx.globalState.get(GLOBAL_STATE_USER_TEAM_NAME);
  const cachedTeamId = ctx.globalState.get(GLOBAL_STATE_USER_TEAM_ID);

  console.log('--AUTHENTICATION-- USER ID IS: ' + cachedUserId);

  if (cachedUserId === undefined) {
    // case1: sign in or create new account
    window.showInformationMessage('Cloud9: Welcome to Cloud 9!');
    console.log(
      'No cachedUserId found. Need to sign in or create a new account.',
    );

    registerNewUserOrSigInWithUserInput();
  } else {
    // case2: existing user's id found
    console.log('Found cachedUserId: ' + cachedUserId);
    console.log('Found cachedUserEmail: ' + cachedUserEmail);
    console.log('Found cachedUserPassword: ' + cachedUserPassword);
    console.log('Found cachedTeamName: ' + cachedTeamName);
    console.log('Found cachedTeamId: ' + cachedTeamId);
    console.log('Found cachedUserNickname: ' + cachedUserNickName);

    //check if user doc exists in firebase
    let exists = await userDocExists(cachedUserId);
    if (exists) {
      console.log('User doc exists in db.');
      window.showInformationMessage(
        'Welcome back, ' + cachedUserNickName + '!!',
      );
    } else {
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

  await retrieveUserDailyMetric(testCallback, ctx);
}

/**
 * prompt the user to enter an email and password and sign in or create a new account for them
 */
export async function registerNewUserOrSigInWithUserInput() {
  const ctx = getExtensionContext();
  let email = null;
  let password = null;
  let completed = false;

  while (!completed) {
    //forcing the user to always sign in
    window.showInformationMessage('Please sign in or create a new account.');
    //prompt for email and password
    await window
      .showInputBox({placeHolder: 'Enter your email'})
      .then((inputEmail) => {
        email = inputEmail;
        console.log('user input email: ' + email);
      })
      .then(async () => {
        await window
          .showInputBox({
            placeHolder:
              'Enter your password (must be 6 characters long or more)',
          })
          .then((inputPassword) => {
            password = inputPassword;
            console.log('user input password: ' + password);
          });
      })
      .then(async () => {
        if (
          email == undefined ||
          password == undefined ||
          email == '' ||
          password == ''
        ) {
          window.showInformationMessage(
            'Invalid email or password! Please try again!',
          );
        } else {
          //first try creating a new user account
          //if email is already in use, try logging them in with the credential
          await createNewUserInFirebase(email, password).then(
            async (result) => {
              console.log(result.created);
              console.log(result.errorCode);
              if (result.created) {
                window.showInformationMessage(
                  'Successfully created new account, your nickname is ' +
                    ctx.globalState.get(GLOBAL_STATE_USER_NICKNAME),
                );
              }
              //email already in use, now log the user in
              else if (result.errorCode == 'auth/email-already-in-use') {
                await loginUserWithEmailAndPassword(email, password).then(
                  async (result) => {
                    console.log(result.loggedIn);
                    console.log(result.errorCode);

                    //successfully logged the user in, return
                    if (result.loggedIn == true) {
                      completed = true;
                      window.showInformationMessage(
                        'Hello, ' +
                          ctx.globalState.get(GLOBAL_STATE_USER_NICKNAME) +
                          '!!',
                      );
                      return;
                    } else if (result.errorCode == 'auth/wrong-password') {
                      window.showInformationMessage(
                        'Wrong password! Please try again!',
                      );
                    }
                  },
                );
              } else if (result.errorCode == 'auth/weak-password') {
                window.showInformationMessage(
                  'Password must to be 6 characters or longer! Please try again!',
                );
              }
            },
          );
        }
      });
  }
}

export function passwordRecovery() {}

/**
 * not using this function
 */
export async function registerNewUserWithGeneratedCredential() {
  const email = generateRandomEmail();

  await createNewUserInFirebase(email, DEFAULT_PASSWORD);
}
