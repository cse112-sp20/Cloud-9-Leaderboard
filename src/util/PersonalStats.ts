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

import {workspace, window, ViewColumn} from 'vscode';
import {getSoftwareDir, isWindows} from '../../lib/Util';
import {retrieveUserStats} from './Firestore';
import {scoreCalculation, calculateStats} from './Metric';
import {stat} from 'fs';
import {getExtensionContext} from './Authentication';
import {
  GLOBAL_STATE_USER_ID,
  MAX_USERNAME_LENGTH,
  MAX_RANK_LENGTH,
  SECTION_BAR,
  STAT_LENGTH,
  FIELD_LENGTH,
  PERSONAL_STATISTIC_ROW_1,
  PERSONAL_STATISTIC_ROW_2,
  PERSONAL_STATISTIC_ROW_3,
  PERSONAL_STATISTIC_ROW_4,
  PERSONAL_STATISTIC_ROW_5,
  WECOME_TO_CLOUD9_ROW_1,
  WECOME_TO_CLOUD9_ROW_2,
  WECOME_TO_CLOUD9_ROW_3,
  WECOME_TO_CLOUD9_ROW_4,
  WECOME_TO_CLOUD9_ROW_5,
  ACHIEVEMENT_ROW_1,
  ACHIEVEMENT_ROW_2,
  ACHIEVEMENT_ROW_3,
  ACHIEVEMENT_ROW_4,
  ACHIEVEMENT_ROW_5,
} from './Constants';
const fs = require('fs');

export class PersonalStats {
  private static dates: Array<Object>;

  constructor() {}

  public static addDayStats(date, statsObj) {
    if (!PersonalStats.dates) {
      PersonalStats.dates = [];
    }
    let dateObj = new Object();
    dateObj['date'] = date;
    for (let key in statsObj) {
      dateObj[key] = statsObj;
    }
    PersonalStats.dates.push(dateObj);
  }

  public static getUsers() {
    return PersonalStats.dates;
  }
}

export function getPersonalStatsFile() {
  let filePath = getSoftwareDir();
  if (isWindows()) {
    filePath += '\\personal_statistics.txt';
  } else {
    filePath += '/personal_statistics.txt';
  }
  return filePath;
}

