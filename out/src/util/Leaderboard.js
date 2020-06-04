"use strict";
/**
 * File that contains leaderboard class which displays user's
 * personal leaderboard or team leaderboard.
 *
 * Contain constants string to display leaderboard User Interface.
 *
 *
 * @file   This files defines the Leaderboard class.
 * @author AuthorName.
 */
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
exports.displayTeamLeaderboard = exports.displayLeaderboard = exports.getTeamLeaderboardFile = exports.getLeaderboardFile = exports.Leaderboard = void 0;
const vscode_1 = require("vscode");
const Util_1 = require("../../lib/Util");
const Firestore_1 = require("./Firestore");
const Authentication_1 = require("./Authentication");
const Constants_1 = require("./Constants");
const fs = require('fs');
/**
 * Leaderboard for storing global leaderboard statistics
 */
class Leaderboard {
    constructor() { }
    /**
     * Add user to the class for global leaderboard
     * @param userId user ID of the current user to be added
     * @param userObj current user's statistics
     */
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
    /**
     * Getting users from the leaderboard class
     */
    static getUsers() {
        return Leaderboard.users;
    }
}
exports.Leaderboard = Leaderboard;
/**
 * Getting the filepath of the leaderboard txt file
 */
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
/**
 * Getting the filepath of the team leaderboard txt file
 */
function getTeamLeaderboardFile() {
    let filePath = Util_1.getSoftwareDir();
    if (Util_1.isWindows()) {
        filePath += '\\team_leaderboard.txt';
    }
    else {
        filePath += '/team_leaderboard.txt';
    }
    return filePath;
}
exports.getTeamLeaderboardFile = getTeamLeaderboardFile;
/**
 * Display global leaderboard with everyone's cumulative points
 */
function displayLeaderboard() {
    return __awaiter(this, void 0, void 0, function* () {
        //ID check
        yield Authentication_1.checkIfCachedUserIdExistsAndPrompt().then((loggedIn) => {
            if (!loggedIn) {
                vscode_1.window.showErrorMessage(Constants_1.AUTH_NOT_LOGGED_IN);
                return;
            }
        });
        // 1st write the code time metrics dashboard file
        // await writeLeaderboard();
        yield Firestore_1.retrieveAllUserStats(writeToFile);
        let filePath = getLeaderboardFile();
        try {
            if (!fs.existsSync(filePath)) {
                console.log('File not exist');
                fs.writeFileSync(filePath, '', (err) => {
                    // throws an error, you could also catch it here
                    if (err) {
                        console.log('Error writing intially');
                        throw err;
                    }
                    // success case, the file was saved
                    console.log('Written empty string');
                });
            }
            else {
                console.log('File exist');
            }
        }
        catch (err) {
            console.error(err);
        }
        vscode_1.workspace.openTextDocument(filePath).then((doc) => {
            // only focus if it's not already open
            vscode_1.window.showTextDocument(doc, vscode_1.ViewColumn.One, false).then((e) => {
                // done
            });
        });
    });
}
exports.displayLeaderboard = displayLeaderboard;
/**
 * Display team leaderboard txt file that consists of statistics
 * of all users belonging to the same team as the client
 */
function displayTeamLeaderboard() {
    return __awaiter(this, void 0, void 0, function* () {
        //ID check
        yield Authentication_1.checkIfCachedUserIdExistsAndPrompt().then((loggedIn) => {
            if (!loggedIn) {
                vscode_1.window.showErrorMessage(Constants_1.AUTH_NOT_LOGGED_IN);
                return;
            }
        });
        // 1st write the code time metrics dashboard file
        // await writeLeaderboard();
        yield Firestore_1.retrieveTeamMemberStats(writeToFile);
        let filePath = getTeamLeaderboardFile();
        try {
            if (!fs.existsSync(filePath)) {
                console.log('File not exist');
                fs.writeFileSync(filePath, '', (err) => {
                    // throws an error, you could also catch it here
                    if (err) {
                        console.log('Error writing intially');
                        throw err;
                    }
                    // success case, the file was saved
                    console.log('Written empty string');
                });
            }
            else {
                console.log('File exist');
            }
        }
        catch (err) {
            console.error(err);
        }
        vscode_1.workspace.openTextDocument(filePath).then((doc) => {
            // only focus if it's not already open
            vscode_1.window.showTextDocument(doc, vscode_1.ViewColumn.One, false).then((e) => {
                // done
            });
        });
    });
}
exports.displayTeamLeaderboard = displayTeamLeaderboard;
/**
 * A callback function that is used to write the content of the txt files
 * @param users all user statistics object to be written
 * @param isTeam checking whether the current format is for a team
 */
