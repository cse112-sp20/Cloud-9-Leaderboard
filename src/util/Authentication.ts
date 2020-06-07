/**
 * This file contains functions for authenticating users:
 * log in, sign up, and log out.
 *
 * @file   Authentication.ts
 * @author Tina Hsieh
 */

import {window, commands, ExtensionContext} from "vscode";
import {
  createNewUserInFirebase,
  loginUserWithEmailAndPassword,
  retrieveUserDailyMetric,
  userDocExists,
  updatePersistentStorageWithUserDocData,
} from "./Firestore";
import {
  GLOBAL_STATE_USER_ID,
  GLOBAL_STATE_USER_TEAM_ID,
  GLOBAL_STATE_USER_TEAM_NAME,
  GLOBAL_STATE_USER_IS_TEAM_LEADER,
  GLOBAL_STATE_USER_NICKNAME,
  AUTH_ERR_CODE_EMAIL_USED,
  AUTH_ERR_CODE_WEAK_PASSWORD,
  AUTH_ERR_CODE_WRONG_PASSWORD,
  AUTH_SIGN_IN,
  AUTH_CREATE_ACCOUNT,
  AUTH_ERR_CODE_USER_NOT_FOUND,
  AUTH_ERR_CODE_INVALID_EMAIL,
  GLOBAL_STATE_USER_TEAM_MEMBERS,
} from "./Constants";
import {constructDailyMetricData} from "./DailyMetricDataProvider";

let extensionContext: ExtensionContext = undefined;

/**
 * stores the extension context
 * @param ctx vscode extension context
 */
export function storeExtensionContext(ctx) {
  console.log("storing extension context");
  extensionContext = ctx;
}

/**
 * returns the vscode ExtensionContext
 */
export function getExtensionContext() {
  return extensionContext;
}

/**
 * Log the user out
 */
export function logOut() {
  //reset all fields in extension context's global state
  let ctx = getExtensionContext();
  ctx.globalState.update(GLOBAL_STATE_USER_ID, undefined);
  ctx.globalState.update(GLOBAL_STATE_USER_TEAM_ID, undefined);
  ctx.globalState.update(GLOBAL_STATE_USER_TEAM_NAME, undefined);
  ctx.globalState.update(GLOBAL_STATE_USER_IS_TEAM_LEADER, false);
  ctx.globalState.update(GLOBAL_STATE_USER_NICKNAME, undefined);
  ctx.globalState.update(GLOBAL_STATE_USER_TEAM_MEMBERS, undefined);

  console.log("Logging out: " + extensionContext.globalState);
  window.showInformationMessage("Goodbye!");

  //reload treeview content to reflect the logout event
  commands.executeCommand("MenuView.refreshEntry");
  commands.executeCommand("LeaderView.refreshEntry");

  commands.executeCommand("DailyMetric.refreshEntry");

  commands.executeCommand("TeamMenuView.refreshEntry");
}

/**
 * Authentication entry point
 * @param ctx
 */
export async function authenticateUser() {
  const ctx = getExtensionContext();
  const cachedUserId = ctx.globalState.get(GLOBAL_STATE_USER_ID);
  const cachedUserNickName = ctx.globalState.get(GLOBAL_STATE_USER_NICKNAME);

  const cachedTeamName = ctx.globalState.get(GLOBAL_STATE_USER_TEAM_NAME);
  const cachedTeamId = ctx.globalState.get(GLOBAL_STATE_USER_TEAM_ID);

  const isTeamLeader = ctx.globalState.get(GLOBAL_STATE_USER_IS_TEAM_LEADER);

  if (cachedUserId === undefined) {
    // case1: sign in or create new account
    window.showInformationMessage("Cloud9: Welcome to Cloud 9!");

    signInOrSignUpUserWithUserInput().then(() => {
      retrieveUserDailyMetric(constructDailyMetricData, ctx);
    });
  } else {
    // case2: existing user's id found
    console.log("Found cachedUserId: " + cachedUserId);
    console.log("Found cachedTeamName: " + cachedTeamName);
    console.log("Found cachedTeamId: " + cachedTeamId);
    console.log("Found cachedUserNickname: " + cachedUserNickName);

    //check if user doc exists in firebase
    let exists = await userDocExists(cachedUserId);
    if (exists) {
      console.log("user doc exists");
      updatePersistentStorageWithUserDocData(cachedUserId).then(() => {
        retrieveUserDailyMetric(constructDailyMetricData, ctx);
      });
      window.showInformationMessage(
        "Welcome back, " + cachedUserNickName + "!!",
      );
      console.log("is team leader " + isTeamLeader);
      commands.executeCommand("MenuView.refreshEntry");
      // commands.executeCommand('LeaderView.refreshEntry');
      commands.executeCommand("TeamMenuView.refreshEntry");
    } else {
      // user doc does not exist, prompt user to sign in or sign up
      signInOrSignUpUserWithUserInput().then(() => {
        retrieveUserDailyMetric(constructDailyMetricData, ctx);
      });
    }
  }
}

