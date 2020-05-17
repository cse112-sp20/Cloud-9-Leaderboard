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
const vscode_1 = require("vscode");
const Util_1 = require("../../lib/Util");
const Firestore_1 = require("./Firestore");
const Metric_1 = require("./Metric");
const fs = require('fs');
class Leaderboard {
    constructor() { }
    static addUser(userId, userObj) {
        if (!Leaderboard.users) {
            Leaderboard.users = [];
        }
        let user = new Object();
        user['id'] = userId;
        for (let key in userObj) {
            user[key] = userObj;
        }
        Leaderboard.users.push(user);
    }
    static getUsers() {
        return Leaderboard.users;
    }
}
exports.Leaderboard = Leaderboard;
function getLeaderboardFile() {
    let filePath = Util_1.getSoftwareDir();
    if (Util_1.isWindows()) {
        filePath += '\\leaderboard.txt';
    }
    else {
        filePath += '/leaderboard.txt';
    }
    return filePath;
}
exports.getLeaderboardFile = getLeaderboardFile;
function displayLeaderboard() {
    return __awaiter(this, void 0, void 0, function* () {
        // 1st write the code time metrics dashboard file
        // await writeLeaderboard();
        yield Firestore_1.retrieveAllUserStats(writeToFile);
        let filePath = getLeaderboardFile();
        vscode_1.workspace.openTextDocument(filePath).then((doc) => {
            // only focus if it's not already open
            vscode_1.window.showTextDocument(doc, vscode_1.ViewColumn.One, false).then((e) => {
                // done
            });
        });
    });
}
exports.displayLeaderboard = displayLeaderboard;
function writeToFile(users) {
    return __awaiter(this, void 0, void 0, function* () {
        const leaderboardFile = getLeaderboardFile();
        let leaderBoardContent = '';
        leaderBoardContent += '  L  E  A  D  E  R  B  O  A  R  D  \n';
        leaderBoardContent += '-------------------------------------- \n';
        leaderBoardContent +=
            'RANK' + '\t\t' + 'NAME' + '\t\t\t\t\t\t' + 'SCORE   \n';
        leaderBoardContent += '-------------------------------------- \n';
        let scoreMap = [];
        users.map((user) => {
            let obj = {};
            obj['id'] = user['id'];
            obj['score'] = parseFloat(Metric_1.scoreCalculation(user).toFixed(3));
            scoreMap.push(obj);
        });
        scoreMap = scoreMap.sort((a, b) => (a.score < b.score ? 1 : -1));
        scoreMap.map((user, i) => {
            leaderBoardContent +=
                i + 1 + '\t\t\t\t' + user.id + '\t - \t' + user.score + '\n';
        });
        console.log(scoreMap);
        leaderBoardContent += '-------------------------------------- \n';
        leaderBoardContent += 'Each second spent coding        + 0.01 \n';
        leaderBoardContent += 'Each keystroke                  +    1 \n';
        leaderBoardContent += 'Each modified line              +   10 \n';
        fs.writeFileSync(leaderboardFile, leaderBoardContent, (err) => {
            if (err) {
                console.error('Error writing leaderboard');
            }
        });
    });
}
//# sourceMappingURL=Leaderboard.js.map