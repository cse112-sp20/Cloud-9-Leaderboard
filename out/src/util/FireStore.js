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
const firebase = require("firebase/app");
require("firebase/firestore");
require("firebase/auth");
const vscode_1 = require("vscode");
const Metric_1 = require("./Metric");
const Leaderboard_1 = require("./Leaderboard");
const Constants_1 = require("./Constants");
const Authentication_1 = require("./Authentication");
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
        yield auth.signInWithEmailAndPassword(email, password).catch((e) => {
            console.log(e.message);
        });
    });
}
exports.loginUserWithEmailAndPassword = loginUserWithEmailAndPassword;
/*
 * Whenever new payload from codetime is posted to their api,
 * we will update our database
 */
function updateStats(payload) {
    console.log('Firestore.ts, updateStats');
    let metricObj = Metric_1.processMetric(payload);
    console.log(metricObj);
    const ctx = Authentication_1.getExtensionContext();
    const cachedUserId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_ID);
    let id = cachedUserId;
    console.log('cached id is ' + id);
    vscode_1.window.showInformationMessage('Updated Stats!');
    db.collection(Constants_1.COLLECTION_ID_USERS)
        .doc(id)
        .get()
        .then((doc) => {
        if (doc.exists) {
            //Update existing stats
            db.collection(Constants_1.COLLECTION_ID_USERS)
                .doc(id)
                .update({
                keystrokes: firebase.firestore.FieldValue.increment(parseInt(metricObj['keystrokes'])),
                linesChanged: firebase.firestore.FieldValue.increment(parseInt(metricObj['linesChanged'])),
                timeInterval: firebase.firestore.FieldValue.increment(parseInt(metricObj['timeInterval'])),
            })
                .then(() => {
                console.log('Successfully update stats');
            })
                .catch(() => {
                console.log('Error updating stats');
            });
        }
        else {
            //Update to firebase if no stats found
            db.collection(Constants_1.COLLECTION_ID_USERS)
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
exports.updateStats = updateStats;
function retrieveAllUserStats(callback) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = firebase.firestore();
        let users = db.collection(Constants_1.COLLECTION_ID_USERS);
        let userMap = [];
        let content = '';
        let allUser = users
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
            callback(userMap);
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
function createNewUserInFirebase(ctx, email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("From Authentication: createNewUser");
        //const email = generateRandomEmail(); // ...do we need this?
        if (email == null) {
            console.log("email is null");
            return;
        }
        if (password == null) {
            console.log('password is null');
            return;
        }
        yield auth
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
            // add new uid to persistent storage
            const currentUserId = auth.currentUser.uid;
            ctx.globalState.update(Constants_1.GLOBAL_STATE_USER_ID, currentUserId);
            console.log('cachedUserId: ' + ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_ID));
            addNewUserDocToDb(currentUserId);
            return true;
        })
            .catch((e) => {
            console.log(e.message);
            return false;
        });
    });
}
exports.createNewUserInFirebase = createNewUserInFirebase;
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
    db.collection(Constants_1.COLLECTION_ID_USERS)
        .doc(userId)
        .set(Constants_1.DEFAULT_USER_DOC)
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
function getUserDocWithId(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Getting user doc from db...");
        var userDoc = yield db
            .collection(Constants_1.COLLECTION_ID_USERS)
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
    });
}
exports.getUserDocWithId = getUserDocWithId;
/**
 * creates a new team (if not in db already)
 * @param input the new team's name
 */
function addNewTeamToDbAndJoin(teamName) {
    return __awaiter(this, void 0, void 0, function* () {
        //check if already in database
        //const cachedUserId = getExtensionContext().globalState.get(GLOBAL_STATE_USER_ID);
        var teamId = undefined;
        var newTeamDoc = Constants_1.DEFAULT_TEAM_DOC;
        newTeamDoc['teamName'] = teamName;
        yield db.collection(Constants_1.COLLECTION_ID_TEAMS).doc(teamName).get().then((doc) => {
            if (doc.exists) {
                console.log('Name already in use!');
                console.log(doc.data);
            }
            else {
                //create this team and add user as a member
                // Add a new document with a generated id.
                db.collection(Constants_1.COLLECTION_ID_TEAMS)
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
    });
}
exports.addNewTeamToDbAndJoin = addNewTeamToDbAndJoin;
/**
 * finds the team and adds user as a member
 * @param input name of the team to join
 */
function joinTeam(teamId, teamName) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Adding new member to team...');
        const ctx = Authentication_1.getExtensionContext();
        const userId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_ID);
        yield db.collection(Constants_1.COLLECTION_ID_TEAMS)
            .doc(teamId)
            .collection(Constants_1.COLLECTION_ID_TEAM_MEMBERS)
            .doc(userId)
            .set({})
            .then(() => __awaiter(this, void 0, void 0, function* () {
            ctx.globalState.update(Constants_1.GLOBAL_STATE_USER_TEAM_NAME, teamName);
            yield db.collection(Constants_1.COLLECTION_ID_USERS)
                .doc(userId)
                .update({ teamId: teamId })
                .then(() => {
                console.log('Successfully added user to team.');
            });
        }))
            .catch((e) => {
            console.log(e.message);
            console.log('Error adding user to team!');
        });
    });
}
exports.joinTeam = joinTeam;
//# sourceMappingURL=FireStore.js.map