/**
 * Prompts the user to sign in or sign up with input email and password
 */
export async function signInOrSignUpUserWithUserInput() {
  const ctx = getExtensionContext();
  let email = undefined;
  let password = undefined;

  //prompt the user to sign in or create an account
  window
    .showInformationMessage(
      "Please sign in or create a new account!",
      AUTH_SIGN_IN,
      AUTH_CREATE_ACCOUNT,
    )
    .then(async (selection) => {
      if (selection == undefined) {
        return;
      }
      // prompt for user input
      await window
        .showInputBox({placeHolder: "Enter your email: example@gmail.com"})
        .then((inputEmail) => {
          email = inputEmail;
        })
        .then(async () => {
          await window
            .showInputBox({
              placeHolder:
                "Enter your password (must be 6 characters long or more)",
              password: true, //hiding user's input password
            })
            .then((inputPassword) => {
              password = inputPassword;
            });
        })
        .then(async () => {
          if (
            email == undefined ||
            password == undefined ||
            email == "" ||
            password == ""
          ) {
            window.showErrorMessage("Invalid email or password!");
          } else {
            if (selection == AUTH_SIGN_IN) {
              //user chose to sign in to an existing account
              await loginUserWithEmailAndPassword(email, password).then(
                async (result) => {
                  console.log(result.loggedIn);
                  console.log(result.errorCode);
                  if (result.loggedIn) {
                    // successfully logged the user in
                    window.showInformationMessage(
                      "Welcome back, " +
                        ctx.globalState.get(GLOBAL_STATE_USER_NICKNAME) +
                        "!!",
                    );
                    // reload the treeview content
                    commands.executeCommand("MenuView.refreshEntry");
                    commands.executeCommand("TeamMenuView.refreshEntry");
                    commands.executeCommand("DailyMetric.refreshEntry");
                    return;
                  }
                  // failed to log the user in, print out error message
                  if (result.errorCode == AUTH_ERR_CODE_WRONG_PASSWORD) {
                    window.showErrorMessage("Wrong password!");
                  } else if (result.errorCode == AUTH_ERR_CODE_USER_NOT_FOUND) {
                    window.showErrorMessage("User not found!");
                  } else if (result.errorCode == AUTH_ERR_CODE_INVALID_EMAIL) {
                    window.showErrorMessage("Invalid email!");
                  }
                },
              );
              //reload treeview content
              commands.executeCommand("MenuView.refreshEntry");
              commands.executeCommand("TeamMenuView.refreshEntry");
              commands.executeCommand("DailyMetric.refreshEntry");
            } else if (selection == AUTH_CREATE_ACCOUNT) {
              //user chose to create a new account
              await createNewUserInFirebase(email, password).then(
                async (result) => {
                  console.log(result.created);
                  console.log(result.errorCode);
                  if (result.created) {
                    // successfully created a new account for user
                    // welcome them with generated name
                    window.showInformationMessage(
                      "Welcome! Your nickname is: " +
                        ctx.globalState.get(GLOBAL_STATE_USER_NICKNAME) +
                        "!!",
                    );
                    //reload treeview content
                    commands.executeCommand("MenuView.refreshEntry");
                    commands.executeCommand("TeamMenuView.refreshEntry");
                    return;
                  }
                  // failed to create a new account for user, print the error message
                  if (result.errorCode == AUTH_ERR_CODE_EMAIL_USED) {
                    window.showErrorMessage("Email already in use!");
                  } else if (result.errorCode == AUTH_ERR_CODE_WEAK_PASSWORD) {
                    window.showErrorMessage(
                      "Password is too weak! Needs to be 6 characters long or more!",
                    );
                  } else if (result.errorCode == AUTH_ERR_CODE_INVALID_EMAIL) {
                    window.showErrorMessage("Invalid email!");
                  } else {
                    window.showErrorMessage(result.errorCode);
                  }
                },
              );
            }
          }
        });
    });
}

/**
 * if user id is not found in persistent storage, prompt the user to sign in or sign up
 * return whether the id is found (after the prompt)
 */
export async function checkIfCachedUserIdExistsAndPrompt() {
  const ctx = getExtensionContext();
  let cachedUserId = ctx.globalState.get(GLOBAL_STATE_USER_ID);
  let loggedIn = false;
  if (cachedUserId != undefined) {
    loggedIn = true;
  } else {
    // no cached user ID in persistent storage, prompt the user to sign in or sign up
    await signInOrSignUpUserWithUserInput().then(async () => {
      cachedUserId = ctx.globalState.get(GLOBAL_STATE_USER_ID);
      if (cachedUserId != undefined) {
        loggedIn = true;
        await retrieveUserDailyMetric(constructDailyMetricData, ctx);
      }
    });
  }
  return loggedIn;
}
