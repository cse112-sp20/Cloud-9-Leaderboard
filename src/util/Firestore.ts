const firebase = require('firebase/app');
require('firebase/firestore');
require('firebase/auth');

import {window, ExtensionContext} from 'vscode';
import {processMetric} from './Metric';
import {Leaderboard} from './Leaderboard';
import {firebaseConfig, DEFAULT_PASSWORD, DEFAULT_USER_DOC} from './Constants';
import {getExtensionContext} from './Authentication';
import {generateRandomEmail} from './Utility';

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

/*
 * Whenever new payload from codetime is posted to their api,
 * we will update our database
 */
export function updateStats(payload) {
  console.log('Firestore.ts, updateStats');

  let metricObj = processMetric(payload);
  console.log(metricObj);

  const ctx: ExtensionContext = getExtensionContext();
  const cachedUserId = ctx.globalState.get('cachedUserId');

  let id = cachedUserId;
  console.log('cached id is ' + id);
  window.showInformationMessage('Updated Stats!');

  db.collection('users')
    .doc(id)
    .get()
    .then((doc) => {
      if (doc.exists) {
        //Update existing stats
        db.collection('users')
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
        db.collection('users')
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
  let users = db.collection('users');

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
export function createNewUser(ctx: ExtensionContext) {
  console.log('From Authentication: createNewUser');

  const email = generateRandomEmail(); // ...do we need this?

  auth
    .createUserWithEmailAndPassword(email, DEFAULT_PASSWORD)
    .then(() => {
      // add new uid to persistent storage
      const currentUserId = auth.currentUser.uid;
      ctx.globalState.update('cachedUserId', currentUserId);

      console.log('Successfully created new user');
      console.log('cachedUserId is: ' + ctx.globalState.get('cachedUserId'));

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
function addNewUserDocToDb(userId: String) {
  console.log('Adding doc to db for new user.');

  if (userId === undefined) {
    console.log('userId undefined.');
    return;
  }

  db.collection('users')
    .doc(JSON.stringify(userId))
    .set(DEFAULT_USER_DOC)
    .then(() => {
      console.log('Added new user: (' + userId + ') doc to db.');
      getUserDocWithId(userId);
    })
    .catch(() => {
      console.log('Error adding new user: (' + userId + ') doc to db.');
    });
}

/**
 * Retrieve the user doc from database
 * @param userId
 */
export function getUserDocWithId(userId: String) {
  console.log('Getting user doc from db...');

  var userDoc = db
    .collection('users')
    .doc(JSON.stringify(userId))
    .get()
    .then((doc) => {
      console.log('Retrieved user: (' + userId + ') doc from db.');
      console.log(doc.data());
    })
    .catch(() => {
      console.log('Error getting user: (' + userId + ') doc from db.');
    });
}

/**
 * creates a new team (if not in db already)
 * @param input the new team's name
 */
export function addNewTeamToDb(input: String) {
  //check if already in database
  const cachedUserId = getExtensionContext().globalState.get('cachedUserId');
  const teamName = JSON.stringify(input);
  var teamDoc = db.collection('teams').doc(teamName);

  teamDoc.get().then((doc) => {
    if (doc.exists) {
      console.log('Name already in use!');
    } else {
      //create this team and add user as a member
      db.collection('teams').doc(teamName).set({
        members: {cachedUserId},
      });

      //update user's doc
      db.collection('users')
        .doc(cachedUserId)
        .get('teams')
        .then((teamMap) => {
          teamMap[teamName] = '';
          db.collection('users').doc(cachedUserId).set({
            teams: teamMap,
          });
        });
    }
  });
}

/**
 * finds the team and adds user as a member
 * @param input name of the team to join
 */
export function joinTeam(input: String) {}
