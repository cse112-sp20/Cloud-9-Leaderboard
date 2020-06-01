"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchTeamMembersList = exports.userDocExists = exports.retrieveUserUpdateDailyMetric = exports.retrieveUserDailyMetric = exports.retrieveUserStats = exports.checkIfInTeam = exports.leaveTeam = exports.joinTeamWithTeamId = exports.addNewTeamToDbAndJoin = exports.getUserDocWithId = exports.createNewUserInFirebase = exports.retrieveAllUserStats = exports.retrieveTeamMemberStats = exports.updateStats = exports.updatePersistentStorageWithUserDocData = exports.loginUserWithEmailAndPassword = void 0;
const firebase = require('firebase/app');
require('firebase/firestore');
require('firebase/auth');
//const admin = require("firebase-admin");
const vscode_1 = require("vscode");
const Leaderboard_1 = require("./Leaderboard");
const PersonalStats_1 = require("./PersonalStats");
const Constants_1 = require("./Constants");
const Authentication_1 = require("./Authentication");
const Metric_1 = require("./Metric");
const Utility_1 = require("./Utility");
// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(Constants_1.firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();
/**
 *
 * @param email login user with email and password
 * @param password
 */
function loginUserWithEmailAndPassword(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        let loggedIn = false;
        let errorCode = undefined;
        yield auth
            .signInWithEmailAndPassword(email, password)
            .then((userCred) => __awaiter(this, void 0, void 0, function* () {
            console.log('logging user in: ' + userCred.user.uid);
            yield updatePersistentStorageWithUserDocData(userCred.user.uid);
            loggedIn = true;
            errorCode = 'no error';
        }))
            .catch((e) => {
            console.log(e.message);
            console.log(e.code);
            loggedIn = false;
            errorCode = e.code;
        });
        return { loggedIn: loggedIn, errorCode: errorCode };
    });
}
exports.loginUserWithEmailAndPassword = loginUserWithEmailAndPassword;
/**
 * update persistent storage after signing in (or after creating new user doc)
 * @param userId
 */
