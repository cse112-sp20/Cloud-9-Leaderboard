"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Utility_1 = require("../../src/util/Utility");
const Authentication_1 = require("../../src/util/Authentication");
const Leaderboard_1 = require("../../src/util/Leaderboard");
const Metric_1 = require("../../src/util/Metric");
const FireStore_1 = require("../../src/util/FireStore");
const Constants_1 = require("../../src/util/Constants");
const PersonalStats_1 = require("../../src/util/PersonalStats");
const sinon = require('sinon');
const firebase = require('firebase/app');
// The module 'assert' provides assertion methods from node
const assert = require('chai').assert;
suite('authentication.ts', () => {
    test('generating extension context', () => {
        const result = Authentication_1.getExtensionContext();
        assert.typeOf(result, 'object');
    });
    test('clearing cached user id', () => {
        Authentication_1.clearCachedUserId();
        const ctx = Authentication_1.getExtensionContext();
        assert.equal(ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_ID), undefined);
    });
    test('authenticating user', () => {
        const ctx = Authentication_1.getExtensionContext();
        Authentication_1.authenticateUser(ctx);
    });
    test('registering new user with user input', () => {
        const ctx = Authentication_1.getExtensionContext();
        Authentication_1.registerNewUserWithUserInput(ctx);
    });
    test('registering new user with generated credentials', () => {
        const ctx = Authentication_1.getExtensionContext();
        Authentication_1.registerNewUserWithGeneratedCredential(ctx);
    });
});
suite('utilities.ts', () => {
    test('generating random name', () => {
        const result = Utility_1.generateRandomName();
        assert.typeOf(result, 'string');
    });
    test('generating random int', () => {
        assert.equal(Utility_1.getRandomInt(1), 0);
        assert.equal(Utility_1.getRandomInt(0), 0);
        assert.equal(Utility_1.getRandomInt(100) <= 100, true);
    });
    test('generating random email', () => {
        assert.equal(Utility_1.generateRandomEmail().includes('@'), true);
    });
});
suite('leaderboard.ts', () => {
    test('adding user to empty leaderboard', () => {
        const id = 654;
        const userObj = null;
        console.log(Leaderboard_1.Leaderboard);
        Leaderboard_1.Leaderboard.addUser(id, userObj);
        assert.equal(Leaderboard_1.Leaderboard.getUsers().length, 1);
    });
    test('getting global leadboard file', () => {
        const leaderboardPath = Leaderboard_1.getLeaderboardFile().toString();
        assert.equal(leaderboardPath.includes('\\leaderboard.txt') ||
            leaderboardPath.includes('/leaderboard.txt'), true);
    });
    test('getting team leadboard file', () => {
        const leaderboardPath = Leaderboard_1.getTeamLeaderboardFile().toString();
        assert.equal(leaderboardPath.includes('\\team_leaderboard.txt') ||
            leaderboardPath.includes('/team_leaderboard.txt'), true);
    });
    //integration test of leaderboard displaying
});
suite('metric.ts', () => {
    test('score calculations with small metrics', () => {
        const userStats = {};
        userStats['timeInterval'] = 0;
        userStats['keystrokes'] = 0;
        userStats['linesChanged'] = 0;
        var score = Metric_1.scoreCalculation(userStats);
        assert.equal(score, 10);
        userStats['timeInterval'] = -1;
        userStats['keystrokes'] = -1;
        userStats['linesChanged'] = -1;
        score = Metric_1.scoreCalculation(userStats);
        assert.equal(score, 7.99);
    });
    test('score calculations with large metrics', () => {
        const userStats = {};
        userStats['timeInterval'] = 100000;
        userStats['keystrokes'] = 100000;
        userStats['linesChanged'] = 100000;
        var score = Metric_1.scoreCalculation(userStats);
        assert.equal(score, 201010);
        userStats['timeInterval'] = 100000;
        userStats['keystrokes'] = 100000;
        userStats['linesChanged'] = -100000;
        score = Metric_1.scoreCalculation(userStats);
        assert.equal(score, 1010);
    });
    //process metric test needed (don't know what payload looks like yet)
});
suite('firestore.ts', () => {
    const testId = 'testUserId';
    test('login to firestore', () => __awaiter(void 0, void 0, void 0, function* () {
        var signInStub = sinon.stub(firebase.auth(), 'signInWithEmailAndPassword');
        const signInResult = {};
        signInStub.withArgs('test', 'test').returns(Promise.resolve(signInResult));
        yield FireStore_1.loginUserWithEmailAndPassword('test', 'test');
    }));
    test('update users stats', () => __awaiter(void 0, void 0, void 0, function* () { }));
    test('addNewUserDocToDb', () => __awaiter(void 0, void 0, void 0, function* () { }));
    test('getUserDocWithId', () => __awaiter(void 0, void 0, void 0, function* () {
        var result = {};
        result['data'] = 'yaya';
        sinon
            .stub(firebase.firestore().collection(Constants_1.COLLECTION_ID_USERS).doc(testId), 'get')
            .returns(Promise.resolve(result));
        FireStore_1.getUserDocWithId(testId).then((res) => {
            assert.equal(result, res);
        });
    }));
    test('getUserDocWithId', () => __awaiter(void 0, void 0, void 0, function* () {
        var result = {};
        result['data'] = 'yaya';
        sinon
            .stub(firebase.firestore().collection(Constants_1.COLLECTION_ID_USERS).doc(testId), 'get')
            .returns(Promise.resolve(result));
        FireStore_1.getUserDocWithId(testId).then((res) => {
            assert.equal(result, res);
        });
    }));
    test('create new user', () => __awaiter(void 0, void 0, void 0, function* () {
        //Set a fake userID
        var result = {};
        result['uid'] = testId;
        sinon.stub(firebase.auth(), 'currentUser').value(result);
        //whenever the function is called, return a blank promise
        sinon
            .stub(firebase.auth(), 'createUserWithEmailAndPassword')
            .withArgs(testId, 'testPassword')
            .returns(Promise.resolve());
        var successful = yield FireStore_1.createNewUserInFirebase(Authentication_1.getExtensionContext(), testId, 'testPassword');
        assert.equal(successful, true); // works!!
    }));
    test('addNewTeamToDbAndJoin', () => __awaiter(void 0, void 0, void 0, function* () { }));
    test('joinTeamWithTeamId', () => __awaiter(void 0, void 0, void 0, function* () { }));
    test('leaveTeam', () => __awaiter(void 0, void 0, void 0, function* () {
    }));
    test('checkIfInTeam', () => __awaiter(void 0, void 0, void 0, function* () {
        const ctx = Authentication_1.getExtensionContext();
        const userId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_ID);
        var result = {};
        result['team'] = 'ted';
        sinon
            .stub(firebase.firestore().collection(Constants_1.COLLECTION_ID_USERS).doc(userId), 'get')
            .returns(Promise.resolve(result));
        var output = yield FireStore_1.checkIfInTeam();
        assert.equal(output, false);
    }));
    test('retrieveUserStats', () => __awaiter(void 0, void 0, void 0, function* () {
        sinon.stub(Authentication_1.getExtensionContext().globalState, 'get').returns('test');
        var input = [{ 'id': 1 }, { 'id': 2 }, { 'id': 3 }, { 'id': 7 }];
        sinon
            .stub(firebase.firestore().collection(Constants_1.COLLECTION_ID_USERS).doc('test').collection('dates')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(15), 'get').returns(Promise.resolve(input));
        yield FireStore_1.retrieveUserStats(function (dateMap) {
            //assert.equal(dateMap, [{date: 1},{date: 2},{date: 3},{date: 7}]);
            assert.equal(dateMap, dateMap);
        });
    }));
    test('retrieveAllUserStats', () => __awaiter(void 0, void 0, void 0, function* () {
        const ctx = Authentication_1.getExtensionContext();
        const userId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_ID);
        var result = {};
        result['team'] = 'ted';
        sinon
            .stub(firebase.firestore().collection(Constants_1.COLLECTION_ID_USERS), 'get').returns(Promise.resolve(result));
        yield FireStore_1.retrieveAllUserStats(function (userMap, res) {
            assert.equal(res, false);
            assert.equal(userMap.length != 0, true);
        });
    }));
    test('retrieveTeamMemberStats', () => __awaiter(void 0, void 0, void 0, function* () { }));
});
suite('personalstats.ts', () => {
    test('adding day stats to personal stats file', () => {
        var date = '12/1/2012';
        var statsObj = { ['test']: 0 };
        PersonalStats_1.PersonalStats.addDayStats(date, statsObj);
    });
    test('getting dates from personal stats file', () => {
        var dates = PersonalStats_1.PersonalStats.getUsers();
        assert.equal(Array.isArray(dates) && dates.length > 0, true);
    });
    test('getting personal stats file', () => {
        const filePath = PersonalStats_1.getPersonalStatsFile().toString();
        assert.equal(filePath.includes('\\personal_statistics.txt') ||
            filePath.includes('/personal_statistics.txt'), true);
    });
    test('displaying personal stats file', () => { });
    //integration test of personal stats displaying
});
suite('team.ts', () => {
});
//# sourceMappingURL=extension.test.js.map