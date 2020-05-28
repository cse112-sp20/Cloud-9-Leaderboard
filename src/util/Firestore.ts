const firebase = require('firebase/app');
require('firebase/firestore');
require('firebase/auth');
//const admin = require("firebase-admin");

import {window} from 'vscode';
import {Leaderboard} from './Leaderboard';
import {PersonalStats} from './PersonalStats';
import {
  firebaseConfig,
  DEFAULT_USER_DOC,
  DEFAULT_USER_DOC_TOP,
  DEFAULT_TEAM_DOC,
  COLLECTION_ID_USERS,
  COLLECTION_ID_TEAMS,
  GLOBAL_STATE_USER_ID,
  COLLECTION_ID_TEAM_MEMBERS,
  GLOBAL_STATE_USER_TEAM_ID,
  GLOBAL_STATE_USER_TEAM_NAME,
  GLOBAL_STATE_USER_IS_TEAM_LEADER,
  GLOBAL_STATE_USER_NICKNAME,
  FIELD_ID_TEAM_LEAD_USER_ID,
  GLOBAL_STATE_USER_EMAIL,
} from './Constants';
import {getExtensionContext} from './Authentication';
import {processMetric, scoreCalculation} from './Metric';
import {generateRandomName} from './Utility';

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
export async function loginUserWithEmailAndPassword(email, password) {
  let loggedIn = false;
  let errorCode = undefined;
  await auth
    .signInWithEmailAndPassword(email, password)
    .then((userCred) => {
      updatePersistentStorageWithUserDocData(userCred.user.uid);
      console.log('logging user in: ' + userCred.user.uid);

      loggedIn = true;
      errorCode = 'no error';
    })
    .catch((e) => {
      console.log(e.message);
      console.log(e.code);

      loggedIn = false;
      errorCode = e.code;
    });
  return {loggedIn: loggedIn, errorCode: errorCode};
}

/**
 * update persistent storage after signing in (or after creating new user doc)
 * @param userId
 */
export async function updatePersistentStorageWithUserDocData(userId) {
  console.log('Updating persistent storage...');
  let ctx = getExtensionContext();
  await db
    .collection(COLLECTION_ID_USERS)
    .doc(userId)
    .get()
    .then((userDoc) => {
      if (userDoc.exists) {
        let userData = userDoc.data();
        console.log(userData.name);
        ctx.globalState.update(GLOBAL_STATE_USER_ID, userId);
        ctx.globalState.update(GLOBAL_STATE_USER_NICKNAME, userData.name);
        ctx.globalState.update(GLOBAL_STATE_USER_TEAM_ID, userData.teamCode);
        ctx.globalState.update(GLOBAL_STATE_USER_TEAM_NAME, userData.teamName);
        ctx.globalState.update(GLOBAL_STATE_USER_EMAIL, userData.email);
        console.log(ctx.globalState);
      }
    })
    .catch(() => {
      console.log('Error updating persistent storage');
    });
}

/*
 * Whenever new payload from codetime is posted to their api,
 * we will update our database
 */
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

export function updateStats(payload) {
  console.log('Firestore.ts, updateStats');

  let metricObj = processMetric(payload);
  console.log(metricObj);

  const ctx = getExtensionContext();
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
              db.collection(COLLECTION_ID_USERS)
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
            }

            db.collection(COLLECTION_ID_USERS)
              .doc(id)
              .update({
                cumulativePoints: firebase.firestore.FieldValue.increment(
                  scoreCalculation(metricObj),
                ),
                keystrokes: firebase.firestore.FieldValue.increment(
                  parseInt(metricObj['keystrokes']),
                ),
                linesChanged: firebase.firestore.FieldValue.increment(
                  parseInt(metricObj['linesChanged']),
                ),
                timeInterval: firebase.firestore.FieldValue.increment(
                  parseInt(metricObj['timeInterval']),
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

        db.collection(COLLECTION_ID_USERS)
          .doc(id)
          .update({
            cumulativePoints: firebase.firestore.FieldValue.increment(
              scoreCalculation(metricObj),
            ),
            keystrokes: firebase.firestore.FieldValue.increment(
              parseInt(metricObj['keystrokes']),
            ),
            linesChanged: firebase.firestore.FieldValue.increment(
              parseInt(metricObj['linesChanged']),
            ),
            timeInterval: firebase.firestore.FieldValue.increment(
              parseInt(metricObj['timeInterval']),
            ),
          });
      }
    });
}

