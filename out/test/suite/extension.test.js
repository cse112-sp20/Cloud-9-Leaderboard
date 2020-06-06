"use strict";
//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//
Object.defineProperty(exports, "__esModule", { value: true });
const Utility_1 = require("../../src/util/Utility");
const Leaderboard_1 = require("../../src/util/Leaderboard");
// The module 'assert' provides assertion methods from node
const assert = require("chai").assert;
suite("Extension Test Suite", () => {
    test("utilities.js", () => {
        const result = Utility_1.generateRandomName();
        assert.typeOf(result, "string");
        assert.equal(Utility_1.getRandomInt(1), 0);
        assert.equal(Utility_1.getRandomInt(0), 0);
        assert.equal(Utility_1.getRandomInt(100) <= 100, true);
        assert.equal(Utility_1.generateRandomEmail().includes("@"), true);
    });
    test("authentication.ts", () => {
        console.log(Leaderboard_1.Leaderboard);
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
//# sourceMappingURL=extension.test.js.map