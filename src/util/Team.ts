import { window, ExtensionContext } from "vscode";
import { addNewTeamToDbAndJoin } from "./Firestore";
import { getExtensionContext } from './Authentication';
import {
  firebaseConfig,
  DEFAULT_PASSWORD,
  DEFAULT_USER_DOC,
  DEFAULT_TEAM_DOC,
  COLLECTION_ID_USERS,
  COLLECTION_ID_TEAMS,
  GLOBAL_STATE_USER_ID,
  GLOBAL_STATE_USER_TEAM_NAME,
  GLOBAL_STATE_USER_TEAM_ID,
  COLLECTION_ID_TEAM_MEMBERS
} from "./Constants";
/**
 * prompts the user to enter a team name and updates the firebase 2
 */
export async function createAndJoinTeam() {
  const newTeamName = await window
    .showInputBox({ placeHolder: "Enter a new team name" })
    .then(async (teamName) => {
      if (teamName == undefined) {
        window.showInformationMessage('Please enter a valid team name!');
        return;
      }
      addNewTeamToDbAndJoin(teamName);
    });
}

/**
 * returns the cached team name and id 
 */
export function getTeamNameAndTeamId(){
  const ctx = getExtensionContext();
  if(ctx == undefined) return;

  const teamName = ctx.globalState.get(GLOBAL_STATE_USER_TEAM_NAME);
  const teamId = ctx.globalState.get(GLOBAL_STATE_USER_TEAM_ID);

  if(teamName == undefined || teamId == undefined){
    window.showInformationMessage('No team info found.');
  }else{
    window.showInformationMessage('Your team name: ' + teamName + '\nYour team id: ' + teamId);
  }
  
}


