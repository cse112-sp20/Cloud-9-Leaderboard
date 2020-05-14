import { window } from "vscode";
import { addNewTeamToDb } from "./Firestore";

export async function createAndJoinTeam() {
  const newTeamName = await window
    .showInputBox({ placeHolder: "Enter a new team name" })
    .then((input) => {
      if (input === undefined) return;
      // //check if already in database
      // var teamDoc = db.collection('teams').doc(input);
      // teamDoc.get().then((doc) =>{
      // 	if(doc.exists){
      // 		console.log("Name already in use!");
      // 	}else{
      // 		db.collection('teams').set(input)
      // 	}
      // });
      addNewTeamToDb(input);
    });
}
