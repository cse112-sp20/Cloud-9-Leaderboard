//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

import {
  generateRandomName,
} from "../../src/util/Utility";
import {getExtensionContext} from "../../src/util/Authentication";
import {Leaderboard} from "../../src/util/Leaderboard";

// The module 'assert' provides assertion methods from node
const assert = require("chai").assert;
suite("Extension Test Suite", () => {
  test("utilities.js", () => {
    const result = generateRandomName();
    assert.typeOf(result, "string");
  });

  test("authentication.ts", () => {
    console.log(Leaderboard);

    //console.log(clearCachedUserId);

    //console.log(authenticateUser);
  });

  test("leaderboard.ts", () => {
    //const id : Number = 654;
    //const userObj = null;
    //console.log(Leaderboard);
    //Leaderboard.addUser(id, userObj);
    //assert.equal(Leaderboard.getUsers().length, 1);
  });
});
