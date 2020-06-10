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

import {workspace, window, ViewColumn} from "vscode";
import {getSoftwareDir, isWindows} from "../../lib/Util";
import {retrieveUserStats} from "./Firestore";
import {calculateStats} from "./Metric";

import {
  getExtensionContext,
  checkIfCachedUserIdExistsAndPrompt,
} from "./Authentication";
import {
  AUTH_NOT_LOGGED_IN,
  SECTION_BAR,
  STAT_LENGTH,
  FIELD_LENGTH,
  WECOME_TO_CLOUD9_ROW_1,
  WECOME_TO_CLOUD9_ROW_2,
  WECOME_TO_CLOUD9_ROW_3,
  WECOME_TO_CLOUD9_ROW_4,
  WECOME_TO_CLOUD9_ROW_5,
  LEADERBOARD_ACHIEVEMENTS,
  ACHIEVEMENTS_TITLE,
  STATISTICS_TITLE,
  RECORD_TITLE,
  METRIC_STRING,
  LINE_BAR,
} from "./Constants";
const fs = require("fs");

/**
 * Personal Stats class for storing all information about
 * the current user. All daily metric is stored using this class.
 */
export class PersonalStats {
  private static dates: Array<Object>;

  constructor() {}

  /**
   * Add statistics of a day to the class of this current user.
   * @param date date of the statistics
   * @param statsObj statistics values
   */
  public static addDayStats(date, statsObj) {
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
  public static getUsers() {
    return PersonalStats.dates;
  }
}

/**
 * Finding the file path of the personal stats txt file
 */
export function getPersonalStatsFile() {
  let filePath = getSoftwareDir();
  if (isWindows()) {
    filePath += "\\personal_statistics.txt";
  } else {
    filePath += "/personal_statistics.txt";
  }
  return filePath;
}

/**
 * Display personal statistics text file in the vscode window
 */
export async function displayPersonalStats() {
  // 1st write the code time metrics dashboard file
  // await writeLeaderboard();
  //ID check
  await checkIfCachedUserIdExistsAndPrompt().then((loggedIn) => {
    if (!loggedIn) {
      window.showErrorMessage(AUTH_NOT_LOGGED_IN);
      return;
    }
  });
  await retrieveUserStats(writePersonalStatsFile);

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
    } else {
      console.log("File exist");
    }
  } catch (err) {
    console.error(err);
  }

  workspace.openTextDocument(filePath).then((doc) => {
    // only focus if it's not already open
    window.showTextDocument(doc, ViewColumn.One, false).then((e) => {
      // done
    });
  });
}

/**
 * Write to personal statistics text file
 * @param dates the objects to be parsed and written on to the text file
 */
async function writePersonalStatsFile(dates) {
  let personalStatsFile = getPersonalStatsFile();

  const ctx = getExtensionContext();

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

  content += WECOME_TO_CLOUD9_ROW_1;
  content += WECOME_TO_CLOUD9_ROW_2;
  content += WECOME_TO_CLOUD9_ROW_3;
  content += WECOME_TO_CLOUD9_ROW_4;
  content += WECOME_TO_CLOUD9_ROW_5;
  content += "\n";

  content += SECTION_BAR;
  content += "                                     How to gain points \n";
  content += SECTION_BAR + "\n";
  content += METRIC_STRING;

  content += SECTION_BAR;
  content += RECORD_TITLE;
  content += SECTION_BAR + "\n";

  let previousScore: number = -1;
  let currentScore: number = 0;

  let counter = 1;

  let mapSize = scoreMap.length;

  console.log(mapSize);

  scoreMap.map((obj, i) => {
    if (i + 1 >= mapSize) {
      currentScore = +obj["points"];
      previousScore = 0;
    } else {
      currentScore = +obj["points"];
      previousScore = +scoreMap[i + 1]["points"];
    }

    let scoreDifference = currentScore - previousScore;
    if (scoreDifference >= 0) {
      content += obj["dateStr"] + " 🟩🟩🟩🟩🟩🟩" + "\n";
    } else {
      content += obj["dateStr"] + " 🟥🟥🟥🟥🟥🟥" + "\n";
      counter = 1;
    }

    content += LINE_BAR;
    content +=
      "    Keystrokes per minute :".padEnd(40, " ") +
      obj["keystrokes"].toString().padEnd(FIELD_LENGTH, " ") +
      "\t" +
      "|".padEnd(FIELD_LENGTH, " ") +
      "\t" +
      +obj["keystrokes"] * 1 +
      " points\n";
    content +=
      "      Lines of code added :".padEnd(40, " ") +
      obj["linesChanged"].toString().padEnd(FIELD_LENGTH, " ") +
      "\t" +
      "|".padEnd(FIELD_LENGTH, " ") +
      "\t" +
      +(+obj["linesChanged"] * 10) +
      " points\n";
    content +=
      "         Active code time :".padEnd(40, " ") +
      obj["timeInterval"].toString().padEnd(FIELD_LENGTH, " ") +
      "\t" +
      "|".padEnd(FIELD_LENGTH, " ") +
      "\t" +
      (+obj["timeInterval"] * 0.01).toFixed(3) +
      " points\n";
    content += "\n";
  });

  content += "\n" + SECTION_BAR;
  content += STATISTICS_TITLE;
  content += SECTION_BAR + "\n";

  let statsObj = calculateStats(scoreMap);

  content +=
    "Daily Average Keystrokes:".padEnd(STAT_LENGTH, " ") +
    statsObj["kpd"].toFixed(3) +
    "\n";
  content +=
    "Daily Average Lines Changed:".padEnd(STAT_LENGTH, " ") +
    statsObj["lcpd"].toFixed(3) +
    "\n";
  content +=
    "Daily Average Time Spent:".padEnd(STAT_LENGTH, " ") +
    statsObj["tspd"].toFixed(3) +
    "\n";
  content +=
    "Daily Average Points:".padEnd(STAT_LENGTH, " ") +
    statsObj["ppd"].toFixed(3) +
    "\n";

  content +=
    "Keystrokes per minute:".padEnd(STAT_LENGTH, " ") +
    statsObj["kpm"].toFixed(3) +
    "\n";
  content +=
    "Lines per minute:".padEnd(STAT_LENGTH, " ") +
    statsObj["lpm"].toFixed(3) +
    "\n";

  content += "\n" + SECTION_BAR;
  content += ACHIEVEMENTS_TITLE;
  content += SECTION_BAR + "\n";

  content += LEADERBOARD_ACHIEVEMENTS;

  fs.writeFileSync(personalStatsFile, content, (err) => {
    if (err) {
      console.error("Error writing leaderboard");
    }
  });
}