function updatePersistentStorageWithUserDocData(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Updating persistent storage...');
        let ctx = Authentication_1.getExtensionContext();
        yield db
            .collection(Constants_1.COLLECTION_ID_USERS)
            .doc(userId)
            .get()
            .then((userDoc) => __awaiter(this, void 0, void 0, function* () {
            if (userDoc.exists) {
                let userData = userDoc.data();
                console.log(userData.name);
                ctx.globalState.update(Constants_1.GLOBAL_STATE_USER_ID, userId);
                ctx.globalState.update(Constants_1.GLOBAL_STATE_USER_NICKNAME, userData.name);
                ctx.globalState.update(Constants_1.GLOBAL_STATE_USER_TEAM_ID, userData.teamCode);
                ctx.globalState.update(Constants_1.GLOBAL_STATE_USER_TEAM_NAME, userData.teamName);
                ctx.globalState.update(Constants_1.GLOBAL_STATE_USER_EMAIL, userData.email);
                const teamId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_ID);
                console.log('teamId: ' + teamId);
                if (teamId != undefined && teamId != '') {
                    yield db
                        .collection(Constants_1.COLLECTION_ID_TEAMS)
                        .doc(teamId)
                        .get()
                        .then((teamDoc) => __awaiter(this, void 0, void 0, function* () {
                        if (teamDoc.exists) {
                            const teamDocData = teamDoc.data();
                            if (teamDocData.teamLeadUserId == userId) {
                                ctx.globalState.update(Constants_1.GLOBAL_STATE_USER_IS_TEAM_LEADER, true);
                                //store team member data in persistent storage
                                let members = yield fetchTeamMembersList(teamId);
                                console.log(members);
                                console.log('updating team member list to persistent storage.');
                                ctx.globalState.update(Constants_1.GLOBAL_STATE_USER_TEAM_MEMBERS, members);
                                console.log(ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_MEMBERS));
                            }
                            else {
                                ctx.globalState.update(Constants_1.GLOBAL_STATE_USER_IS_TEAM_LEADER, false);
                            }
                        }
                    }))
                        .catch((e) => {
                        console.log(e.message);
                    });
                }
                else {
                    ctx.globalState.update(Constants_1.GLOBAL_STATE_USER_IS_TEAM_LEADER, false);
                    ctx.globalState.update(Constants_1.GLOBAL_STATE_USER_TEAM_ID, undefined);
                }
                console.log(ctx.globalState);
            }
        }))
            .catch((e) => {
            console.log(e.message);
            console.log('Error updating persistent storage');
        });
    });
}
exports.updatePersistentStorageWithUserDocData = updatePersistentStorageWithUserDocData;
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
function updateStats(payload) {
    const ctx = Authentication_1.getExtensionContext();
    const cachedUserId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_ID);
    //ID check, if not found, return immediately
    if (cachedUserId == undefined) {
        console.log('User ID not found, returning.');
        return;
    }
    console.log('Firestore.ts, updateStats');
    let metricObj = Metric_1.processMetric(payload);
    console.log(metricObj);
    let id = cachedUserId;
    console.log('cached id is ' + id);
    vscode_1.window.showInformationMessage('Updated Stats!');
    let today = new Date().toISOString().split('T')[0];
    db.collection(Constants_1.COLLECTION_ID_USERS)
        .doc(id)
        .get()
        .then((doc) => {
        if (doc.exists) {
            //Update existing stats
            db.collection(Constants_1.COLLECTION_ID_USERS)
                .doc(id)
                .collection('dates')
                .doc(today)
                .get()
                .then((doc2) => {
                if (doc2.exists) {
                    //Update existing stats
                    db.collection(Constants_1.COLLECTION_ID_USERS)
                        .doc(id)
                        .collection('dates')
                        .doc(today)
                        .update({
                        keystrokes: firebase.firestore.FieldValue.increment(parseInt(metricObj['keystrokes'])),
                        linesChanged: firebase.firestore.FieldValue.increment(parseInt(metricObj['linesChanged'])),
                        timeInterval: firebase.firestore.FieldValue.increment(parseInt(metricObj['timeInterval'])),
                        points: firebase.firestore.FieldValue.increment(Metric_1.scoreCalculation(metricObj)),
                    })
                        .then(() => {
                        console.log('Successfully update stats');
                        vscode_1.commands.executeCommand('DailyMetric.refreshEntry');
                    })
                        .catch(() => {
                        console.log('Error updating stats');
                    });
                    vscode_1.commands.executeCommand('DailyMetric.refreshEntry');
                }
                else {
                    db.collection(Constants_1.COLLECTION_ID_USERS)
                        .doc(id)
                        .collection('dates')
                        .doc(today)
                        .set({
                        keystrokes: metricObj['keystrokes'],
                        linesChanged: metricObj['linesChanged'],
                        timeInterval: metricObj['timeInterval'],
                        points: Metric_1.scoreCalculation(metricObj),
                    })
                        .then(() => {
                        console.log('Added new entry');
                        vscode_1.commands.executeCommand('DailyMetric.refreshEntry');
                    })
                        .catch(() => {
                        console.log('ERRRRR');
                    });
                    vscode_1.commands.executeCommand('DailyMetric.refreshEntry');
                }
                db.collection(Constants_1.COLLECTION_ID_USERS)
                    .doc(id)
                    .update({
                    cumulativePoints: firebase.firestore.FieldValue.increment(Metric_1.scoreCalculation(metricObj)),
                    keystrokes: firebase.firestore.FieldValue.increment(parseInt(metricObj['keystrokes'])),
                    linesChanged: firebase.firestore.FieldValue.increment(parseInt(metricObj['linesChanged'])),
                    timeInterval: firebase.firestore.FieldValue.increment(parseInt(metricObj['timeInterval'])),
                });
                vscode_1.commands.executeCommand('DailyMetric.refreshEntry');
            });
            vscode_1.commands.executeCommand('DailyMetric.refreshEntry');
        }
        else {
            //Update to firebase if no stats found
            db.collection(Constants_1.COLLECTION_ID_USERS)
                .doc(id)
                .collection('dates')
                .doc(today)
                .set({
                keystrokes: metricObj['keystrokes'],
                linesChanged: metricObj['linesChanged'],
                timeInterval: metricObj['timeInterval'],
                points: Metric_1.scoreCalculation(metricObj),
            })
                .then(() => {
                console.log('Added new entry');
                vscode_1.commands.executeCommand('DailyMetric.refreshEntry');
            })
                .catch(() => {
                console.log('ERRRRR');
            });
            db.collection(Constants_1.COLLECTION_ID_USERS)
                .doc(id)
                .update({
                cumulativePoints: firebase.firestore.FieldValue.increment(Metric_1.scoreCalculation(metricObj)),
                keystrokes: firebase.firestore.FieldValue.increment(parseInt(metricObj['keystrokes'])),
                linesChanged: firebase.firestore.FieldValue.increment(parseInt(metricObj['linesChanged'])),
                timeInterval: firebase.firestore.FieldValue.increment(parseInt(metricObj['timeInterval'])),
            });
            vscode_1.commands.executeCommand('DailyMetric.refreshEntry');
        }
        vscode_1.commands.executeCommand('DailyMetric.refreshEntry');
    });
}
exports.updateStats = updateStats;
function retrieveTeamMemberStats(callback) {
    return __awaiter(this, void 0, void 0, function* () {
        //ID check
        let db = firebase.firestore();
        let users = db.collection(Constants_1.COLLECTION_ID_USERS);
        const ctx = Authentication_1.getExtensionContext();
        let cachedTeamID = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_ID);
        if (!cachedTeamID) {
            vscode_1.window.showErrorMessage('Please Join a team first!');
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
                Leaderboard_1.Leaderboard.addUser(doc.id, doc.data());
                let currUser = {};
                currUser['id'] = doc.id;
                let today = new Date().toISOString().split('T')[0];
                users
                    .doc(doc.id)
                    .collection('dates')
                    .doc(today)
                    .get()
                    .then((doc2) => {
                    let dailyUser = {};
                    if (doc2.exists) {
                        for (let key in doc2.data()) {
                            dailyUser['today_' + key] = doc2.data()[key];
                        }
                    }
                    return dailyUser;
                })
                    .then((dailyUser) => {
                    currUser = Object.assign({}, dailyUser);
                    for (let key in doc.data()) {
                        currUser[key] = doc.data()[key];
                    }
                    userMap.push(currUser);
                    return userMap;
                })
                    .then((userMap) => {
                    console.log('Callback params');
                    console.log(userMap);
                    callback(userMap, true);
                });
                // for (let key in doc.data()) {
                //   currUser[key] = doc.data()[key];
                // }
                // userMap.push(currUser);
            });
            // return userMap;
        })
            // .then((userMap) => {
            //   callback(userMap, true);
            // })
            .catch((err) => {
            console.log('Error getting documents', err);
        });
    });
}
exports.retrieveTeamMemberStats = retrieveTeamMemberStats;
function retrieveAllUserStats(callback) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = firebase.firestore();
        let users = db.collection(Constants_1.COLLECTION_ID_USERS);
        let userMap = [];
        users
            .get()
            .then((snapshot) => {
            snapshot.forEach((doc) => {
                Leaderboard_1.Leaderboard.addUser(doc.id, doc.data());
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
    });
}
exports.retrieveAllUserStats = retrieveAllUserStats;
/**
 * Create new user credential and add new doc to db
 */
function createNewUserInFirebase(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        let ctx = Authentication_1.getExtensionContext();
        if (email == null) {
            console.log('email is null');
            return { created: false, errorCode: 'Email is invalid!' };
        }
        if (password == null) {
            console.log('password is null');
            return { created: false, errorCode: 'Password is invalid!' };
        }
        let created = false;
        let errorCode = undefined;
        yield auth
            .createUserWithEmailAndPassword(email, password)
            .then(() => __awaiter(this, void 0, void 0, function* () {
            const currentUserId = auth.currentUser.uid;
            console.log('Adding new user with ID: ' + currentUserId);
            yield addNewUserDocToDb(currentUserId, email);
            created = true;
            errorCode = 'no error';
        }))
            .catch((e) => {
            console.log(e.message);
            console.log('error code: ' + e.code);
            console.log('Error creating new user!');
            created = false;
            errorCode = e.code;
        });
        return { created: created, errorCode: errorCode };
    });
}
exports.createNewUserInFirebase = createNewUserInFirebase;
/**
 * Add a new user doc to database
 * @param userId
 */
