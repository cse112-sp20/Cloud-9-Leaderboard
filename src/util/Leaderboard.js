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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.displayLeaderboard = exports.getLeaderboardFile = exports.Leaderboard = void 0;
var vscode_1 = require("vscode");
var Util_1 = require("../../lib/Util");
var Firestore_1 = require("./Firestore");
var fs = require('fs');
var Leaderboard = /** @class */ (function () {
    function Leaderboard() {
    }
    Leaderboard.addUser = function (userId, userObj) {
        if (!Leaderboard.users) {
            Leaderboard.users = [];
        }
        var user = new Object();
        user['id'] = userId;
        for (var key in userObj) {
            user[key] = userObj;
        }
        Leaderboard.users.push(user);
    };
    Leaderboard.getUsers = function () {
        return Leaderboard.users;
    };
    return Leaderboard;
}());
exports.Leaderboard = Leaderboard;
function getLeaderboardFile() {
    var filePath = Util_1.getSoftwareDir();
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
    return __awaiter(this, void 0, void 0, function () {
        var filePath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // 1st write the code time metrics dashboard file
                // await writeLeaderboard();
                return [4 /*yield*/, Firestore_1.retrieveAllUserStats(writeToFile)];
                case 1:
                    // 1st write the code time metrics dashboard file
                    // await writeLeaderboard();
                    _a.sent();
                    filePath = getLeaderboardFile();
                    vscode_1.workspace.openTextDocument(filePath).then(function (doc) {
                        // only focus if it's not already open
                        vscode_1.window.showTextDocument(doc, vscode_1.ViewColumn.One, false).then(function (e) {
                            // done
                        });
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports.displayLeaderboard = displayLeaderboard;
function writeToFile(users) {
    return __awaiter(this, void 0, void 0, function () {
        var leaderboardFile, leaderBoardContent, scoreMap;
        return __generator(this, function (_a) {
            leaderboardFile = getLeaderboardFile();
            leaderBoardContent = '';
            leaderBoardContent += '  L  E  A  D  E  R  B  O  A  R  D  \n';
            leaderBoardContent += '-------------------------------------- \n';
            leaderBoardContent +=
                'RANK' + '\t\t' + 'NAME' + '\t\t\t\t\t\t' + 'SCORE   \n';
            leaderBoardContent += '-------------------------------------- \n';
            scoreMap = [];
            users.map(function (user) {
                var obj = {};
                obj['name'] = user['name'];
                obj['score'] = parseFloat(user['cumulativePoints'].toFixed(3));
                scoreMap.push(obj);
            });
            scoreMap = scoreMap.sort(function (a, b) { return (a.score < b.score ? 1 : -1); });
            scoreMap.map(function (user, i) {
                leaderBoardContent +=
                    i + 1 + '\t\t\t\t' + user.name + '\t - \t' + user.score + '\n';
            });
            console.log(scoreMap);
            leaderBoardContent += '-------------------------------------- \n';
            leaderBoardContent += 'Each second spent coding        + 0.01 \n';
            leaderBoardContent += 'Each keystroke                  +    1 \n';
            leaderBoardContent += 'Each modified line              +   10 \n';
            fs.writeFileSync(leaderboardFile, leaderBoardContent, function (err) {
                if (err) {
                    console.error('Error writing leaderboard');
                }
            });
            return [2 /*return*/];
        });
    });
}
