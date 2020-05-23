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

  content += 'Personal Statistics \n\n';
  content += SECTION_BAR;
  content += 'How to gain points \n';
  content += SECTION_BAR + '\n';
  content += 'Each second spent coding        + 0.01 \n';
  content += 'Each keystroke                  +    1 \n';
  content += 'Each modified line              +   10 \n\n';

  content += SECTION_BAR;
  content += 'Record\n';
  content += SECTION_BAR + '\n';

  let FIELD_LENGTH = 12;

  content +=
    'Dates'.padEnd(FIELD_LENGTH, ' ') +
    '\t' +
    'Keystrokes'.padEnd(FIELD_LENGTH, ' ') +
    '\t' +
    'LinesChanged'.padEnd(FIELD_LENGTH, ' ') +
    '\t' +
    'TimeInterval'.padEnd(FIELD_LENGTH, ' ') +
    '\t' +
    'Points'.padEnd(FIELD_LENGTH, ' ') +
    '\n';

  scoreMap.map((obj, i) => {
    content +=
      obj['dateStr'].toString().padEnd(FIELD_LENGTH, ' ') +
      '\t' +
      obj['keystrokes'].toString().padEnd(FIELD_LENGTH, ' ') +
      '\t' +
      obj['linesChanged'].toString().padEnd(FIELD_LENGTH, ' ') +
      '\t' +
      obj['timeInterval'].toString().padEnd(FIELD_LENGTH, ' ') +
      '\t' +
      obj['points'].toString().padEnd(FIELD_LENGTH, ' ') +
      '\n';
  });

  content += '\n' + SECTION_BAR;
  content += 'Statistics\n';
  content += SECTION_BAR + '\n';

  let statsObj = calculateStats(scoreMap);

  let STAT_LENGTH = 30;

  content +=
    'Daily Average Keystrokes'.padEnd(STAT_LENGTH, ' ') +
    statsObj['kpd'].toFixed(3) +
    '\n';
  content +=
    'Daily Average Lines Changed'.padEnd(STAT_LENGTH, ' ') +
    statsObj['lcpd'].toFixed(3) +
    '\n';
  content +=
    'Daily Average Time Spent'.padEnd(STAT_LENGTH, ' ') +
    statsObj['tspd'].toFixed(3) +
    '\n';
  content +=
    'Daily Average Points'.padEnd(STAT_LENGTH, ' ') +
    statsObj['ppd'].toFixed(3) +
    '\n';

  content +=
    'Keystrokes per minute'.padEnd(STAT_LENGTH, ' ') +
    statsObj['kpm'].toFixed(3) +
    '\n';
  content +=
    'Lines per minute'.padEnd(STAT_LENGTH, ' ') +
    statsObj['lpm'].toFixed(3) +
    '\n';

  fs.writeFileSync(personalStatsFile, content, (err) => {
    if (err) {
      console.error('Error writing leaderboard');
    }
  });
}
