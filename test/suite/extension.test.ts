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

// The module 'assert' provides assertion methods from node
const assert = require('chai').assert;
suite('utilities.js', () => {
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

suite('leaderboard.js', () => {
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
