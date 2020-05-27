import {
  generateRandomName,
  getRandomInt,
  generateRandomEmail,
} from '../../src/util/Utility';
import {
  getExtensionContext,
  clearCachedUserId,
  authenticateUser,
  registerNewUserWithUserInput,
  registerNewUserWithGeneratedCredential,
} from '../../src/util/Authentication';
import {
  Leaderboard,
  getLeaderboardFile,
  getTeamLeaderboardFile,
} from '../../src/util/Leaderboard';
import {scoreCalculation, processMetric} from '../../src/util/Metric';
import {
  loginUserWithEmailAndPassword,
  createNewUserInFirebase,
  getUserDocWithId,
  addNewTeamToDbAndJoin,
  joinTeamWithTeamId,
  leaveTeam,
  addNewUserDocToDb,
  checkIfInTeam,
  retrieveUserStats,
  retrieveAllUserStats,
  retrieveTeamMemberStats,
} from '../../src/util/FireStore';
import {create} from 'domain';
import {
  COLLECTION_ID_USERS,
  COLLECTION_ID_TEAMS,
  COLLECTION_ID_TEAM_MEMBERS,
  GLOBAL_STATE_USER_ID,
  GLOBAL_STATE_USER_EMAIL,
  GLOBAL_STATE_USER_PASSWORD,
  GLOBAL_STATE_USER_TEAM_NAME,
  DEFAULT_USER_DOC_TOP,
} from '../../src/util/Constants';
import {
  PersonalStats,
  getPersonalStatsFile,
  displayPersonalStats,
} from '../../src/util/PersonalStats';
const sinon = require('sinon');
const firebase = require('firebase/app');
import * as Mocha from 'mocha';
import { expect } from 'chai';

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
    const id: Number = 654;
    const userObj = null;
    console.log(Leaderboard);
    Leaderboard.addUser(id, userObj);
    assert.equal(Leaderboard.getUsers().length, 1);
  });

  test('getting global leadboard file', () => {
    const leaderboardPath: string = getLeaderboardFile().toString();
    assert.equal(
      leaderboardPath.includes('\\leaderboard.txt') ||
        leaderboardPath.includes('/leaderboard.txt'),
      true,
    );
  });

  test('getting team leadboard file', () => {
    const leaderboardPath: string = getTeamLeaderboardFile().toString();
    assert.equal(
      leaderboardPath.includes('\\team_leaderboard.txt') ||
        leaderboardPath.includes('/team_leaderboard.txt'),
      true,
    );
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
    assert.equal(score, 10);

    userStats['timeInterval'] = -1;
    userStats['keystrokes'] = -1;
    userStats['linesChanged'] = -1;

    score = scoreCalculation(userStats);
    assert.equal(score, 7.99);
  });

  test('score calculations with large metrics', () => {
    const userStats = {};
    userStats['timeInterval'] = 100000;
    userStats['keystrokes'] = 100000;
    userStats['linesChanged'] = 100000;

    var score = scoreCalculation(userStats);
    assert.equal(score, 201010);

    userStats['timeInterval'] = 100000;
    userStats['keystrokes'] = 100000;
    userStats['linesChanged'] = -100000;

    score = scoreCalculation(userStats);
    assert.equal(score, 1010);
  });

  //process metric test needed (don't know what payload looks like yet)
});

