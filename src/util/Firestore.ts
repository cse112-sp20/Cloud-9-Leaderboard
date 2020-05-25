const firebase = require('firebase/app');
require('firebase/firestore');
require('firebase/auth');

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
  FIELD_ID_TEAM_LEAD_USER_ID,
} from './Constants';
import {getExtensionContext} from './Authentication';
import {processMetric, scoreCalculation} from './Metric';
import {generateRandomEmail, generateRandomName} from './Utility';

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
  await auth
    .signInWithEmailAndPassword(email, password)
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

export async function createNewUserInFirebase(ctx, email, password) {
  console.log('From Authentication: createNewUser');

  //const email = generateRandomEmail(); // ...do we need this?

  if (email == null) {
    console.log('email is null');
    return;
  }
  if (password == null) {
    console.log('password is null');
    return;
  }

  await auth
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      // add new uid to persistent storage
      const currentUserId = auth.currentUser.uid;

      ctx.globalState.update(GLOBAL_STATE_USER_ID, currentUserId);
      ctx.globalState.update(GLOBAL_STATE_USER_IS_TEAM_LEADER, false);

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
  console.log('Adding doc to db for new user...');

  if (userId === undefined) {
    console.log('userId undefined.');
    return;
  }

  let today = new Date().toISOString().split('T')[0];

  db.collection(COLLECTION_ID_USERS)
    .doc(userId)
    .set({
      name: generateRandomName(),
      ...DEFAULT_USER_DOC_TOP,
    })
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
  console.log('Getting user doc from db...');

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

        // Add a new document with a generated id.
        db.collection(COLLECTION_ID_TEAMS)
          .add(newTeamDoc)
          .then((ref) => {
            teamId = ref.id;
            console.log('Added team document with ID: ', teamId);
            console.log('Team Name: ' + teamName);
            //link user with team
          })
          .then(() => {
            joinTeamWithTeamId(teamId, true);
          });
      }
    });
}

/**
 * finds the team and adds user as a member
 * update user doc with team info
 * @param input name of the team to join
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
  let teamDocData = await teamDoc.get().then((doc) => {
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

  //add team info to user doc and update local cache
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
        'cachedTeamId: ' + ctx.globalState.get(GLOBAL_STATE_USER_TEAM_NAME),
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
      console.log('Error removing team info from user.');
    });
}

/**
 * checks if the user has already joined a team
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
      return inTeam;
    });
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

      console.log('*************');
      console.log(dateMap);

      return dateMap;
    })
    .then((dateMap) => {
      callback(dateMap);
    })
    .catch((err) => {
      console.log('Error getting documents', err);
    });
}

export async function retrieveUserDailyMetric(callback, c) {
  let db = firebase.firestore();

  let user = db.collection(COLLECTION_ID_USERS);

  const ctx = getExtensionContext();
  const cachedUserId = ctx.globalState.get(GLOBAL_STATE_USER_ID);

  let userDataMap = [];

  user
    .doc(cachedUserId)
    .collection('dates')
    .doc(new Date().toISOString().split('T')[0])
    .get()
    .then((userDoc) => {
      if (userDoc.exists) {
        // Convert to City object
        return userDoc.data();
      } else {
        return undefined;
      }
    })
    .then((dataMap) => {
      callback(dataMap, c);
    })
    .catch((err) => {
      console.log('Error getting documents', err);
    });
}
