"use strict";
//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//
Object.defineProperty(exports, "__esModule", { value: true });
const Utility_1 = require("../../src/util/Utility");
const Leaderboard_1 = require("../../src/util/Leaderboard");
const Metric_1 = require("../../src/util/Metric");
// The module 'assert' provides assertion methods from node
const assert = require('chai').assert;
suite('utilities.ts', () => {
    test('generating random name', () => {
        const result = Utility_1.generateRandomName();
        assert.typeOf(result, 'string');
    });
    test('generating random int', () => {
        assert.equal(Utility_1.getRandomInt(1), 0);
        assert.equal(Utility_1.getRandomInt(0), 0);
        assert.equal(Utility_1.getRandomInt(100) <= 100, true);
    });
    test('generating random email', () => {
        assert.equal(Utility_1.generateRandomEmail().includes('@'), true);
    });
});
suite('leaderboard.ts', () => {
    test('adding user to empty leaderboard', () => {
        const id = 654;
        const userObj = null;
        console.log(Leaderboard_1.Leaderboard);
        Leaderboard_1.Leaderboard.addUser(id, userObj);
        assert.equal(Leaderboard_1.Leaderboard.getUsers().length, 1);
    });
    test('getting global leadboard file', () => {
        const leaderboardPath = Leaderboard_1.getLeaderboardFile().toString();
        assert.equal(leaderboardPath.includes("\\leaderboard.txt") || leaderboardPath.includes("/leaderboard.txt"), true);
    });
    test('getting team leadboard file', () => {
        const leaderboardPath = Leaderboard_1.getTeamLeaderboardFile().toString();
        assert.equal(leaderboardPath.includes("\\team_leaderboard.txt") || leaderboardPath.includes("/team_leaderboard.txt"), true);
    });
    //integration test of leaderboard displaying
});
suite('metric.ts', () => {
    test('score calculations with small metrics', () => {
        const userStats = {};
        userStats['timeInterval'] = 0;
        userStats['keystrokes'] = 0;
        userStats['linesChanged'] = 0;
        var score = Metric_1.scoreCalculation(userStats);
        assert.equal(score, 10);
        userStats['timeInterval'] = -1;
        userStats['keystrokes'] = -1;
        userStats['linesChanged'] = -1;
        score = Metric_1.scoreCalculation(userStats);
        assert.equal(score, 7.99);
    });
    test('score calculations with large metrics', () => {
        const userStats = {};
        userStats['timeInterval'] = 100000;
        userStats['keystrokes'] = 100000;
        userStats['linesChanged'] = 100000;
        var score = Metric_1.scoreCalculation(userStats);
        assert.equal(score, 201010);
        userStats['timeInterval'] = 100000;
        userStats['keystrokes'] = 100000;
        userStats['linesChanged'] = -100000;
        score = Metric_1.scoreCalculation(userStats);
        assert.equal(score, 101010);
    });
});
//# sourceMappingURL=extension.test.js.map