function addNewUserDocToDb(userId, email) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Adding doc to db for new user...');
        if (userId === undefined) {
            console.log('userId undefined.');
            return;
        }
        let today = new Date().toISOString().split('T')[0];
        const generatedName = Utility_1.generateRandomName();
        db.collection(Constants_1.COLLECTION_ID_USERS)
            .doc(userId)
            .set(Object.assign({ name: generatedName, email: email }, Constants_1.DEFAULT_USER_DOC_TOP))
            .then(() => {
            console.log('Added name');
            console.log('Added doc with default values for new user');
        })
            .catch(() => {
            console.log('Error creating new entry');
        });
        db.collection(Constants_1.COLLECTION_ID_USERS)
            .doc(userId)
            .collection('dates')
            .doc(today)
            .set(Constants_1.DEFAULT_USER_DOC)
            .then(() => {
            console.log("Added user's doc for today:" + today);
            let data = getUserDocWithId(userId);
            console.log(data);
        })
            .catch(() => {
            console.log('Error adding new user: ' + userId + ' doc to db.');
        });
        yield updatePersistentStorageWithUserDocData(userId);
    });
}
/**
 * Retrieve the user doc from database
 * @param userId
 */
function getUserDocWithId(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Getting user doc from db...');
        yield db
            .collection(Constants_1.COLLECTION_ID_USERS)
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
    });
}
exports.getUserDocWithId = getUserDocWithId;
/**
 * creates a new team (if not in db already)
 * @param input the new team's name
 */
