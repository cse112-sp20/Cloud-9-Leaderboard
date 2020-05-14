import { workspace, window, ViewColumn } from "vscode";
import { getSoftwareDir, isWindows } from "../../lib/Util";
import { retrieveAllUserStats } from "./Firestore";
import { scoreCalculation } from "./Metric";
import { stat } from "fs";
const fs = require("fs");

export class Leaderboard {
  private static users: Array<Object>;

  constructor() {}

  public static addUser(userId, userObj) {
    if (!Leaderboard.users) {
      Leaderboard.users = [];
    }
    let user = new Object();
    user["id"] = userId;
    for (let key in userObj) {
      user[key] = userObj;
    }
    Leaderboard.users.push(user);
  }

  public static getUsers() {
    return Leaderboard.users;
  }
}

export function getLeaderboardFile() {
  let filePath = getSoftwareDir();
  if (isWindows()) {
    filePath += "\\leaderboard.txt";
  } else {
    filePath += "/leaderboard.txt";
  }
  return filePath;
}

export async function displayLeaderboard() {
  // 1st write the code time metrics dashboard file
  // await writeLeaderboard();
  await retrieveAllUserStats(writeToFile);

  let filePath = getLeaderboardFile();
  workspace.openTextDocument(filePath).then((doc) => {
    // only focus if it's not already open
    window.showTextDocument(doc, ViewColumn.One, false).then((e) => {
      // done
    });
  });
}

async function writeToFile(users) {
  const leaderboardFile = getLeaderboardFile();
  let leaderBoardContent = "";

  leaderBoardContent += "  L  E  A  D  E  R  B  O  A  R  D  \n";
  leaderBoardContent += "-------------------------------------- \n";
  leaderBoardContent +=
    "RANK" + "\t\t" + "NAME" + "\t\t\t\t\t\t" + "SCORE   \n";
  leaderBoardContent += "-------------------------------------- \n";

  let scoreMap = [];

  users.map((user) => {
    let obj = {};
    obj["id"] = user["id"];
    obj["score"] = parseFloat(scoreCalculation(user).toFixed(3));
    scoreMap.push(obj);
  });

  scoreMap = scoreMap.sort((a, b) => (a.score < b.score ? 1 : -1));

  scoreMap.map((user, i) => {
    leaderBoardContent +=
      i + 1 + "\t\t\t\t" + user.id + "\t - \t" + user.score + "\n";
  });

  console.log(scoreMap);

  leaderBoardContent += "-------------------------------------- \n";
  leaderBoardContent += "Each second spent coding         +0.01 \n";
  leaderBoardContent += "Each keystroke                   +   1 \n";
  leaderBoardContent += "Each modified line               +  10 \n";

  fs.writeFileSync(leaderboardFile, leaderBoardContent, (err) => {
    if (err) {
      console.error("Error writing leaderboard");
    }
  });
}