function writeToFile(users, isTeam) {
    return __awaiter(this, void 0, void 0, function* () {
        let leaderboardFile;
        let MAX_SCORE_LENGTH = 15;
        if (isTeam) {
            leaderboardFile = getTeamLeaderboardFile();
        }
        else {
            leaderboardFile = getLeaderboardFile();
        }
        const ctx = Authentication_1.getExtensionContext();
        let cachedUserId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_ID);
        let leaderBoardContent = '';
        leaderBoardContent += Constants_1.LEADERBOARD_ROW_1;
        leaderBoardContent += Constants_1.LEADERBOARD_ROW_2;
        leaderBoardContent += Constants_1.LEADERBOARD_ROW_3;
        leaderBoardContent += Constants_1.LEADERBOARD_ROW_4;
        leaderBoardContent += Constants_1.LEADERBOARD_ROW_5;
        leaderBoardContent += '\n';
        // if (isTeam) {
        //   leaderBoardContent += 'LEADERBOARD \t (Private)\n\n';
        // } else {
        //   leaderBoardContent += 'LEADERBOARD \t (Global)\n\n';
        // }
        let scoreMap = [];
        users.map((user) => {
            let obj = {};
            console.log(user.id);
            obj['id'] = user.id;
            obj['name'] = user['name'];
            obj['totalKeystrokes'] = user['keystrokes'];
            obj['totalLinesChanged'] = user['linesChanged'];
            obj['totalTimeInterval'] = user['timeInterval'];
            obj['today_keystrokes'] = user['today_keystrokes'];
            obj['today_linesChanged'] = user['today_linesChanged'];
            obj['today_timeInterval'] = user['today_timeInterval'];
            obj['score'] = parseFloat(user['cumulativePoints']).toFixed(3);
            scoreMap.push(obj);
        });
        scoreMap.sort(function (a, b) {
            return b.score - a.score;
        });
        let rankSection = '';
        let username = '';
        let teamname = '';
        scoreMap.map((user, i) => {
            let rankNumberSection = '';
            console.log('User id: ' + user.id);
            if (i == 0) {
                rankNumberSection += '\uD83E\uDD47 ';
            }
            else if (i == 1) {
                rankNumberSection += '\uD83E\uDD48 ';
            }
            else if (i == 2) {
                rankNumberSection += '\uD83E\uDD49 ';
            }
            else {
                rankNumberSection += '';
            }
            let badges = '';
            if (isTeam) {
                if (user.totalKeystrokes > 5000) {
                    badges += String.fromCodePoint(0x1f48e) + ' ';
                }
                if (user.totalLinesChanged > 2000) {
                    badges += String.fromCodePoint(0x1f50e) + ' ';
                }
                if (user.totalTimeInterval > 200 * 60 * 60) {
                    badges += String.fromCodePoint(0x1f525) + ' ';
                }
                if (user.today_keystrokes > 500) {
                    badges += String.fromCodePoint(0x1f4aa) + ' ';
                }
                if (user.today_linesChanged > 200) {
                    badges += String.fromCodePoint(0x1f94a) + ' ';
                }
                if (user.today_timeInterval > 6 * 60 * 60) {
                    badges += String.fromCodePoint(0x1f388) + ' ';
                }
            }
            console.log('cacheduserid: ' + cachedUserId);
            console.log('user id :' + user.id);
            console.log(user);
            if (cachedUserId == user.id) {
                username = user.name;
                rankNumberSection = i + 1 + ' ' + rankNumberSection;
                rankSection +=
                    rankNumberSection.padEnd(Constants_1.MAX_RANK_LENGTH, ' ') +
                        '\t\t' +
                        (user.name + ' (YOU)').padEnd(Constants_1.MAX_USERNAME_LENGTH, ' ') +
                        '\t\t' +
                        user.score.padEnd(MAX_SCORE_LENGTH, ' ') +
                        '\t\t' +
                        badges +
                        '\n';
            }
            else {
                rankNumberSection = i + 1 + ' ' + rankNumberSection;
                rankSection +=
                    rankNumberSection.padEnd(Constants_1.MAX_RANK_LENGTH, ' ') +
                        '\t\t' +
                        user.name.padEnd(Constants_1.MAX_USERNAME_LENGTH, ' ') +
                        '\t\t' +
                        user.score.padEnd(MAX_SCORE_LENGTH, ' ') +
                        '\t\t' +
                        badges +
                        '\n';
            }
        });
        teamname =
            ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_NAME) !== undefined
                ? ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_TEAM_NAME)
                : '______';
        console.log('username is :' + username);
        leaderBoardContent += 'Username \t : \t ' + username + '\n';
        leaderBoardContent += 'Teamname \t : \t ' + teamname + '\n\n';
        leaderBoardContent += Constants_1.SECTION_BAR;
        leaderBoardContent += '                                   LEADERBOARD RANKING \n';
        leaderBoardContent += Constants_1.SECTION_BAR + '\n';
        if (isTeam) {
            leaderBoardContent +=
                'RANK'.padEnd(Constants_1.MAX_RANK_LENGTH, ' ') +
                    '\t\t' +
                    'NAME'.padEnd(Constants_1.MAX_USERNAME_LENGTH, ' ') +
                    '\t\t' +
                    'SCORE'.padEnd(MAX_SCORE_LENGTH, ' ') +
                    '\t\tBADGES\n';
            leaderBoardContent +=
                '----'.padEnd(Constants_1.MAX_RANK_LENGTH, ' ') +
                    '\t\t' +
                    '----'.padEnd(Constants_1.MAX_USERNAME_LENGTH, ' ') +
                    '\t\t' +
                    '----'.padEnd(MAX_SCORE_LENGTH, ' ') +
                    '\t\t-----\n';
        }
        else {
            leaderBoardContent +=
                'RANK'.padEnd(Constants_1.MAX_RANK_LENGTH, ' ') +
                    '\t\t' +
                    'NAME'.padEnd(Constants_1.MAX_USERNAME_LENGTH, ' ') +
                    '\t\tSCORE\n';
            leaderBoardContent +=
                '----'.padEnd(Constants_1.MAX_RANK_LENGTH, ' ') +
                    '\t\t' +
                    '----'.padEnd(Constants_1.MAX_USERNAME_LENGTH, ' ') +
                    '\t\t-----\n';
        }
        leaderBoardContent += rankSection + '\n';
        //STATS HERE, TODO
        let BADGE_LENGTH = 6;
        leaderBoardContent += Constants_1.SECTION_BAR;
        leaderBoardContent += '                                        Metric \n';
        leaderBoardContent += Constants_1.SECTION_BAR + '\n';
        console.log(scoreMap);
        leaderBoardContent += 'Each second spent coding        + 0.01 \n';
        leaderBoardContent += 'Each keystroke                  +    1 \n';
        leaderBoardContent += 'Each modified line              +   10 \n';
        leaderBoardContent += '\n' + Constants_1.SECTION_BAR;
        leaderBoardContent += '                      Achievements (How you can earn these badges) \n';
        leaderBoardContent += Constants_1.SECTION_BAR + '\n';
        console.log(scoreMap);
        leaderBoardContent +=
            String.fromCodePoint(0x1f947).padEnd(BADGE_LENGTH, ' ') + '- rank first \n';
        leaderBoardContent +=
            String.fromCodePoint(0x1f948).padEnd(BADGE_LENGTH, ' ') +
                '- rank second \n';
        leaderBoardContent +=
            String.fromCodePoint(0x1f949).padEnd(BADGE_LENGTH, ' ') + '- rank third \n';
        leaderBoardContent +=
            String.fromCodePoint(0x1f48e).padEnd(BADGE_LENGTH, ' ') +
                '- reach 5000 total keystrokes \n';
        leaderBoardContent +=
            String.fromCodePoint(0x1f50e).padEnd(BADGE_LENGTH, ' ') +
                '- reach 2000 total lines changed \n';
        leaderBoardContent +=
            String.fromCodePoint(0x1f525).padEnd(BADGE_LENGTH, ' ') +
                '- spend total of 200 hours coding \n';
        leaderBoardContent +=
            String.fromCodePoint(0x1f4aa).padEnd(BADGE_LENGTH, ' ') +
                '- reach 500 keystrokes today\n';
        leaderBoardContent +=
            String.fromCodePoint(0x1f94a).padEnd(BADGE_LENGTH, ' ') +
                '- reach 200 lines changed today \n';
        leaderBoardContent +=
            String.fromCodePoint(0x1f388).padEnd(BADGE_LENGTH, ' ') +
                '- spend 6 hours coding today \n';
        fs.writeFileSync(leaderboardFile, leaderBoardContent, (err) => {
            if (err) {
                console.error('Error writing leaderboard');
            }
        });
    });
}
//# sourceMappingURL=Leaderboard.js.map