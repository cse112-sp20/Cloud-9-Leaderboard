import { window } from "vscode";

/*
 * Function for extract codetime payload for leaderboard metric
 */
export function processMetric(obj) {
  // Uncomment below to see what raw payload looks like
  // need to wait to show up in debug console
  console.log(obj);

  // aggregator from codeTime Payload
  const metric = {};
  metric["keystrokes"] = obj.keystrokes;
  metric["linesChanged"] = 0;
  metric["timeInterval"] = obj.elapsed_seconds;

  for (let filename in obj.source) {
    let file = obj.source[filename];
    if (file) {
      if ("linesAdded" in file) {
        metric["linesChanged"] += file["linesAdded"];
      }
      if ("linesRemoved" in file) {
        metric["linesChanged"] += file["linesRemoved"];
      }
    }
  }

  return metric;
}

/*
 * Aggregate collected stats and calculate score
 */
export function scoreCalculation(userStats) {
  // TODO : user stats to score
  let score = 0;
  score += userStats["timeInterval"] * 0.01;
  score += userStats["keystrokes"] * 1;
  score += userStats["linesChanged"] + 10;
  return score;
}