export async function retrieveTeamMemberStats(callback) {
  let db = firebase.firestore();

  let users = db.collection(COLLECTION_ID_USERS);
  const ctx = getExtensionContext();
  let cachedTeamID = ctx.globalState.get(GLOBAL_STATE_USER_TEAM_ID);

  if (!cachedTeamID) {
    window.showErrorMessage('Please Join a team first!');
  }

  let userMap = [];
  users
    .where('teamCode', '==', cachedTeamID)
    .get()
    .then((snapshot) => {
      if (snapshot.empty) {
        console.log('No matching documents.');
        return userMap;
      }

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
      callback(userMap, true);
    })
    .catch((err) => {
      console.log('Error getting documents', err);
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
      callback(userMap, false);
    })
    .catch((err) => {
      console.log('Error getting documents', err);
    });
}

/**
 * Create new user credential and add new doc to db
 */

export async function createNewUserInFirebase(email, password) {
  console.log('Creating new user...');
  let ctx = getExtensionContext();
  if (email == null) {
    console.log('email is null');
    return {created: false, errorCode: 'email is null'};
  }
  if (password == null) {
    console.log('password is null');
    return {created: false, errorCode: 'password is null'};
  }

  let created = false;
  let errorCode = undefined;

  await auth
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      const currentUserId = auth.currentUser.uid;
      console.log('Adding new user with ID: ' + currentUserId);

      addNewUserDocToDb(currentUserId, email);
      //window.showInformationMessage('Successfully created new account!');

      created = true;
      errorCode = 'no error';
    })
    .catch((e) => {
      console.log(e.message);
      console.log('error code: ' + e.code);
      console.log('Error creating new user!');

      created = false;
      errorCode = e.code;
    });

  return {created: created, errorCode: errorCode};
}

/**
 * Add a new user doc to database
 * @param userId
 */

async function addNewUserDocToDb(userId, email) {
  console.log('Adding doc to db for new user...');

  if (userId === undefined) {
    console.log('userId undefined.');
    return;
  }

  let today = new Date().toISOString().split('T')[0];
  const generatedName = generateRandomName();
  db.collection(COLLECTION_ID_USERS)
    .doc(userId)
    .set({
      name: generatedName,
      email: email,
      ...DEFAULT_USER_DOC_TOP,
    })
    .then(() => {
      console.log('Added name');
      console.log('Added doc with default values for new user');
    })
    .catch(() => {
      console.log('Error creating new entry');
    });

  updatePersistentStorageWithUserDocData(userId);

  db.collection(COLLECTION_ID_USERS)
    .doc(userId)
    .collection('dates')
    .doc(today)
    .set(DEFAULT_USER_DOC)
    .then(() => {
      console.log("Added user's doc for today:" + today);
      let data = getUserDocWithId(userId);
      console.log(data);
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
  console.log('Getting user doc from db...');

  await db
    .collection(COLLECTION_ID_USERS)
    .doc(userId)
    .get()
    .then((doc) => {
      console.log('Retrieved user: (' + userId + ') doc from db.');
      //console.log(doc.data());
      return doc.data();
    })
    .catch(() => {
      console.log('Error getting user: (' + userId + ') doc from db.');
      return undefined;
    });
}

/**
 * creates a new team (if not in db already)
 * @param input the new team's name
 */
export async function addNewTeamToDbAndJoin(teamName) {
  if (teamName == '' || teamName == undefined) {
    return;
  }

  const cachedUserId = getExtensionContext().globalState.get(
    GLOBAL_STATE_USER_ID,
  );

  var teamId = undefined;

  // team doc fields
  var newTeamDoc = DEFAULT_TEAM_DOC;
  newTeamDoc['teamName'] = teamName;
  newTeamDoc['teamLeadUserId'] = cachedUserId;

  await db
    .collection(COLLECTION_ID_TEAMS)
    .doc(teamName)
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log('Team already exists!');
      } else {
        //create this team and add user as a member

        // Add a new document to db for this team
        db.collection(COLLECTION_ID_TEAMS)
          .add(newTeamDoc)
          .then((ref) => {
            teamId = ref.id;
            console.log('Added team document with ID: ', teamId);
            console.log('Team Name: ' + teamName);
          })
          .then(() => {
            //add this user to team, isLeader = true
            joinTeamWithTeamId(teamId, true);
          });
      }
    });
}

