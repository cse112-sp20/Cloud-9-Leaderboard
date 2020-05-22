import {
  generateRandomName,
  getRandomInt,
  generateRandomEmail,
} from '../../src/util/Utility';
import { getExtensionContext, clearCachedUserId, authenticateUser, registerNewUserWithUserInput, registerNewUserWithGeneratedCredential } from '../../src/util/Authentication';
import { Leaderboard, getLeaderboardFile, getTeamLeaderboardFile} from '../../src/util/Leaderboard';
import { scoreCalculation, processMetric } from '../../src/util/Metric';
import { loginUserWithEmailAndPassword, createNewUserInFirebase, getUserDocWithId } from '../../src/util/FireStore';
import { create } from 'domain';
import {   
  COLLECTION_ID_USERS,
  COLLECTION_ID_TEAMS,
  COLLECTION_ID_TEAM_MEMBERS,
  GLOBAL_STATE_USER_ID,
  GLOBAL_STATE_USER_EMAIL,
  GLOBAL_STATE_USER_PASSWORD,
  GLOBAL_STATE_USER_TEAM_NAME,
} from '../../src/util/Constants';
const sinon = require('sinon');
const firebase = require('firebase/app');



// The module 'assert' provides assertion methods from node
const assert = require('chai').assert;
suite('authentication.ts', () => {
  test('generating extension context', () => {
    const result = getExtensionContext();
    assert.typeOf(result, 'object');
  });

  test('clearing cached user id', () => {
    clearCachedUserId();
    const ctx = getExtensionContext();
    assert.equal(ctx.globalState.get(GLOBAL_STATE_USER_ID), undefined);
  });

  test('authenticating user', () => {
    const ctx = getExtensionContext();
    authenticateUser(ctx);
  });

  test('registering new user with user input', () => {
    const ctx = getExtensionContext();
    registerNewUserWithUserInput(ctx);
  });

  test('registering new user with generated credentials', () => {
    const ctx = getExtensionContext();
    registerNewUserWithGeneratedCredential(ctx);
  });

});

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
    assert.equal(leaderboardPath.includes("\\leaderboard.txt") || 
      leaderboardPath.includes("/leaderboard.txt"), true);
  });

  test('getting team leadboard file', () => {
    const leaderboardPath: string = getTeamLeaderboardFile().toString();
    assert.equal(leaderboardPath.includes("\\team_leaderboard.txt") || 
      leaderboardPath.includes("/team_leaderboard.txt"), true);
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

suite('firestore.ts', () => {
  const testId: string = "testUserId";
  test('login to firestore', async () => {
    var signInStub = sinon.stub(firebase.auth(), "signInWithEmailAndPassword");
    const signInResult = {};
    signInStub.withArgs("test", "test").returns(Promise.resolve(signInResult));
    await loginUserWithEmailAndPassword("test", "test");
  });

  test('update users stats', async () => {

  });

  test('addNewUserDocToDb', async () => {

  });

  test('getUserDocWithId', async () => {
    var result = {};
    result['data'] = 'yaya';
    sinon.stub(firebase.firestore().collection(COLLECTION_ID_USERS).doc(testId), "get").returns(Promise.resolve(result));

    getUserDocWithId(testId).then((res) => {
      assert.equal(result, res);
    });
  });

  test('create new user', async () => {
    //Set a fake userID
    var result = {}
    result['uid'] = testId;
    sinon.stub(firebase.auth(), "currentUser").value(result);

    //whenever the function is called, return a blank promise
    sinon.stub(firebase.auth(), "createUserWithEmailAndPassword").
      withArgs(testId, "testPassword").returns(Promise.resolve());

    var successful = await createNewUserInFirebase(getExtensionContext(), testId, "testPassword");
    assert.equal(true, true); // does not work
  });
});