function addNewTeamToDbAndJoin(teamName) {
    return __awaiter(this, void 0, void 0, function* () {
        if (teamName == '' || teamName == undefined) {
            return;
        }
        const cachedUserId = Authentication_1.getExtensionContext().globalState.get(Constants_1.GLOBAL_STATE_USER_ID);
        var teamId = undefined;
        // team doc fields
        var newTeamDoc = Constants_1.DEFAULT_TEAM_DOC;
        newTeamDoc['teamName'] = teamName;
        newTeamDoc['teamLeadUserId'] = cachedUserId;
        yield db
            .collection(Constants_1.COLLECTION_ID_TEAMS)
            .doc(teamName)
            .get()
            .then((doc) => {
            if (doc.exists) {
                console.log('Team already exists!');
            }
            else {
                //create this team and add user as a member
                // Add a new document to db for this team
                db.collection(Constants_1.COLLECTION_ID_TEAMS)
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
    });
}
exports.addNewTeamToDbAndJoin = addNewTeamToDbAndJoin;
/**
 * finds the team and adds user as a member
 * update user doc with team info
 * @param input name of the team to join
 * @param isLeader whether this user is the leader (true) or just a member (false)
 */
function joinTeamWithTeamId(teamId, isLeader) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Adding new member to team...');
        const ctx = Authentication_1.getExtensionContext();
        const userId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_ID);
        const userEmail = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_EMAIL);
        const userNickname = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_NICKNAME);
        console.log('userid: ' + userId);
        console.log('userEmail: ' + userEmail);
        //get team doc reference
        let teamDoc = db.collection(Constants_1.COLLECTION_ID_TEAMS).doc(teamId);
        //get the team name
        let teamName = '';
        console.log('team name is: ' + teamName);
        yield teamDoc.get().then((doc) => {
            const data = doc.data();
            console.log(data);
            teamName = data.teamName;
        });
        console.log('team name: ' + teamName);
        //get team members collection
        let teamMembersCollection = teamDoc.collection(Constants_1.COLLECTION_ID_TEAM_MEMBERS);
        //add this user to members collection
        let addUserToMembers = yield teamMembersCollection
            .doc(userId)
            .set({
            email: userEmail,
            nickname: userNickname,
        })
            .then(() => {
            console.log('Successfully added ' + userNickname + ' to team members collection.');
        })
            .catch((e) => {
            console.log(e.message);
            console.log('Error adding user to team members collection.');
        });
        //get reference to user doc
        let userDoc = db.collection(Constants_1.COLLECTION_ID_USERS).doc(userId);
        //add team info to user doc and update persistent storage
        let updateUser = yield userDoc
            .update({
            teamCode: teamId,
            isLeader: isLeader,
            teamName: teamName,
        })
            .then(() => {
            ctx.globalState.update(Constants_1.GLOBAL_STATE_USER_TEAM_ID, teamId);
            ctx.globalState.update(Constants_1.GLOBAL_STATE_USER_IS_TEAM_LEADER, isLeader); //whether this user is the creator/leader
            ctx.globalState.update(Constants_1.GLOBAL_STATE_USER_TEAM_NAME, teamName);
            console.log('cachedTeamId: ' + ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_ID));
            console.log('cachedTeamName: ' + ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_NAME));
            console.log('is leader? ' + ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_IS_TEAM_LEADER));
            console.log('Successfully added team info to user doc.');
            vscode_1.window.showInformationMessage('Welcome to your new team: ' +
                ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_NAME));
            vscode_1.commands.executeCommand('LeaderView.refreshEntry');
            vscode_1.commands.executeCommand('TeamMenuView.refreshEntry');
        })
            .catch((e) => {
            console.log(e.message);
            console.log('Error updating user doc.');
        });
    });
}
exports.joinTeamWithTeamId = joinTeamWithTeamId;
/**
 * remove member from team in db, only leader is allowed to call this function
 * @param userId
 * @param teamId
 */
