/**
 * Summary. (use period)
 *
 * Description. (use period)
 *
 * @link   URL
 * @file   This files defines the MyClass class.
 * @author AuthorName.
 * @since  x.x.x
 */

import {window} from 'vscode';
import {
  addNewTeamToDbAndJoin,
  joinTeamWithTeamId,
  checkIfInTeam,
  leaveTeam,
} from './Firestore';
import {
  getExtensionContext,
  checkIfCachedUserIdExistsAndPrompt,
} from './Authentication';
import {
  GLOBAL_STATE_USER_TEAM_NAME,
  GLOBAL_STATE_USER_TEAM_ID,
  GLOBAL_STATE_USER_IS_TEAM_LEADER,
  GLOBAL_STATE_USER_ID,
  AUTH_NOT_LOGGED_IN,
} from './Constants';
import {testCallback} from './DailyMetricDataProvider';

/**
 * prompts the user to enter a team name and updates the firebase 2
 * @pre-condition: userid exists
 */
export async function createAndJoinTeam() {
  //ID check
  await checkIfCachedUserIdExistsAndPrompt().then((loggedIn) => {
    if (!loggedIn) {
      window.showErrorMessage(AUTH_NOT_LOGGED_IN);
      return;
    }
  });

  //first check if already in team
  const inTeam = await checkIfInTeam();

  if (inTeam) {
    window.showInformationMessage('You have already joined a team!');
    return;
  }

  window.showInformationMessage('Enter a name for your new team!');

  await window
    .showInputBox({placeHolder: 'Enter a new team name'})
    .then(async (teamName) => {
      if (teamName == undefined || teamName == '') {
        window.showInformationMessage('Please enter a valid team name!');
        return;
      }
      addNewTeamToDbAndJoin(teamName);
    });
}

/**
 * DEBUG: REMOVE CACHED TEAM NAME AND ID
 * leave the team
 */
export async function removeTeamNameAndId() {
  // const ctx = getExtensionContext();
  // const teamId = ctx.globalState.get(GLOBAL_STATE_USER_TEAM_ID);
  // const userId = ctx.globalState.get(GLOBAL_STATE_USER_ID);
  // console.log('team id: ' + teamId);
  // console.log('user id: ' + userId);
  // if (teamId == undefined) {
  //   window.showInformationMessage('Not in a team!');
  //   return;
  // }
}

/**
 * returns user's team name and ID
 * values retrieved from persistent storage
 */
export async function getTeamInfo() {
  await checkIfCachedUserIdExistsAndPrompt().then((loggedIn) => {
    if (!loggedIn) {
      return;
    }
  });
  const ctx = getExtensionContext();

  const teamName = ctx.globalState.get(GLOBAL_STATE_USER_TEAM_NAME);
  const teamId = ctx.globalState.get(GLOBAL_STATE_USER_TEAM_ID);

  if (teamId == undefined || teamId == '') {
    window.showInformationMessage('No team info found.');
    return;
  }

  let messageStr = 'Your team name: ' + teamName + '\n';

  messageStr += 'Your team ID: ' + teamId;

  console.log(messageStr);
  window.showInformationMessage(messageStr, {modal: true});
  return messageStr;
}
/**
 * prompts the user to enter a team code and add them to the team
 */
export async function joinTeam() {
  //ID check
  await checkIfCachedUserIdExistsAndPrompt().then((loggedIn) => {
    if (!loggedIn) {
      window.showErrorMessage(AUTH_NOT_LOGGED_IN);
      return;
    }
  });
  //first check if user is already in a team
  const inTeam = await checkIfInTeam();
  if (inTeam) {
    window.showInformationMessage('You have already joined a team!');
    return;
  }

  await window
    .showInputBox({placeHolder: 'Enter a team code'})
    .then(async (teamCode) => {
      if (teamCode == undefined) {
        window.showInformationMessage('Please enter a valid team name!');
        return;
      }
      joinTeamWithTeamId(teamCode, false);
    });
}
