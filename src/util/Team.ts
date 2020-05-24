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
} from './Firestore';
import {getExtensionContext} from './Authentication';
import {
  GLOBAL_STATE_USER_TEAM_NAME,
  GLOBAL_STATE_USER_TEAM_ID,
} from './Constants';

/**
 * prompts the user to enter a team name and updates the firebase 2
 */
export async function createAndJoinTeam() {
  //first check if already in team
  const inTeam = await checkIfInTeam();

  if (inTeam) {
    window.showInformationMessage('You have already joined a team!');
    return;
  }

  await window
    .showInputBox({placeHolder: 'Enter a new team name'})
    .then(async (teamName) => {
      if (teamName == undefined) {
        window.showInformationMessage('Please enter a valid team name!');
        return;
      }
      addNewTeamToDbAndJoin(teamName);
    });
}

/**
 * DEBUG: REMOVE CACHED TEAM NAME AND ID
 */
export function removeTeamNameAndId() {
  const ctx = getExtensionContext();
  ctx.globalState.update(GLOBAL_STATE_USER_TEAM_ID, undefined);
  ctx.globalState.update(GLOBAL_STATE_USER_TEAM_NAME, undefined);
  console.log(
    'Removed cached Team name and ID, team name: ' +
      ctx.globalState.get(GLOBAL_STATE_USER_TEAM_NAME),
  );
  console.log('team id: ' + ctx.globalState.get(GLOBAL_STATE_USER_TEAM_ID));
}
/**
 * returns the cached team name and id
 */
export async function getTeamNameAndTeamId() {
  const ctx = getExtensionContext();
  if (ctx == undefined) return;

  const teamName = ctx.globalState.get(GLOBAL_STATE_USER_TEAM_NAME);
  const teamId = ctx.globalState.get(GLOBAL_STATE_USER_TEAM_ID);

  if (teamName == undefined && teamId == undefined) {
    window.showInformationMessage('No team info found.');
  } else {
    window.showInformationMessage('Your team id: ' + teamId);
    console.log('Your team name: ' + teamName + '\nYour team id: ' + teamId);
  }

  let inTeam = await checkIfInTeam();
  if (inTeam == true) {
    console.log('Already in a team.');
  } else {
    console.log('Not in team!');
  }
}
/**
 * prompts the user to enter a team code and add them to the team
 */
export async function joinTeam() {
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
      joinTeamWithTeamId(teamCode);
    });
}
