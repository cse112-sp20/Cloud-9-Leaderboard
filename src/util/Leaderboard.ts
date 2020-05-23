import {workspace, window, ViewColumn} from 'vscode';
import {getSoftwareDir, isWindows} from '../../lib/Util';
import {retrieveAllUserStats, retrieveTeamMemberStats} from './Firestore';
import {scoreCalculation} from './Metric';
import {stat} from 'fs';
import {getExtensionContext} from './Authentication';
import {
  GLOBAL_STATE_USER_ID,
  GLOBAL_STATE_USER_TEAM_NAME,
  MAX_USERNAME_LENGTH,
  MAX_RANK_LENGTH,
  SECTION_BAR,
} from './Constants';
const fs = require('fs');

export class Leaderboard {
  private static users: Array<Object>;

  constructor() {}

  public static addUser(userId, userObj) {
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

  public static getUsers() {
    return Leaderboard.users;
  }
}

export function getLeaderboardFile() {
  let filePath = getSoftwareDir();
  if (isWindows()) {
    filePath += '\\leaderboard.txt';
  } else {
    filePath += '/leaderboard.txt';
  }
  return filePath;
}

export function getTeamLeaderboardFile() {
  let filePath = getSoftwareDir();
  if (isWindows()) {
    filePath += '\\team_leaderboard.txt';
  } else {
    filePath += '/team_leaderboard.txt';
  }
  return filePath;
}

export async function displayLeaderboard() {
  // 1st write the code time metrics dashboard file
  // await writeLeaderboard();
  await retrieveAllUserStats(writeToFile);

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
    } else {
      console.log('File exist');
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

export async function displayTeamLeaderboard() {
  // 1st write the code time metrics dashboard file
  // await writeLeaderboard();
  await retrieveTeamMemberStats(writeToFile);

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
    } else {
      console.log('File exist');
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

async function writeToFile(users, isTeam) {
  let leaderboardFile;

  if (isTeam) {
    leaderboardFile = getTeamLeaderboardFile();
  } else {
    leaderboardFile = getLeaderboardFile();
  }
  const ctx = getExtensionContext();
  let cachedUserId = ctx.globalState.get(GLOBAL_STATE_USER_ID);
  let leaderBoardContent = '';
  if (isTeam) {
    leaderBoardContent += 'LEADERBOARD \t (Private)\n\n';
  } else {
    leaderBoardContent += 'LEADERBOARD \t (Global)\n\n';
  }

  let scoreMap = [];

  users.map((user) => {
    let obj = {};
    obj['id'] = user.id;
    obj['name'] = user['name'];
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

    if (i == 0) {
      rankNumberSection += '\uD83E\uDD47 ';
    } else if (i == 1) {
      rankNumberSection += '\uD83E\uDD48 ';
    } else if (i == 2) {
      rankNumberSection += '\uD83E\uDD49 ';
    } else {
      rankNumberSection += '';
    }
    if (cachedUserId == user.id) {
      username = user.name;

      rankNumberSection = i + 1 + ' ' + rankNumberSection;

      rankSection +=
        rankNumberSection.padEnd(MAX_RANK_LENGTH, ' ') +
        '\t\t' +
        (user.name + ' (YOU)').padEnd(MAX_USERNAME_LENGTH, ' ') +
        '\t\t' +
        user.score +
        '\n';
    } else {
      rankNumberSection = i + 1 + ' ' + rankNumberSection;

      rankSection +=
        rankNumberSection.padEnd(MAX_RANK_LENGTH, ' ') +
        '\t\t' +
        user.name.padEnd(MAX_USERNAME_LENGTH, ' ') +
        '\t\t' +
        user.score +
        '\n';
    }
  });

  teamname =
    ctx.globalState.get(GLOBAL_STATE_USER_TEAM_NAME) !== undefined
      ? ctx.globalState.get(GLOBAL_STATE_USER_TEAM_NAME)
      : '______';

  leaderBoardContent += 'Username \t : \t ' + username + '\n';
  leaderBoardContent += 'Teamname \t : \t ' + teamname + '\n\n';

  leaderBoardContent += SECTION_BAR;
  leaderBoardContent += 'LEADERBOARD RANKING \n';
  leaderBoardContent += SECTION_BAR + '\n';

  leaderBoardContent +=
    'RANK'.padEnd(MAX_RANK_LENGTH, ' ') +
    '\t\t' +
    'NAME'.padEnd(MAX_USERNAME_LENGTH, ' ') +
    '\t\tSCORE\n';
  leaderBoardContent +=
    '----'.padEnd(MAX_RANK_LENGTH, ' ') +
    '\t\t' +
    '----'.padEnd(MAX_USERNAME_LENGTH, ' ') +
    '\t\t-----\n';
  leaderBoardContent += rankSection + '\n';

  //STATS HERE, TODO

  leaderBoardContent += SECTION_BAR;
  leaderBoardContent += 'Metric \n';
  leaderBoardContent += SECTION_BAR + '\n';
  console.log(scoreMap);
  leaderBoardContent += 'Each second spent coding        + 0.01 \n';
  leaderBoardContent += 'Each keystroke                  +    1 \n';
  leaderBoardContent += 'Each modified line              +   10 \n';

  fs.writeFileSync(leaderboardFile, leaderBoardContent, (err) => {
    if (err) {
      console.error('Error writing leaderboard');
    }
  });
}
