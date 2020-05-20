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
import {Leaderboard} from '../../src/util/Leaderboard';

// The module 'assert' provides assertion methods from node
const assert = require('chai').assert;
suite('Extension Test Suite', () => {
  test('utilities.js', () => {
    const result = generateRandomName();
    assert.typeOf(result, 'string');

    assert.equal(getRandomInt(1), 0);

    assert.equal(getRandomInt(0), 0);

    assert.equal(getRandomInt(100) <= 100, true);

    assert.equal(generateRandomEmail().includes('@'), true);
  });

  test('authentication.ts', () => {
    console.log(Leaderboard);

    //console.log(clearCachedUserId);

    //console.log(authenticateUser);
  });

  test('leaderboard.ts', () => {
    //const id : Number = 654;
    //const userObj = null;
    //console.log(Leaderboard);
    //Leaderboard.addUser(id, userObj);
    //assert.equal(Leaderboard.getUsers().length, 1);
  });
});
