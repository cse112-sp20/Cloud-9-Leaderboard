"use strict";
/**
 * File that contains personal stats class which displays user's
 * personal statistics.
 *
 * Contain constants string to display personal stats.
 *
 *
 * @file   This files defines the personalstats class.
 * @author AuthorName.
 * @since  0.0.1
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
exports.displayPersonalStats = exports.getPersonalStatsFile = exports.PersonalStats = void 0;
const vscode_1 = require("vscode");
const Util_1 = require("../../lib/Util");
const Firestore_1 = require("./Firestore");
const Metric_1 = require("./Metric");
const Authentication_1 = require("./Authentication");
const Constants_1 = require("./Constants");
const fs = require("fs");
/**
 * Personal Stats class for storing all information about
 * the current user. All daily metric is stored using this class.
 */
class PersonalStats {
    constructor() { }
    /**
     * Add statistics of a day to the class of this current user.
     * @param date date of the statistics
     * @param statsObj statistics values
     */
    static addDayStats(date, statsObj) {
        if (!PersonalStats.dates) {
            PersonalStats.dates = [];
        }
        let dateObj = new Object();
        dateObj["date"] = date;
        for (let key in statsObj) {
            dateObj[key] = statsObj;
        }
        PersonalStats.dates.push(dateObj);
    }
    /**
     * Getter for user statistics
     */
    static getUsers() {
        return PersonalStats.dates;
    }
}
exports.PersonalStats = PersonalStats;
/**
 * Finding the file path of the personal stats txt file
 */
function getPersonalStatsFile() {
    let filePath = Util_1.getSoftwareDir();
    if (Util_1.isWindows()) {
        filePath += "\\personal_statistics.txt";
    }
    else {
        filePath += "/personal_statistics.txt";
    }
    return filePath;
}
exports.getPersonalStatsFile = getPersonalStatsFile;
/**
 * Display personal statistics text file in the vscode window
 */