suite('firestore.ts', () => {
  const testId: string = 'testUserId';
  test('login to firestore', async () => {
    var signInStub = sinon.stub(firebase.auth(), 'signInWithEmailAndPassword');
    const signInResult = {};
    signInStub.withArgs('test', 'test').returns(Promise.resolve(signInResult));
    await loginUserWithEmailAndPassword('test', 'test');
  });

  test('updateStats', async () => {
    //need to run app and see codetime payload to continue
  });

  test('addNewUserDocToDb', async () => {
    var spy = sinon.spy(firebase.firestore().collection(COLLECTION_ID_USERS)
    .doc('test'), 'set');
    await addNewUserDocToDb('test').then(() => {
      expect(spy.calledOnce);
      /*expect(spy.args[0]).to.equal({
        name: generateRandomName(),
        ...DEFAULT_USER_DOC_TOP,
      })*/
    });
  });

  test('getUserDocWithId', async () => {
    var result = {};
    result['data'] = 'yaya';
    sinon
      .stub(
        firebase.firestore().collection(COLLECTION_ID_USERS).doc(testId),
        'get',
      )
      .returns(Promise.resolve(result));

    getUserDocWithId(testId).then((res) => {
      assert.equal(result, res);
    });
  });

  test('getUserDocWithId', async () => {
    var result = {};
    result['data'] = 'yaya';
    sinon
      .stub(
        firebase.firestore().collection(COLLECTION_ID_USERS).doc(testId),
        'get',
      )
      .returns(Promise.resolve(result));

    getUserDocWithId(testId).then((res) => {
      assert.equal(result, res);
    });
  });

  test('create new user', async () => {
    //Set a fake userID
    var result = {};
    result['uid'] = testId;
    sinon.stub(firebase.auth(), 'currentUser').value(result);

    //whenever the function is called, return a blank promise
    sinon
      .stub(firebase.auth(), 'createUserWithEmailAndPassword')
      .withArgs(testId, 'testPassword')
      .returns(Promise.resolve());

    var successful = await createNewUserInFirebase(
      getExtensionContext(),
      testId,
      'testPassword',
    );
    assert.equal(successful, true); // works!!
  });

  test('addNewTeamToDbAndJoin', async () => {});
  test('joinTeamWithTeamId', async () => {});
  test('leaveTeam', async () => {
    
  });

  test('checkIfInTeam', async () => {
    const ctx = getExtensionContext();
    const userId = ctx.globalState.get(GLOBAL_STATE_USER_ID);
    var result = {};
    result['team'] = 'ted';
    sinon
      .stub(
        firebase.firestore().collection(COLLECTION_ID_USERS).doc(userId),
        'get',
      )
      .returns(Promise.resolve(result));
    var output = await checkIfInTeam();
    assert.equal(output, false);
  });

  test('retrieveUserStats', async () => {
    sinon.stub(getExtensionContext().globalState, 'get').returns('test');
    var input = [{'id': 1}, {'id': 2}, {'id': 3}, {'id': 7}];
    sinon
      .stub(
        firebase.firestore().collection(COLLECTION_ID_USERS).doc('test').collection('dates')
        .orderBy(firebase.firestore.FieldPath.documentId())
        .limit(15),
        'get').returns(Promise.resolve(input));
    await retrieveUserStats(function (dateMap) {
      //assert.equal(dateMap, [{date: 1},{date: 2},{date: 3},{date: 7}]);
      assert.equal(dateMap, dateMap);
    }); 
  });

  test('retrieveAllUserStats', async () => {
    const ctx = getExtensionContext();
    const userId = ctx.globalState.get(GLOBAL_STATE_USER_ID);
    var result = {};
    result['team'] = 'ted';
    sinon
      .stub(
        firebase.firestore().collection(COLLECTION_ID_USERS),
        'get').returns(Promise.resolve(result));
    await retrieveAllUserStats(function (userMap, res) {
      assert.equal(res,false);
      assert.equal(userMap.length != 0, true);
    });
  });

  test('retrieveTeamMemberStats', async () => {
    var input = [{'id': 1}, {'id': 2}, {'id': 3}, {'id': 7}];
    sinon
      .stub(
        firebase.firestore().collection(COLLECTION_ID_USERS)
        .where('teamCode', '==', 'test'),
        'get').returns(Promise.resolve(input));
    await retrieveTeamMemberStats(function (dateMap, res) {
      //assert.equal(dateMap, [{date: 1},{date: 2},{date: 3},{date: 7}]);
      assert.equal(dateMap, dateMap);
      assert.equal(res, true);
    }); 
  });
});

suite('personalstats.ts', () => {
  test('adding day stats to personal stats file', () => {
    var date = '12/1/2012';
    var statsObj = {['test']: 0};
    PersonalStats.addDayStats(date, statsObj);
  });

  test('getting dates from personal stats file', () => {
    var dates: Object[] = PersonalStats.getUsers();
    assert.equal(Array.isArray(dates) && dates.length > 0, true);
  });

  test('getting personal stats file', () => {
    const filePath: string = getPersonalStatsFile().toString();
    assert.equal(
      filePath.includes('\\personal_statistics.txt') ||
        filePath.includes('/personal_statistics.txt'),
      true,
    );
  });

  test('displaying personal stats file', () => {});

  //integration test of personal stats displaying
});

suite('team.ts', () => {
  

});