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
const Utility_1 = require("./Utility");
// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(Constants_1.firebaseConfig);
}
const auth = firebase.auth();
const db = firebase.firestore();
/*
 * Whenever new payload from codetime is posted to their api,
 * we will update our database
 */
function updateStats(payload) {
    console.log("Firestore.ts, updateStats");
    let metricObj = Metric_1.processMetric(payload);
    console.log(metricObj);
    const ctx = Authentication_1.getExtensionContext();
    const cachedUserId = ctx.globalState.get("cachedUserId");
    // TODO : Store ID somewhere in persistent storage
    let id = JSON.stringify(cachedUserId); //"Howard2";
    console.log("cached id is " + id);
    vscode_1.window.showInformationMessage("Updated Stats!");
    db.collection("users")
        .doc(id)
        .get()
        .then((doc) => {
        if (doc.exists) {
            //Update existing stats
            db.collection("users")
                .doc(id)
                .update({
                keystrokes: firebase.firestore.FieldValue.increment(parseInt(metricObj["keystrokes"])),
                linesChanged: firebase.firestore.FieldValue.increment(parseInt(metricObj["linesChanged"])),
                timeInterval: firebase.firestore.FieldValue.increment(parseInt(metricObj["timeInterval"])),
            })
                .then(() => {
                console.log("Successfully update stats");
            })
                .catch(() => {
                console.log("Error updating stats");
            });
        }
        else {
            //Update to firebase if no stats found
            db.collection("users")
                .doc(id)
                .set({
                keystrokes: metricObj["keystrokes"],
                linesChanged: metricObj["linesChanged"],
                timeInterval: metricObj["timeInterval"],
            })
                .then(() => {
                console.log("Added new entry");
            })
                .catch(() => {
                console.log("ERRRRR");
            });
        }
    });
}
exports.updateStats = updateStats;
function retrieveAllUserStats(callback) {
    return __awaiter(this, void 0, void 0, function* () {
        let db = firebase.firestore();
        let users = db.collection("users");
        let userMap = [];
        let content = "";
        let allUser = users
            .get()
            .then((snapshot) => {
            snapshot.forEach((doc) => {
                Leaderboard_1.Leaderboard.addUser(doc.id, doc.data());
                let currUser = {};
                currUser["id"] = doc.id;
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
            console.log("Error getting documents", err);
        });
    });
}
exports.retrieveAllUserStats = retrieveAllUserStats;
/**
 * Create new user credential and add new doc to db
 */
function createNewUser(ctx) {
    console.log("From Authentication: createNewUser");
    const email = Utility_1.generateRandomEmail(); // ...do we need this?
    auth
        .createUserWithEmailAndPassword(email, Constants_1.DEFAULT_PASSWORD)
        .then(() => {
        // add new uid to persistent storage
        const currentUserId = auth.currentUser.uid;
        ctx.globalState.update("cachedUserId", currentUserId);
        console.log("Successfully created new user");
        console.log("cachedUserId is: " + ctx.globalState.get("cachedUserId"));
        addNewUserDocToDb(currentUserId);
        return true;
    })
        .catch((e) => {
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
    console.log("Adding doc to db for new user.");
    if (userId === undefined) {
        console.log("userId undefined.");
        return;
    }
    db.collection("users")
        .doc(JSON.stringify(userId))
        .set(Constants_1.DEFAULT_USER_DOC)
        .then(() => {
        console.log("Added new user: (" + userId + ") doc to db.");
        getUserDocWithId(userId);
    })
        .catch(() => {
        console.log("Error adding new user: (" + userId + ") doc to db.");
    });
}
/**
 * Retrieve the user doc from database
 * @param userId
 */
function getUserDocWithId(userId) {
    console.log("Getting user doc from db...");
    var userDoc = db
        .collection("users")
        .doc(JSON.stringify(userId))
        .get()
        .then((doc) => {
        console.log("Retrieved user: (" + userId + ") doc from db.");
        console.log(doc.data());
    })
        .catch(() => {
        console.log("Error getting user: (" + userId + ") doc from db.");
    });
}
exports.getUserDocWithId = getUserDocWithId;
/**
 * creates a new team (if not in db already)
 * @param input the new team's name
 */
function addNewTeamToDb(input) {
    //check if already in database
    const cachedUserId = Authentication_1.getExtensionContext().globalState.get("cachedUserId");
    const teamName = JSON.stringify(input);
    var teamDoc = db.collection("teams").doc(teamName);
    teamDoc.get().then((doc) => {
        if (doc.exists) {
            console.log("Name already in use!");
        }
        else {
            //create this team and add user as a member
            db.collection("teams").doc(teamName).set({
                members: { cachedUserId },
            });
            //update user's doc
            db.collection("users")
                .doc(cachedUserId)
                .get("teams")
                .then((teamMap) => {
                teamMap[teamName] = "";
                db.collection("users").doc(cachedUserId).set({
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
function joinTeam(input) { }
exports.joinTeam = joinTeam;
//# sourceMappingURL=FireStore.js.map