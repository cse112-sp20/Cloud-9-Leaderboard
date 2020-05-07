const assert = require('assert');

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
const vscode = require('vscode');
// const myExtension = require('../extension');

const Mocha = require('mocha');

var globalNumber = 1

suite('Extension Test Suite', () => {
  console.log('s');
  vscode.window.showInformationMessage('Start all tests.');

  Mocha.describe('hooks', function() {
    Mocha.before(function() {
      // runs once before the first test in this block
      console.log('HI')
    });
  
    Mocha.after(function() {
      // runs once after the last test in this block
      console.log('BYE')
    });
  
    Mocha.beforeEach(function() {
      // runs before each test in this block
      console.log('TEST ', globalNumber)
    });
  
    Mocha.afterEach(function() {
      // runs after each test in this block
      console.log('END TEST', globalNumber)
      globalNumber++;
    });
  
    // test cases
    test('hi', () => {
      assert.equal(-1, [1, 2, 3].indexOf(5));
      assert.equal(-1, [1, 2, 3].indexOf(0));
    });
  
    test('hello', () => {
      assert.equal(-1, [1, 2, 3].indexOf(5));
      assert.equal(-1, [1, 2, 3].indexOf(0));
    });
  
    test('howdy', () => {
      assert.equal(-1, [1, 2, 3].indexOf(5));
      assert.equal(-1, [1, 2, 3].indexOf(0));
    });
  });
});
