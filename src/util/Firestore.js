'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = {next: verb(0), throw: verb(1), return: verb(2)}),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return {value: op[1], done: false};
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return {value: op[0] ? op[1] : void 0, done: true};
    }
  };
exports.__esModule = true;
exports.joinTeam = exports.addNewTeamToDb = exports.getUserDocWithId = exports.createNewUser = exports.retrieveAllUserStats = exports.updateStats = void 0;
var firebase = require('firebase/app');
require('firebase/firestore');
require('firebase/auth');
var vscode_1 = require('vscode');
var Metric_1 = require('./Metric');
var Leaderboard_1 = require('./Leaderboard');
var Constants_1 = require('./Constants');
var Authentication_1 = require('./Authentication');
var Utility_1 = require('./Utility');
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(Constants_1.firebaseConfig);
}
var auth = firebase.auth();
var db = firebase.firestore();
/*
 * Whenever new payload from codetime is posted to their api,
 * we will update our database
 */
function updateStats(payload) {
  console.log('Firestore.ts, updateStats');
  var metricObj = Metric_1.processMetric(payload);
  console.log(metricObj);
  var ctx = Authentication_1.getExtensionContext();
  var cachedUserId = ctx.globalState.get('cachedUserId');
  var id = cachedUserId;
  console.log('cached id is ' + id);
  vscode_1.window.showInformationMessage('Updated Stats!');
  var today = new Date().toISOString().split('T')[0];
  db.collection('users')
    .doc(id)
    .get()
    .then(function (doc) {
      if (doc.exists) {
        db.collection('users')
          .doc(id)
          .collection('dates')
          .doc(today)
          .get()
          .then(function (doc2) {
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
                    Metric_1.scoreCalculation(metricObj),
                  ),
                })
                .then(function () {
                  console.log('Successfully update stats');
                })
                ['catch'](function () {
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
                  points: Metric_1.scoreCalculation(metricObj),
                })
                .then(function () {
                  console.log('Added new entry');
                })
                ['catch'](function () {
                  console.log('ERRRRR');
                });
            }
            db.collection('users')
              .doc(id)
              .update({
                cumulativePoints: firebase.firestore.FieldValue.increment(
                  Metric_1.scoreCalculation(metricObj),
                ),
              });
          });
      } else {
        //Update to firebase if no stats found
        db.collection('users')
          .doc(id)
          .collection('dates')
          .doc(today)
          .set({
            keystrokes: metricObj['keystrokes'],
            linesChanged: metricObj['linesChanged'],
            timeInterval: metricObj['timeInterval'],
            points: Metric_1.scoreCalculation(metricObj),
          })
          .then(function () {
            console.log('Added new entry');
          })
          ['catch'](function () {
            console.log('ERRRRR');
          });
        db.collection('users')
          .doc(id)
          .update({
            cumulativePoints: firebase.firestore.FieldValue.increment(
              Metric_1.scoreCalculation(metricObj),
            ),
          });
      }
    });
}
exports.updateStats = updateStats;
function retrieveAllUserStats(callback) {
  return __awaiter(this, void 0, void 0, function () {
    var db, users, userMap;
    return __generator(this, function (_a) {
      db = firebase.firestore();
      users = db.collection('users');
      userMap = [];
      users
        .get()
        .then(function (snapshot) {
          snapshot.forEach(function (doc) {
            Leaderboard_1.Leaderboard.addUser(doc.id, doc.data());
            var currUser = {};
            currUser['id'] = doc.id;
            for (var key in doc.data()) {
              currUser[key] = doc.data()[key];
            }
            userMap.push(currUser);
            // console.log(doc.id + "=>" + doc.data());
          });
          return userMap;
        })
        .then(function (userMap) {
          callback(userMap);
        })
        ['catch'](function (err) {
          console.log('Error getting documents', err);
        });
      return [2 /*return*/];
    });
  });
}
exports.retrieveAllUserStats = retrieveAllUserStats;
/**
 * Create new user credential and add new doc to db
 */
function createNewUser(ctx) {
  console.log('From Authentication: createNewUser');
  var email = Utility_1.generateRandomEmail(); // ...do we need this?
  auth
    .createUserWithEmailAndPassword(email, Constants_1.DEFAULT_PASSWORD)
    .then(function () {
      // add new uid to persistent storage
      var currentUserId = auth.currentUser.uid;
      ctx.globalState.update('cachedUserId', currentUserId);
      console.log('Successfully created new user');
      console.log('cachedUserId is: ' + ctx.globalState.get('cachedUserId'));
      addNewUserDocToDb(currentUserId);
      return true;
    })
    ['catch'](function (e) {
      console.log(e.message);
      return false;
    });
}
exports.createNewUser = createNewUser;
/**
 * Add a new user doc to database
 * @param userId
 */
function addNewUserDocToDb(userId) {
  console.log('Adding doc to db for new user.');
  if (userId === undefined) {
    console.log('userId undefined.');
    return;
  }
  var today = new Date().toISOString().split('T')[0];
  db.collection('users')
    .doc(userId)
    .set({
      name: Utility_1.generateRandomName(),
      teamCode: '',
      cumulativePoints: 0,
    })
    .then(function () {
      console.log('Added name');
    })
    ['catch'](function () {
      console.log('Error creating new entry');
    });
  db.collection('users')
    .doc(userId)
    .collection('dates')
    .doc(today)
    .set(Constants_1.DEFAULT_USER_DOC)
    .then(function () {
      console.log('Added new user: ' + userId + ' doc to db.');
      getUserDocWithId(userId);
    })
    ['catch'](function () {
      console.log('Error adding new user: ' + userId + ' doc to db.');
    });
}
/**
 * Retrieve the user doc from database
 * @param userId
 */
function getUserDocWithId(userId) {
  console.log('Getting user doc from db...');
  var userDoc = db
    .collection('users')
    .doc(userId)
    .get()
    .then(function (doc) {
      console.log('Retrieved user: (' + userId + ') doc from db.');
      console.log(doc.data());
    })
    ['catch'](function () {
      console.log('Error getting user: (' + userId + ') doc from db.');
    });
}
exports.getUserDocWithId = getUserDocWithId;
/**
 * creates a new team (if not in db already)
 * @param input the new team's name
 */
function addNewTeamToDb(input) {
  //check if already in database
  var cachedUserId = Authentication_1.getExtensionContext().globalState.get(
    'cachedUserId',
  );
  var teamName = JSON.stringify(input);
  var teamDoc = db.collection('teams').doc(teamName);
  teamDoc.get().then(function (doc) {
    if (doc.exists) {
      console.log('Name already in use!');
    } else {
      //create this team and add user as a member
      db.collection('teams')
        .doc(teamName)
        .set({
          members: {cachedUserId: cachedUserId},
        });
      //update user's doc
      db.collection('users')
        .doc(cachedUserId)
        .get('teams')
        .then(function (teamMap) {
          teamMap[teamName] = '';
          db.collection('users').doc(cachedUserId).set({
            teams: teamMap,
          });
        });
    }
  });
}
exports.addNewTeamToDb = addNewTeamToDb;
/**
 * finds the team and adds user as a member
 * @param input name of the team to join
 */
function joinTeam(input) {}
exports.joinTeam = joinTeam;