function leaveTeam(userId, teamId) {
    return __awaiter(this, void 0, void 0, function* () {
        //get reference to extension context
        const ctx = Authentication_1.getExtensionContext();
        const isLeader = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_IS_TEAM_LEADER);
        if (!isLeader) {
            vscode_1.window.showErrorMessage('Only the leader is allowed to remove members.');
            return;
        }
        //get team doc reference
        let teamDoc = db.collection(Constants_1.COLLECTION_ID_TEAMS).doc(teamId);
        // get team lead id
        let teamLeadId = '';
        let teamDocData = yield teamDoc.get().then((doc) => {
            let data = doc.data();
            console.log(data);
            teamLeadId = data.teamLeadUserId;
        });
        console.log('team lead id: ' + teamLeadId);
        //get team members collection
        let teamMembersCollection = teamDoc.collection(Constants_1.COLLECTION_ID_TEAM_MEMBERS);
        //get user doc reference
        let userDoc = db.collection(Constants_1.COLLECTION_ID_USERS).doc(userId);
        //remove user from team member collection
        let removeMember = yield teamMembersCollection.doc(userId).delete();
        //if the user is the leader, update team doc field
        if (teamLeadId == userId) {
            teamDoc.update({
                teamLeadUserId: '',
            });
            console.log('remove team lead id' + teamLeadId);
        }
        //remove team info from user doc
        let removeTeamInfo = yield userDoc
            .update({
            teamCode: '',
            teamName: '',
        })
            .then(() => {
            //update persistent storage
            // const teamName = ctx.globalState.get(GLOBAL_STATE_USER_TEAM_NAME);
            // ctx.globalState.update(GLOBAL_STATE_USER_TEAM_ID, undefined);
            // ctx.globalState.update(GLOBAL_STATE_USER_IS_TEAM_LEADER, undefined);
            // ctx.globalState.update(GLOBAL_STATE_USER_TEAM_NAME, undefined);
            // console.log(
            //   'cachedTeamId: ' + ctx.globalState.get(GLOBAL_STATE_USER_TEAM_ID),
            // );
            // console.log(
            //   'cachedTeamName: ' + ctx.globalState.get(GLOBAL_STATE_USER_TEAM_NAME),
            // );
            // console.log(
            //   'is leader? ' + ctx.globalState.get(GLOBAL_STATE_USER_IS_TEAM_LEADER),
            // );
            // console.log('Successfully removed from team.');
            // window.showInformationMessage('Left your team: ' + teamName);
            //update leader's persistent storage
            let membersMap = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_MEMBERS);
            console.log('old members map: ');
            console.log(membersMap);
            let newMembersMap = fetchTeamMembersList(teamId);
            ctx.globalState.update(Constants_1.GLOBAL_STATE_USER_TEAM_MEMBERS, newMembersMap);
            console.log('new members map: ');
            console.log(ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_MEMBERS));
            vscode_1.commands.executeCommand('LeaderView.refreshEntry');
            vscode_1.commands.executeCommand('TeamMenuView.refreshEntry');
        })
            .catch((e) => {
            console.log(e.message);
            console.log('Error removing team info for user.');
        });
    });
}
exports.leaveTeam = leaveTeam;
/**
 * checks if the user has already joined a team
 * @returns whether current user is in a team
 */
