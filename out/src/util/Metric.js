"use strict";
/**
 * Summary. (use period)
 *
 * Description. (use period)
 *
 * @link   URL
 * @file   This files defines the MyClass class.
 * @author AuthorName.
 * @since  x.x.x
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateStats = exports.scoreCalculation = exports.processMetric = void 0;
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
/*
 * Calculate daily averages and kpm, lpm, lpk
 */
function calculateStats(scoreMap) {
    let totalValues = {
        keystrokes: 0,
        points: 0,
        linesChanged: 0,
        timeInterval: 0,
    };
    scoreMap.map((item) => {
        totalValues['keystrokes'] += item['keystrokes'];
        totalValues['points'] += parseFloat(item['points']);
        totalValues['linesChanged'] += item['linesChanged'];
        totalValues['timeInterval'] += item['timeInterval'];
    });
    let statsObj = {};
    let days = scoreMap.length;
    statsObj['kpd'] = totalValues['keystrokes'] / days;
    statsObj['lcpd'] = totalValues['linesChanged'] / days;
    statsObj['tspd'] = totalValues['timeInterval'] / days;
    statsObj['ppd'] = totalValues['points'] / days;
    statsObj['kpm'] =
        totalValues['keystrokes'] / (totalValues['timeInterval'] / 60);
    statsObj['lpm'] =
        totalValues['linesChanged'] / (totalValues['timeInterval'] / 60);
    return statsObj;
}
exports.calculateStats = calculateStats;
//# sourceMappingURL=Metric.js.map