function displayPersonalStats() {
    return __awaiter(this, void 0, void 0, function* () {
        // 1st write the code time metrics dashboard file
        // await writeLeaderboard();
        //ID check
        yield Authentication_1.checkIfCachedUserIdExistsAndPrompt().then((loggedIn) => {
            if (!loggedIn) {
                vscode_1.window.showErrorMessage(Constants_1.AUTH_NOT_LOGGED_IN);
                return;
            }
        });
        yield Firestore_1.retrieveUserStats(writePersonalStatsFile);
        let filePath = getPersonalStatsFile();
        try {
            if (!fs.existsSync(filePath)) {
                console.log("File not exist");
                fs.writeFileSync(filePath, "", (err) => {
                    // throws an error, you could also catch it here
                    if (err) {
                        console.log("Error writing intially");
                        throw err;
                    }
                    // success case, the file was saved
                    console.log("Written empty string");
                });
            }
            else {
                console.log("File exist");
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
exports.displayPersonalStats = displayPersonalStats;
/**
 * Write to personal statistics text file
 * @param dates the objects to be parsed and written on to the text file
 */
function writePersonalStatsFile(dates) {
    return __awaiter(this, void 0, void 0, function* () {
        let personalStatsFile = getPersonalStatsFile();
        const ctx = Authentication_1.getExtensionContext();
        let scoreMap = [];
        dates.map((date) => {
            let obj = {};
            obj["dateStr"] = date.date;
            obj["keystrokes"] = date["keystrokes"];
            obj["points"] = parseFloat(date["points"]).toFixed(3);
            obj["linesChanged"] = date["linesChanged"];
            obj["timeInterval"] = date["timeInterval"];
            obj["date"] = new Date(date.date);
            scoreMap.push(obj);
        });
        scoreMap.sort(function (a, b) {
            return b.date - a.date;
        });
        console.log(scoreMap);
        let content = "";
        content += Constants_1.WECOME_TO_CLOUD9_ROW_1;
        content += Constants_1.WECOME_TO_CLOUD9_ROW_2;
        content += Constants_1.WECOME_TO_CLOUD9_ROW_3;
        content += Constants_1.WECOME_TO_CLOUD9_ROW_4;
        content += Constants_1.WECOME_TO_CLOUD9_ROW_5;
        content += "\n";
        content += Constants_1.SECTION_BAR;
        content += "                                     How to gain points \n";
        content += Constants_1.SECTION_BAR + "\n";
        content += Constants_1.METRIC_STRING;
        content += Constants_1.SECTION_BAR;
        content += Constants_1.RECORD_TITLE;
        content += Constants_1.SECTION_BAR + "\n";
        let previousScore = -1;
        let currentScore = 0;
        let counter = 1;
        let mapSize = scoreMap.length;
        console.log(mapSize);
        scoreMap.map((obj, i) => {
            if (i + 1 >= mapSize) {
                currentScore = +obj["points"];
                previousScore = 0;
            }
            else {
                currentScore = +obj["points"];
                previousScore = +scoreMap[i + 1]["points"];
            }
            let scoreDifference = currentScore - previousScore;
            if (scoreDifference >= 0) {
                content += obj["dateStr"] + " 🟩🟩🟩🟩🟩🟩" + "\n";
            }
            else {
                content += obj["dateStr"] + " 🟥🟥🟥🟥🟥🟥" + "\n";
                counter = 1;
            }
            content += Constants_1.LINE_BAR;
            content +=
                "    Keystrokes per minute :".padEnd(40, " ") +
                    obj["keystrokes"].toString().padEnd(Constants_1.FIELD_LENGTH, " ") +
                    "\t" +
                    "|".padEnd(Constants_1.FIELD_LENGTH, " ") +
                    "\t" +
                    +obj["keystrokes"] * 1 +
                    " points\n";
            content +=
                "      Lines of code added :".padEnd(40, " ") +
                    obj["linesChanged"].toString().padEnd(Constants_1.FIELD_LENGTH, " ") +
                    "\t" +
                    "|".padEnd(Constants_1.FIELD_LENGTH, " ") +
                    "\t" +
                    +(+obj["linesChanged"] * 10) +
                    " points\n";
            content +=
                "         Active code time :".padEnd(40, " ") +
                    obj["timeInterval"].toString().padEnd(Constants_1.FIELD_LENGTH, " ") +
                    "\t" +
                    "|".padEnd(Constants_1.FIELD_LENGTH, " ") +
                    "\t" +
                    (+obj["timeInterval"] * 0.01).toFixed(3) +
                    " points\n";
            content += "\n";
        });
        content += "\n" + Constants_1.SECTION_BAR;
        content += Constants_1.STATISTICS_TITLE;
        content += Constants_1.SECTION_BAR + "\n";
        let statsObj = Metric_1.calculateStats(scoreMap);
        content +=
            "Daily Average Keystrokes:".padEnd(Constants_1.STAT_LENGTH, " ") +
                statsObj["kpd"].toFixed(3) +
                "\n";
        content +=
            "Daily Average Lines Changed:".padEnd(Constants_1.STAT_LENGTH, " ") +
                statsObj["lcpd"].toFixed(3) +
                "\n";
        content +=
            "Daily Average Time Spent:".padEnd(Constants_1.STAT_LENGTH, " ") +
                statsObj["tspd"].toFixed(3) +
                "\n";
        content +=
            "Daily Average Points:".padEnd(Constants_1.STAT_LENGTH, " ") +
                statsObj["ppd"].toFixed(3) +
                "\n";
        content +=
            "Keystrokes per minute:".padEnd(Constants_1.STAT_LENGTH, " ") +
                statsObj["kpm"].toFixed(3) +
                "\n";
        content +=
            "Lines per minute:".padEnd(Constants_1.STAT_LENGTH, " ") +
                statsObj["lpm"].toFixed(3) +
                "\n";
        content += "\n" + Constants_1.SECTION_BAR;
        content += Constants_1.ACHIEVEMENTS_TITLE;
        content += Constants_1.SECTION_BAR + "\n";
        content += Constants_1.LEADERBOARD_ACHIEVEMENTS;
        fs.writeFileSync(personalStatsFile, content, (err) => {
            if (err) {
                console.error("Error writing leaderboard");
            }
        });
    });
}
//# sourceMappingURL=PersonalStats.js.map