function checkIfInTeam() {
    return __awaiter(this, void 0, void 0, function* () {
        const ctx = Authentication_1.getExtensionContext();
        const userId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_ID);
        if (userId == undefined)
            return false;
        let inTeam = false;
        yield db
            .collection(Constants_1.COLLECTION_ID_USERS)
            .doc(userId)
            .get()
            .then((userDoc) => {
            if (userDoc.exists) {
                const data = userDoc.data();
                const teamField = data.teamCode;
                if (teamField == '' || teamField == undefined) {
                    console.log('No team code in db, not in a team.');
                    inTeam = false;
                }
                else {
                    console.log('Team code in db: ' + teamField);
                    inTeam = true;
                    ctx.globalState.update(Constants_1.GLOBAL_STATE_USER_TEAM_ID, teamField);
                    console.log('cachedUserId: ' + ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_ID));
                }
            }
        })
            .then(() => {
            console.log(inTeam);
            return inTeam;
        });
        console.log('end of checkIfInTeam: ' + inTeam);
        return inTeam;
    });
}
exports.checkIfInTeam = checkIfInTeam;
// /**
//  * checks via db if the user is the leader of their team
//  */
// export async function checkIfIsTeamLeader(){
//   let isLeader = false;
//   const ctx = getExtensionContext();
//   const userId = ctx.globalState.get(GLOBAL_STATE_USER_ID);
//   const teamId = ctx.globalState.get(GLOBAL_STATE_USER_TEAM_ID);
//   if(teamId == undefined || teamId ==''){
//     console.log('no cached team id');
//     return isLeader;
//   }else{
//     await db.collection(COLLECTION_ID_TEAMS)
//       .doc(teamId)
//       .get()
//       .then((teamDoc) => {
//         if(teamDoc.exists){
//           let teamDocData = teamDoc.data();
//           if(teamDocData.teamLeadUserId == userId){
//             isLeader = true;
//           }
//         }
//       })
//       .then(() => {
//         console.log('isLeader? ' + isLeader);
//         return isLeader;
//       });
//   }
//   console.log('end of checkIfIsLeader: ' + isLeader);
//   return isLeader;
// }
function retrieveUserStats(callback) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = firebase.firestore();
        let user = db.collection(Constants_1.COLLECTION_ID_USERS);
        const ctx = Authentication_1.getExtensionContext();
        const cachedUserId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_ID);
        let dateMap = [];
        if (db === undefined || user === undefined || cachedUserId === undefined) {
            console.log("retrieveUserStats undefined");
        }
        else {
            user
                .doc(cachedUserId)
                .collection('dates')
                .orderBy(firebase.firestore.FieldPath.documentId())
                .limit(15)
                .get()
                .then((snapshot) => {
                snapshot.forEach((doc) => {
                    PersonalStats_1.PersonalStats.addDayStats(doc.id, doc.data());
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
    });
}
exports.retrieveUserStats = retrieveUserStats;
function retrieveUserDailyMetric(callback, c) {
    let db = firebase.firestore();
    let user = db.collection(Constants_1.COLLECTION_ID_USERS);
    const ctx = Authentication_1.getExtensionContext();
    const cachedUserId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_ID);
    let userDataMap = [];
    console.log('****');
    console.log(cachedUserId);
    if (cachedUserId == undefined) {
        console.log('cached user id undefined when calling retrieve user daily metric');
        callback(undefined, c);
        return;
    }
    else {
        user
            .doc(cachedUserId)
            .collection('dates')
            .doc(new Date().toISOString().split('T')[0])
            .get()
            .then((userDoc) => {
            if (userDoc.exists) {
                // Convert to City object
                return userDoc.data();
            }
            else {
                console.log('userDoc does not exist');
                return undefined;
            }
        })
            .then((dataMap) => {
            console.log('data map');
            console.log(dataMap);
            callback(dataMap, c);
        })
            .catch((err) => {
            console.log('Error getting documents', err);
        });
    }
}
exports.retrieveUserDailyMetric = retrieveUserDailyMetric;
function retrieveUserUpdateDailyMetric() {
    return __awaiter(this, void 0, void 0, function* () {
        let db = firebase.firestore();
        let user = db.collection(Constants_1.COLLECTION_ID_USERS);
        const ctx = Authentication_1.getExtensionContext();
        const cachedUserId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_ID);
        let userDataMap;
        console.log('****');
        console.log(cachedUserId);
        yield db
            .collection(Constants_1.COLLECTION_ID_USERS)
            .doc(cachedUserId)
            .collection('dates')
            .doc(new Date().toISOString().split('T')[0])
            .get()
            .then((userDoc) => {
            if (userDoc.exists) {
                // Convert to City object
                console.log('user doc exist');
                userDataMap = userDoc.data();
            }
            else {
                console.log('userDoc does not exist');
                userDataMap = undefined;
            }
        })
            .catch((err) => {
            console.log('Error getting documents', err);
        });
        console.log(userDataMap);
        return userDataMap;
    });
}
exports.retrieveUserUpdateDailyMetric = retrieveUserUpdateDailyMetric;
/**
 * returns true if a document associated with the passed in ID exists in firebase
 * @param userId uid
 */