export async function displayPersonalStats() {
  // 1st write the code time metrics dashboard file
  // await writeLeaderboard();
  await retrieveUserStats(writePersonalStatsFile);

  let filePath = getPersonalStatsFile();

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

async function writePersonalStatsFile(dates) {
  let personalStatsFile = getPersonalStatsFile();

  const ctx = getExtensionContext();

  let scoreMap = [];

  dates.map((date) => {
    let obj = {};
    obj['dateStr'] = date.date;
    obj['keystrokes'] = date['keystrokes'];
    obj['points'] = parseFloat(date['points']).toFixed(3);
    obj['linesChanged'] = date['linesChanged'];
    obj['timeInterval'] = date['timeInterval'];
    obj['date'] = new Date(date.date);
    scoreMap.push(obj);
  });

  scoreMap.sort(function (a, b) {
    return b.date - a.date;
  });

  console.log(scoreMap);

  let content = '';

  content += WECOME_TO_CLOUD9_ROW_1;
  content += WECOME_TO_CLOUD9_ROW_2;
  content += WECOME_TO_CLOUD9_ROW_3;
  content += WECOME_TO_CLOUD9_ROW_4;
  content += WECOME_TO_CLOUD9_ROW_5;

  content += SECTION_BAR;
  content += 'How to gain points \n';
  content += SECTION_BAR + '\n';
  content +=
    'Each second spent coding:                            + 0.01 points per second \n';
  content +=
    'Each keystroke:                                      +    1 points per keystroke\n';
  content +=
    'Each modified line:                                  +   10 points per line \n\n';

  // content += PERSONAL_STATISTIC_ROW_1;
  // content += PERSONAL_STATISTIC_ROW_2;
  // content += PERSONAL_STATISTIC_ROW_3;
  // content += PERSONAL_STATISTIC_ROW_4;
  // content += PERSONAL_STATISTIC_ROW_5;

  content += SECTION_BAR;
  content += 'Record\n';
  content += SECTION_BAR + '\n';

  // content +=
  //   'Dates'.padEnd(FIELD_LENGTH, ' ') +
  //   '\t' +
  //   'Keystrokes'.padEnd(FIELD_LENGTH, ' ') +
  //   '\t' +
  //   'LinesChanged'.padEnd(FIELD_LENGTH, ' ') +
  //   '\t' +
  //   'TimeInterval'.padEnd(FIELD_LENGTH, ' ') +
  //   '\t' +
  //   'Points'.padEnd(FIELD_LENGTH, ' ') +
  //   '\n';

  // scoreMap.map((obj, i) => {
  //   content +=
  //     obj['dateStr'].toString().padEnd(FIELD_LENGTH, ' ') +
  //     '\t' +
  //     obj['keystrokes'].toString().padEnd(FIELD_LENGTH, ' ') +
  //     '\t' +
  //     obj['linesChanged'].toString().padEnd(FIELD_LENGTH, ' ') +
  //     '\t' +
  //     obj['timeInterval'].toString().padEnd(FIELD_LENGTH, ' ') +
  //     '\t' +
  //     obj['points'].toString().padEnd(FIELD_LENGTH, ' ') +
  //     '\n';
  // });

  let previousScore: number = -1;
  let currentScore: number = 0;

  let counter = 1;

  let mapSize = scoreMap.length;

  console.log(mapSize);

  scoreMap.map((obj, i) => {
    if (i + 1 >= mapSize) {
      currentScore = +obj['points'];
      previousScore = 0;
    } else {
      currentScore = +obj['points'];
      previousScore = +scoreMap[i + 1]['points'];
    }

    let scoreDifference = currentScore - previousScore;
    if (scoreDifference >= 0) {
      content += obj['dateStr'] + ' 🟢🟢🟢🟢🟢' + '\n';
    } else {
      content += obj['dateStr'] + ' 🔴🔴🔴🔴🔴' + '\n';
      counter = 1;
    }

    content +=
      '___________________________________________________________________________________________\n';
    content +=
      '    Keystrokes per minute :'.padEnd(40, ' ') +
      obj['keystrokes'].toString().padEnd(FIELD_LENGTH, ' ') +
      '\t' +
      '|'.padEnd(FIELD_LENGTH, ' ') +
      '\t' +
      obj['points'] +
      ' points\n';
    content +=
      '      Lines of code added :'.padEnd(40, ' ') +
      obj['linesChanged'].toString().padEnd(FIELD_LENGTH, ' ') +
      '\t' +
      '|'.padEnd(FIELD_LENGTH, ' ') +
      '\t' +
      obj['points'] +
      ' points\n';
    content +=
      '         Active code time :'.padEnd(40, ' ') +
      obj['timeInterval'].toString().padEnd(FIELD_LENGTH, ' ') +
      '\t' +
      '|'.padEnd(FIELD_LENGTH, ' ') +
      '\t' +
      obj['points'] +
      ' points\n';
    content += '\n';
  });

  content += '\n' + SECTION_BAR;
  content += 'Statistics\n';
  content += SECTION_BAR + '\n';

  let statsObj = calculateStats(scoreMap);

  content +=
    'Daily Average Keystrokes:'.padEnd(STAT_LENGTH, ' ') +
    statsObj['kpd'].toFixed(3) +
    '\n';
  content +=
    'Daily Average Lines Changed:'.padEnd(STAT_LENGTH, ' ') +
    statsObj['lcpd'].toFixed(3) +
    '\n';
  content +=
    'Daily Average Time Spent:'.padEnd(STAT_LENGTH, ' ') +
    statsObj['tspd'].toFixed(3) +
    '\n';
  content +=
    'Daily Average Points:'.padEnd(STAT_LENGTH, ' ') +
    statsObj['ppd'].toFixed(3) +
    '\n';

  content +=
    'Keystrokes per minute:'.padEnd(STAT_LENGTH, ' ') +
    statsObj['kpm'].toFixed(3) +
    '\n';
  content +=
    'Lines per minute:'.padEnd(STAT_LENGTH, ' ') +
    statsObj['lpm'].toFixed(3) +
    '\n';

  content += ACHIEVEMENT_ROW_1;
  content += ACHIEVEMENT_ROW_2;
  content += ACHIEVEMENT_ROW_3;
  content += ACHIEVEMENT_ROW_4;
  content += ACHIEVEMENT_ROW_5;

  content +=
    'These are personal achievements/milestones that you have accumulated\n\n';

  fs.writeFileSync(personalStatsFile, content, (err) => {
    if (err) {
      console.error('Error writing leaderboard');
    }
  });
}
