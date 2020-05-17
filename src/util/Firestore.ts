const firebase = require("firebase/app");
require("firebase/firestore");
require("firebase/auth");

import { window, ExtensionContext } from "vscode";
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
  GLOBAL_STATE_USER_TEAM_NAME,
  GLOBAL_STATE_USER_TEAM_ID
} from "./Constants";
import { getExtensionContext } from "./Authentication";

import {processMetric, scoreCalculation} from './Metric';

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
  await auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('signed in');
      })
      .catch((e) => {
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

  let today = new Date().toISOString().split('T')[0];

  db.collection(COLLECTION_ID_USERS)
    .doc(id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        //Update existing stats

        db.collection(COLLECTION_ID_USERS)

          .doc(id)
          .collection('dates')
          .doc(today)
          .get()
          .then((doc2) => {
            if (doc2.exists) {
              //Update existing stats
              db.collection('users')
                .doc(id)
                .collection('dates')
                .doc(today)
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
                  points: firebase.firestore.FieldValue.increment(
                    scoreCalculation(metricObj),
                  ),
                })
                .then(() => {
                  console.log('Successfully update stats');
                })
                .catch(() => {
                  console.log('Error updating stats');
                });
            } else {
              db.collection('users')
                .doc(id)
                .collection('dates')
                .doc(today)
                .set({
                  keystrokes: metricObj['keystrokes'],
                  linesChanged: metricObj['linesChanged'],
                  timeInterval: metricObj['timeInterval'],
                  points: scoreCalculation(metricObj),
                })
                .then(() => {
                  console.log('Added new entry');
                })
                .catch(() => {
                  console.log('ERRRRR');
                });
            }

            db.collection('users')
              .doc(id)
              .update({
                cumulativePoints: firebase.firestore.FieldValue.increment(
                  scoreCalculation(metricObj),
                ),
              });
          });
      } else {
        //Update to firebase if no stats found
        db.collection(COLLECTION_ID_USERS)
          .doc(id)
          .collection('dates')
          .doc(today)
          .set({
            keystrokes: metricObj['keystrokes'],
            linesChanged: metricObj['linesChanged'],
            timeInterval: metricObj['timeInterval'],
            points: scoreCalculation(metricObj),
          })
          .then(() => {
            console.log('Added new entry');
          })
          .catch(() => {
            console.log('ERRRRR');
          });

        db.collection('users')
          .doc(id)
          .update({
            cumulativePoints: firebase.firestore.FieldValue.increment(
              scoreCalculation(metricObj),
            ),
          });
      }
    });
}

export async function retrieveAllUserStats(callback) {
  let db = firebase.firestore();

  let users = db.collection(COLLECTION_ID_USERS);

  let userMap = [];

  users
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

async function addNewUserDocToDb(userId) {
  console.log("Adding doc to db for new user...");

  if (userId === undefined) {
    console.log('userId undefined.');
    return;
  }


  let today = new Date().toISOString().split('T')[0];

  db.collection(COLLECTION_ID_USERS)
    .doc(userId)
    .set({name: 'placeholder', teamCode: '', cumulativePoints: 0})
    .then(() => {
      console.log('Added name');
    })
    .catch(() => {
      console.log('Error creating new entry');
    });

  db.collection(COLLECTION_ID_USERS)
    .doc(userId)
    .collection('dates')
    .doc(today)
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
      console.log('Team already exists!');
    } else {
      //create this team and add user as a member
      
      // Add a new document with a generated id.
      db.collection(COLLECTION_ID_TEAMS)
        .add(newTeamDoc)
        .then((ref) => {
          teamId = ref.id;
          console.log('Added team document with ID: ', teamId);
          
          //link user with team 
        })
        .then(() => {
          joinTeamWithTeamId(teamId);
        });
      //console.log('Successfully created new team!')
    }
  });
}

/**
 * finds the team and adds user as a member
 * @param input name of the team to join
 */
export async function joinTeamWithTeamId(teamId) {
  console.log('Adding new member to team...');

  const ctx = getExtensionContext();
  const userId = ctx.globalState.get(GLOBAL_STATE_USER_ID);

  console.log('userid: ' + userId);

  await db.collection(COLLECTION_ID_TEAMS)
          .doc(teamId)
          .collection(COLLECTION_ID_TEAM_MEMBERS)
          .doc(userId)
          .set({})
          .then(async () => {
            await db.collection(COLLECTION_ID_USERS)
              .doc(userId)
              .update({teamCode: teamId})
              .then(() => {
                //store in context
                //ctx.globalState.update(GLOBAL_STATE_USER_TEAM_NAME, teamName);
                ctx.globalState.update(GLOBAL_STATE_USER_TEAM_ID, teamId);
                console.log('Successfully added user to team.');
                //console.log('cachedTeamName: '+ ctx.globalState.get(GLOBAL_STATE_USER_TEAM_NAME));
                console.log('cachedTeamId: '+ ctx.globalState.get(GLOBAL_STATE_USER_TEAM_ID));
              })
            
          })
          .catch((e) => {
            console.log(e.message);
            console.log('Error adding user to team!');
          });
}