function userDocExists(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (userId == undefined || userId == '')
            return false;
        console.log('Checking if user id (' + userId + ') exists in firebase...');
        let exists = false;
        yield db
            .collection(Constants_1.COLLECTION_ID_USERS)
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
    });
}
exports.userDocExists = userDocExists;
function fetchTeamMembersList(teamId) {
    return __awaiter(this, void 0, void 0, function* () {
        const ctx = Authentication_1.getExtensionContext();
        const leaderId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_ID);
        if (leaderId == undefined)
            return;
        let members = new Map();
        //let members = [];
        yield db
            .collection(Constants_1.COLLECTION_ID_USERS)
            .where('teamCode', '==', teamId)
            .get()
            .then((snapshot) => {
            if (snapshot.empty) {
                console.log('Empty team.');
                return members;
            }
            snapshot.forEach((memberDoc) => {
                const memberId = memberDoc.id;
                if (memberId != leaderId) {
                    const memberData = memberDoc.data();
                    let member = new Map();
                    member['id'] = memberId;
                    member['email'] = memberData.email;
                    member['name'] = memberData.name;
                    //members.push(member);
                    members[member['email']] = member;
                }
            });
        })
            .then(() => {
            return members;
        })
            .catch((e) => {
            console.log(e.message);
        });
        return members;
    });
}
exports.fetchTeamMembersList = fetchTeamMembersList;
//# sourceMappingURL=Firestore.js.map