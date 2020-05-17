"use strict";
//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//
Object.defineProperty(exports, "__esModule", { value: true });
const Utility_1 = require("../src/util/Utility");
const Leaderboard_1 = require("../src/util/Leaderboard");
// The module 'assert' provides assertion methods from node
const sinon = require('sinon');
const assert = require('chai').assert;
var stub = sinon.stub();
describe('utilities.js', () => {
    const result = Utility_1.generateRandomName();
    it('generating random name', () => {
        assert.typeOf(result, 'string');
    });
    it('generating random int, ceiling 1', () => {
        assert.equal(Utility_1.getRandomInt(1), 0);
    });
    it('generating random int, ceiling 0', () => {
        assert.equal(Utility_1.getRandomInt(0), 0);
    });
    it('generating random int, ceiling 100', () => {
        assert.equal(Utility_1.getRandomInt(100) <= 100, true);
    });
});
describe('leaderboard.ts', () => {
    it('adding user to empty leaderboard', () => {
        const id = 654;
        const userObj = null;
        Leaderboard_1.Leaderboard.addUser(id, userObj);
        assert.equal(Leaderboard_1.Leaderboard.getUsers().length, 1);
    });
});
//# sourceMappingURL=extension.test.js.map