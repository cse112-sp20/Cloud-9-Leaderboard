//
// Note: This example test is leveraging the Mocha test framework.
// Please refer to their documentation on https://mochajs.org/ for help.
//

import { generateRandomName, getRandomInt } from "../src/util/Utility";
import { Leaderboard } from "../src/util/Leaderboard";
import {window, ExtensionContext} from 'vscode';


// The module 'assert' provides assertion methods from node

const sinon = require('sinon');
const assert = require('chai').assert;

var stub = sinon.stub()

describe('utilities.js', () => {
    const result = generateRandomName();
    it('generating random name', () => {
      assert.typeOf(result, 'string');
    })

    it('generating random int, ceiling 1', () => {
        assert.equal(getRandomInt(1), 0);
    })

    it('generating random int, ceiling 0', () => {
        assert.equal(getRandomInt(0), 0);
    })

    it('generating random int, ceiling 100', () => {
        assert.equal(getRandomInt(100) <= 100, true);
    })
});

describe('leaderboard.ts', () => {
    it('adding user to empty leaderboard', () => {
        const id : Number = 654;
        const userObj = null;
        Leaderboard.addUser(id, userObj);
        assert.equal(Leaderboard.getUsers().length, 1);
    })
});
