const firebase = require("firebase/app");
require("firebase/firestore");
require("firebase/auth");

import { window, ExtensionContext } from "vscode";
import { processMetric } from "./Metric";
import { Leaderboard } from "./Leaderboard";
import {
  firebaseConfig,
  DEFAULT_PASSWORD,
  DEFAULT_USER_DOC,
  DEFAULT_TEAM_DOC,
  COLLECTION_ID_USERS,
  COLLECTION_ID_TEAMS,
  GLOBAL_STATE_USER_ID,
  COLLECTION_ID_TEAM_MEMBERS,
  GLOBAL_STATE_USER_TEAM_NAME
} from "./Constants";
import { getExtensionContext } from "./Authentication";

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();


/**
 * 
 * @param email login user with email and password 
 * @param password 
 */
export async function loginUserWithEmailAndPassword(email, password){
  await auth.signInWithEmailAndPassword(email, password).catch((e) => {
     console.log(e.message);
  });
}

/*
 * Whenever new payload from codetime is posted to their api,
 * we will update our database
 */
export function updateStats(payload) {
  console.log('Firestore.ts, updateStats');

  let metricObj = processMetric(payload);
  console.log(metricObj);

  const ctx: ExtensionContext = getExtensionContext();
  const cachedUserId = ctx.globalState.get(GLOBAL_STATE_USER_ID);

  let id = cachedUserId;
  console.log('cached id is ' + id);
  window.showInformationMessage('Updated Stats!');


  db.collection(COLLECTION_ID_USERS)
    .doc(id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        //Update existing stats

        db.collection(COLLECTION_ID_USERS)
          .doc(id)
          .update({
            keystrokes: firebase.firestore.FieldValue.increment(
              parseInt(metricObj['keystrokes']),
            ),
            linesChanged: firebase.firestore.FieldValue.increment(
              parseInt(metricObj['linesChanged']),
            ),
            timeInterval: firebase.firestore.FieldValue.increment(
              parseInt(metricObj['timeInterval']),
            ),
          })
          .then(() => {
            console.log('Successfully update stats');
          })
          .catch(() => {
            console.log('Error updating stats');
          });
      } else {
        //Update to firebase if no stats found
        db.collection(COLLECTION_ID_USERS)
          .doc(id)
          .set({
            keystrokes: metricObj['keystrokes'],
            linesChanged: metricObj['linesChanged'],
            timeInterval: metricObj['timeInterval'],
          })
          .then(() => {
            console.log('Added new entry');
          })
          .catch(() => {
            console.log('ERRRRR');
          });
      }
    });
}

export async function retrieveAllUserStats(callback) {
  let db = firebase.firestore();

  let users = db.collection(COLLECTION_ID_USERS);

  let userMap = [];

  let content = '';

  let allUser = users
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        Leaderboard.addUser(doc.id, doc.data());
        let currUser = {};
        currUser['id'] = doc.id;
        for (let key in doc.data()) {
          currUser[key] = doc.data()[key];
        }
        userMap.push(currUser);
        // console.log(doc.id + "=>" + doc.data());
      });

      return userMap;
    })
    .then((userMap) => {
      callback(userMap);
    })
    .catch((err) => {
      console.log('Error getting documents', err);
    });
}

/**
 * Create new user credential and add new doc to db
 */

export async function createNewUserInFirebase(ctx: ExtensionContext, email, password) {
  console.log("From Authentication: createNewUser");

  //const email = generateRandomEmail(); // ...do we need this?

  if(email == null){
    console.log("email is null");
    return;
  }
  if(password == null){
    console.log('password is null');
    return;
  }

  await auth
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      // add new uid to persistent storage
      const currentUserId = auth.currentUser.uid;

      ctx.globalState.update(GLOBAL_STATE_USER_ID, currentUserId);
      
      console.log('cachedUserId: ' + ctx.globalState.get(GLOBAL_STATE_USER_ID));

      addNewUserDocToDb(currentUserId);
      return true;
    })
    .catch((e) => {
      console.log(e.message);
      return false;
    });
}

/**
 * Add a new user doc to database
 * @param userId
 */

function addNewUserDocToDb(userId) {
  console.log("Adding doc to db for new user...");

  if (userId === undefined) {
    console.log('userId undefined.');
    return;
  }

  db.collection(COLLECTION_ID_USERS)
    .doc(userId)
    .set(DEFAULT_USER_DOC)
    .then(() => {
      console.log('Added new user: ' + userId + ' doc to db.');
      getUserDocWithId(userId);
    })
    .catch(() => {
      console.log('Error adding new user: ' + userId + ' doc to db.');
    });
}

/**
 * Retrieve the user doc from database
 * @param userId
 */

export async function getUserDocWithId(userId) {
  console.log("Getting user doc from db...");

  var userDoc = await db
    .collection(COLLECTION_ID_USERS)
    .doc(userId)
    .get()
    .then((doc) => {
      console.log('Retrieved user: (' + userId + ') doc from db.');
      console.log(doc.data());
    })
    .catch(() => {
      console.log('Error getting user: (' + userId + ') doc from db.');
    });

    return userDoc;
}


/**
 * creates a new team (if not in db already)
 * @param input the new team's name
 */
export async function addNewTeamToDbAndJoin(teamName) {
  //check if already in database
  //const cachedUserId = getExtensionContext().globalState.get(GLOBAL_STATE_USER_ID);
  
  var teamId = undefined;
  var newTeamDoc = DEFAULT_TEAM_DOC
  newTeamDoc['teamName'] = teamName;

  await db.collection(COLLECTION_ID_TEAMS).doc(teamName).get().then((doc) => {
    if (doc.exists) {
      console.log('Name already in use!');
      console.log(doc.data);
    } else {
      //create this team and add user as a member
      
      // Add a new document with a generated id.
      db.collection(COLLECTION_ID_TEAMS)
        .add(newTeamDoc)
        .then((ref) => {
          teamId = ref.id;
          console.log('Added team document with ID: ', teamId);
          
          //link user with team 
          joinTeam(teamId, teamName);
        });
      //console.log('Successfully created new team!')
    }
  });
}

/**
 * finds the team and adds user as a member
 * @param input name of the team to join
 */
export async function joinTeam(teamId, teamName) {
  console.log('Adding new member to team...');

  const ctx = getExtensionContext();
  const userId = ctx.globalState.get(GLOBAL_STATE_USER_ID);

  await db.collection(COLLECTION_ID_TEAMS)
          .doc(teamId)
          .collection(COLLECTION_ID_TEAM_MEMBERS)
          .doc(userId)
          .set({})
          .then(async () => {
            ctx.globalState.update(GLOBAL_STATE_USER_TEAM_NAME, teamName);
            await db.collection(COLLECTION_ID_USERS)
              .doc(userId)
              .update({teamId: teamId})
              .then(() => {
                console.log('Successfully added user to team.');
              })
            
          })
          .catch((e) => {
            console.log(e.message);
            console.log('Error adding user to team!');
          });
}