/**
 * finds the team and adds user as a member
 * update user doc with team info
 * @param input name of the team to join
 * @param isLeader whether this user is the leader (true) or just a member (false)
 */
export async function joinTeamWithTeamId(teamId, isLeader) {
  console.log('Adding new member to team...');

  const ctx = getExtensionContext();
  const userId = ctx.globalState.get(GLOBAL_STATE_USER_ID);

  console.log('userid: ' + userId);

  //get team doc reference
  let teamDoc = db.collection(COLLECTION_ID_TEAMS).doc(teamId);

  //get the team name
  let teamName = '';
  console.log('team name is: ' + teamName);
  await teamDoc.get().then((doc) => {
    const data = doc.data();
    console.log(data);
    teamName = data.teamName;
  });
  console.log('team name: ' + teamName);

  //get team members collection
  let teamMembersCollection = teamDoc.collection(COLLECTION_ID_TEAM_MEMBERS);

  //add this user to members collection
  let addUserToMembers = await teamMembersCollection
    .doc(userId)
    .set({})
    .then(() => {
      console.log('Successfully added user to team members collection.');
    })
    .catch((e) => {
      console.log(e.message);
      console.log('Error add user to team members collection.');
    });

  //get reference to user doc
  let userDoc = db.collection(COLLECTION_ID_USERS).doc(userId);

  //add team info to user doc and update persistent storage
  let updateUser = await userDoc
    .update({
      teamCode: teamId,
      isLeader: isLeader,
      teamName: teamName,
    })
    .then(() => {
      ctx.globalState.update(GLOBAL_STATE_USER_TEAM_ID, teamId);
      ctx.globalState.update(GLOBAL_STATE_USER_IS_TEAM_LEADER, isLeader); //whether this user is the creator/leader
      ctx.globalState.update(GLOBAL_STATE_USER_TEAM_NAME, teamName);
      console.log(
        'cachedTeamId: ' + ctx.globalState.get(GLOBAL_STATE_USER_TEAM_ID),
      );
      console.log(
        'cachedTeamName: ' + ctx.globalState.get(GLOBAL_STATE_USER_TEAM_NAME),
      );
      console.log(
        'is leader? ' + ctx.globalState.get(GLOBAL_STATE_USER_IS_TEAM_LEADER),
      );
      console.log('Successfully added team info to user doc.');
      window.showInformationMessage(
        'Welcome to your new team: ' +
          ctx.globalState.get(GLOBAL_STATE_USER_TEAM_NAME),
      );
    })
    .catch((e) => {
      console.log(e.message);
      console.log('Error updating user doc.');
    });
}

/**
 * remove user from team
 * @param userId
 * @param teamId
 */
