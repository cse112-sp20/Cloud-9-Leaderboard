//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

import {
  generateRandomName,
  getRandomInt,
  generateRandomEmail,
} from '../../src/util/Utility';
import {getExtensionContext} from '../../src/util/Authentication';
import {Leaderboard, getLeaderboardFile, getTeamLeaderboardFile} from '../../src/util/Leaderboard';
import { scoreCalculation } from '../../src/util/Metric';

// The module 'assert' provides assertion methods from node
const assert = require('chai').assert;
suite('utilities.ts', () => {
  test('generating random name', () => {
    const result = generateRandomName();
    assert.typeOf(result, 'string');
  });

  test('generating random int', () => {
    assert.equal(getRandomInt(1), 0);

    assert.equal(getRandomInt(0), 0);

    assert.equal(getRandomInt(100) <= 100, true);
  });
  
  test('generating random email', () => {
    assert.equal(generateRandomEmail().includes('@'), true);
  });  
});

suite('leaderboard.ts', () => {
  test('adding user to empty leaderboard', () => {
    const id : Number = 654;
    const userObj = null;
    console.log(Leaderboard);
    Leaderboard.addUser(id, userObj);
    assert.equal(Leaderboard.getUsers().length, 1);
  });

  test('getting global leadboard file', () => {
    const leaderboardPath: string = getLeaderboardFile().toString();
    assert.equal(leaderboardPath.includes("\\leaderboard.txt") || leaderboardPath.includes("/leaderboard.txt"), true);
  });

  test('getting team leadboard file', () => {
    const leaderboardPath: string = getTeamLeaderboardFile().toString();
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

    var score = scoreCalculation(userStats);
    assert.equal(score, 10)

    userStats['timeInterval'] = -1;
    userStats['keystrokes'] = -1;
    userStats['linesChanged'] = -1;    

    score = scoreCalculation(userStats);
    assert.equal(score, 7.99)
  });

  test('score calculations with large metrics', () => {
    const userStats = {};
    userStats['timeInterval'] = 100000;
    userStats['keystrokes'] = 100000;
    userStats['linesChanged'] = 100000;

    var score = scoreCalculation(userStats);
    assert.equal(score, 201010)

    userStats['timeInterval'] = 100000;
    userStats['keystrokes'] = 100000;
    userStats['linesChanged'] = -100000;    

    score = scoreCalculation(userStats);
    assert.equal(score, 1010)
  });

  //process metric test needed (don't know what payload looks like yet)
});