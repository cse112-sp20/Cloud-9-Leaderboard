"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scoreCalculation = exports.processMetric = void 0;
const Constants_1 = require("./Constants");
/*
 * Function for extract codetime payload for leaderboard metric
 */
function processMetric(obj) {
    // Uncomment below to see what raw payload looks like
    // need to wait to show up in debug console
    console.log(obj);
    // aggregator from codeTime Payload
    const metric = {};
    metric['keystrokes'] = obj.keystrokes;
    metric['linesChanged'] = 0;
    metric['timeInterval'] = obj.elapsed_seconds;
    for (let filename in obj.source) {
        let file = obj.source[filename];
        if (file) {
            if ('linesAdded' in file) {
                metric['linesChanged'] += file['linesAdded'];
            }
            if ('linesRemoved' in file) {
                metric['linesChanged'] += file['linesRemoved'];
            }
        }
    }
    return metric;
}
exports.processMetric = processMetric;
/*
 * Aggregate collected stats and calculate score
 */
function scoreCalculation(userStats) {
    // TODO : user stats to score
    let score = 0;
    score += userStats['timeInterval'] * Constants_1.timeMultiplier;
    score += userStats['keystrokes'] * Constants_1.keystrokeMultplier;
    score += userStats['linesChanged'] + Constants_1.linesMultiplier;
    return score;
}
exports.scoreCalculation = scoreCalculation;
//# sourceMappingURL=Metric.js.map