export async function leaveTeam(userId, teamId) {
  //get reference to extension context
  const ctx = getExtensionContext();

  //get team doc reference
  let teamDoc = db.collection(COLLECTION_ID_TEAMS).doc(teamId);

  // get team lead id
  let teamLeadId = '';
  let teamDocData = await teamDoc.get().then((doc) => {
    let data = doc.data();
    console.log(data);
    teamLeadId = data.teamLeadUserId;
  });

  console.log('team lead id: ' + teamLeadId);

  //get team members collection
  let teamMembersCollection = teamDoc.collection(COLLECTION_ID_TEAM_MEMBERS);

  //get user doc reference
  let userDoc = db.collection(COLLECTION_ID_USERS).doc(userId);

  //remove user from team member collection
  let removeMember = await teamMembersCollection.doc(userId).delete();

  //if the user is the leader, update team doc field
  if (teamLeadId == userId) {
    teamDoc.update({
      teamLeadUserId: '',
    });
    console.log('remove team lead id' + teamLeadId);
  }

  //remove team info from user doc
  let removeTeamInfo = await userDoc
    .update({
      teamCode: '',
      teamName: '',
    })
    .then(() => {
      //update persistent storage
      const teamName = ctx.globalState.get(GLOBAL_STATE_USER_TEAM_NAME);
      ctx.globalState.update(GLOBAL_STATE_USER_TEAM_ID, undefined);
      ctx.globalState.update(GLOBAL_STATE_USER_IS_TEAM_LEADER, undefined);
      ctx.globalState.update(GLOBAL_STATE_USER_TEAM_NAME, undefined);
      console.log(
        'cachedTeamId: ' + ctx.globalState.get(GLOBAL_STATE_USER_TEAM_ID),
      );
      console.log(
        'cachedTeamName: ' + ctx.globalState.get(GLOBAL_STATE_USER_TEAM_NAME),
      );
      console.log(
        'is leader? ' + ctx.globalState.get(GLOBAL_STATE_USER_IS_TEAM_LEADER),
      );
      console.log('Successfully removed from team.');
      window.showInformationMessage('Left your team: ' + teamName);
    })
    .catch((e) => {
      console.log(e.message);
      console.log('Error removing team info for user.');
    });
}

/**
 * checks if the user has already joined a team
 * @returns whether current user is in a team
 */
export async function checkIfInTeam() {
  const ctx = getExtensionContext();
  const userId = ctx.globalState.get(GLOBAL_STATE_USER_ID);

  let inTeam = false;
  await db
    .collection(COLLECTION_ID_USERS)
    .doc(userId)
    .get()
    .then((userDoc) => {
      if (userDoc.exists) {
        const data = userDoc.data();
        const teamField = data.teamCode;
        if (teamField == '') {
          console.log('No team code in db, not in a team.');
          inTeam = false;
        } else {
          console.log('Team code in db: ' + teamField);
          inTeam = true;
          ctx.globalState.update(GLOBAL_STATE_USER_TEAM_ID, teamField);
          console.log(
            'cachedUserId: ' + ctx.globalState.get(GLOBAL_STATE_USER_ID),
          );
        }
      }
    })
    .then(() => {
      console.log(inTeam);
      return inTeam;
    });
  console.log(inTeam);
  return inTeam;
}

export async function retrieveUserStats(callback) {
  let db = firebase.firestore();

  let user = db.collection(COLLECTION_ID_USERS);
  const ctx = getExtensionContext();
  const cachedUserId = ctx.globalState.get(GLOBAL_STATE_USER_ID);
  let dateMap = [];

  user
    .doc(cachedUserId)
    .collection('dates')
    .orderBy(firebase.firestore.FieldPath.documentId())
    .limit(15)
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        PersonalStats.addDayStats(doc.id, doc.data());
        let currDate = {};
        currDate['date'] = doc.id;
        for (let key in doc.data()) {
          currDate[key] = doc.data()[key];
        }
        dateMap.push(currDate);
        // console.log(doc.id + "=>" + doc.data());
      });

      return dateMap;
    })
    .then((dateMap) => {
      callback(dateMap);
    })
    .catch((err) => {
      console.log('Error getting documents', err);
    });
}

/**
 * returns true if a document associated with the passed in ID exists in firebase
 * @param userId uid
 */
export async function userDocExists(userId) {
  if (userId == undefined || userId == '') return false;
  console.log('Checking if user id (' + userId + ') exists in firebase...');
  let exists = false;
  await db
    .collection(COLLECTION_ID_USERS)
    .doc(userId)
    .get()
    .then((docRef) => {
      if (docRef.exists) {
        console.log('User document found in firebase!');
        console.log(docRef.data());
        exists = true;
      }
    })
    .then(() => {
      console.log('User doc found in firebase: ' + exists);
      return exists;
    })
    .catch(() => {
      console.log('Cannot find user document in firebase.');
      exists = false;
    });
  console.log('end of function userDocExists');
  return exists;
}
