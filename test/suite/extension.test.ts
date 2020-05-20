import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import {Leaderboard} from './../../src/util/Leaderboard';
import {sumT} from "./../../src/util/sumT";

import * as vscode from 'vscode';
// import * as myExtension from '../extension';

suite('Extension Test Suite', () => {
  vscode.window.showInformationMessage('Start all tests.');

  test('Sample test', () => {
    assert.equal(-1, [1, 2, 3].indexOf(5));
    assert.equal(-1, [1, 2, 3].indexOf(0));

    assert.equal(3, sumT(1,2));
    console.log(Leaderboard);
  });


  test('Sum test', () => {
   

    assert.equal(3, sumT(1,2));
 
  });
});
