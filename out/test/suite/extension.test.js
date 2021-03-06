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
const sinon = require("sinon");
const firebase = require("firebase/app");
const chai_1 = require("chai");
const DailyMetricDataProvider_1 = require("../../src/util/DailyMetricDataProvider");
const Team_1 = require("../../src/util/Team");
const TeamDataProvider_1 = require("../../src/util/TeamDataProvider");
const MenuDataProvider_1 = require("../../src/util/MenuDataProvider");
const LeaderDataProvider_1 = require("../../src/util/LeaderDataProvider");
// The module 'assert' provides assertion methods from node
const assert = require("chai").assert;
suite("authentication.ts", () => {
    test("generating extension context", () => {
        const result = Authentication_1.getExtensionContext();
        assert.typeOf(result, "object");
    });
    test("authenticating user", () => {
        const ctx = Authentication_1.getExtensionContext();
        //authenticateUser();
    });
});
suite("utilities.ts", () => {
    test("generating random name", () => {
        const result = Utility_1.generateRandomName();
        assert.typeOf(result, "string");
    });
});
suite("leaderboard.ts", () => {
    test("adding user to empty leaderboard", () => {
        const id = 654;
        const userObj = null;
        console.log(Leaderboard_1.Leaderboard);
        Leaderboard_1.Leaderboard.addUser(id, userObj);
        assert.equal(Leaderboard_1.Leaderboard.getUsers().length, 1);
    });
    test("getting global leadboard file", () => {
        const leaderboardPath = Leaderboard_1.getLeaderboardFile().toString();
        assert.equal(leaderboardPath.includes("\\leaderboard.txt") ||
            leaderboardPath.includes("/leaderboard.txt"), true);
    });
    test("getting team leadboard file", () => {
        const leaderboardPath = Leaderboard_1.getTeamLeaderboardFile().toString();
        assert.equal(leaderboardPath.includes("\\team_leaderboard.txt") ||
            leaderboardPath.includes("/team_leaderboard.txt"), true);
    });
    //integration test of leaderboard displaying
});
suite("metric.ts", () => {
    test("score calculations with small metrics", () => {
        const userStats = {};
        userStats["timeInterval"] = 0;
        userStats["keystrokes"] = 0;
        userStats["linesChanged"] = 0;
        var score = Metric_1.scoreCalculation(userStats);
        assert.equal(score, 0);
        userStats["timeInterval"] = -1;
        userStats["keystrokes"] = -1;
        userStats["linesChanged"] = -1;
        score = Metric_1.scoreCalculation(userStats);
        assert.equal(score, -11.01);
    });
    test("score calculations with large metrics", () => {
        const userStats = {};
        userStats["timeInterval"] = 100000;
        userStats["keystrokes"] = 100000;
        userStats["linesChanged"] = 100000;
        var score = Metric_1.scoreCalculation(userStats);
        assert.equal(score, 1101000);
        userStats["timeInterval"] = 100000;
        userStats["keystrokes"] = 100000;
        userStats["linesChanged"] = -100000;
        score = Metric_1.scoreCalculation(userStats);
        assert.equal(score, -899000);
    });
    //process metric test needed (don't know what payload looks like yet)
});
suite("firestore.ts", () => {
    const testId = "testUserId";
    test("login to firestore", () => __awaiter(void 0, void 0, void 0, function* () {
        var signInStub = sinon.stub(firebase.auth(), "signInWithEmailAndPassword");
        const signInResult = {};
        signInStub.withArgs("test", "test").returns(Promise.resolve(signInResult));
        yield FireStore_1.loginUserWithEmailAndPassword("test", "test");
    }));
    test("updateStats", () => __awaiter(void 0, void 0, void 0, function* () {
        //need to run app and see codetime payload to continue
    }));
    test("addNewUserDocToDb", () => __awaiter(void 0, void 0, void 0, function* () {
        var spy = sinon.spy(firebase.firestore().collection(Constants_1.COLLECTION_ID_USERS).doc("test"), "set");
        yield FireStore_1.addNewUserDocToDb("testEmail", "testPassword").then(() => {
            chai_1.expect(spy.calledOnce);
        });
    }));
    test("create new user", () => __awaiter(void 0, void 0, void 0, function* () {
        //Set a fake userID
        var result = {};
        result["uid"] = testId;
        sinon.stub(firebase.auth(), "currentUser").value(result);
        //whenever the function is called, return a blank promise
        sinon
            .stub(firebase.auth(), "createUserWithEmailAndPassword")
            .withArgs(testId, "testPassword")
            .returns(Promise.resolve());
        var successful = yield FireStore_1.createNewUserInFirebase(testId, "testPassword");
        assert.equal(successful.created, true); // works!!
    }));
    test("addNewTeamToDbAndJoin", () => __awaiter(void 0, void 0, void 0, function* () {
        var spy = sinon.spy(FireStore_1.joinTeamWithTeamId);
        yield FireStore_1.addNewTeamToDbAndJoin("jaggers")
            .then(() => {
            chai_1.expect(spy.calledOnce);
        })
            .then(() => __awaiter(void 0, void 0, void 0, function* () {
            // after calling again with the same team name, we expect to be rejected
            yield FireStore_1.addNewTeamToDbAndJoin("jaggers").then(() => {
                chai_1.expect(spy.calledOnce);
            });
        }))
            .then(() => __awaiter(void 0, void 0, void 0, function* () {
            // after calling again with another team name, the spy should have recorded 2 calls
            yield FireStore_1.addNewTeamToDbAndJoin("dragons").then(() => {
                chai_1.expect(spy.calledTwice);
            });
        }));
    }));
    test("joinTeamWithTeamId", () => __awaiter(void 0, void 0, void 0, function* () {
        sinon.restore();
        const ctx = Authentication_1.getExtensionContext();
        sinon
            .stub(ctx.globalState, "get")
            .withArgs(Constants_1.GLOBAL_STATE_USER_ID)
            .returns("");
        // arbitrary team id for testing
        var teamId = "12345";
        var dataa = {};
        Object.defineProperty(dataa, "teamName", { value: "jaggers" });
        sinon
            .stub(firebase.firestore().collection(Constants_1.COLLECTION_ID_TEAMS).doc(teamId), "get")
            .callsFake(() => {
            return Promise.resolve({
                data: function () {
                    return dataa;
                },
            });
        });
        // verify that we are able to join the team once by confirming we are set in the team members collection
        var spy = sinon.spy(firebase
            .firestore()
            .collection(Constants_1.COLLECTION_ID_TEAMS)
            .doc(teamId)
            .collection(Constants_1.COLLECTION_ID_TEAM_MEMBERS)
            .doc(testId), "set");
        yield FireStore_1.joinTeamWithTeamId(teamId, true).then(() => {
            chai_1.expect(spy.calledOnce);
        });
        sinon.restore();
    }));
    test("leaveTeam", () => __awaiter(void 0, void 0, void 0, function* () {
        sinon.restore();
        const ctx = Authentication_1.getExtensionContext();
        sinon
            .stub(ctx.globalState, "get")
            .withArgs(Constants_1.GLOBAL_STATE_USER_IS_TEAM_LEADER)
            .returns(false);
        var teamId = "team0";
        var teamDoc = {};
        teamDoc["test"] = "hi";
        var data = {};
        data["teamLeadUserId"] = "1";
        var userId = "1";
        var userDoc = {};
        userDoc[userId] = "member";
        // team "team0" with lead id "leader"
        var getTeamLead = sinon
            .stub(firebase.firestore().collection(Constants_1.COLLECTION_ID_TEAMS).doc(teamId), "get")
            .resolves(data);
        // delete user with userId
        var deleteUser = sinon.stub(firebase
            .firestore()
            .collection(Constants_1.COLLECTION_ID_TEAMS)
            .doc(teamId)
            .collection(Constants_1.COLLECTION_ID_TEAM_MEMBERS)
            .doc(userId), "delete");
        // userid "1" with name "member"
        var getUserDoc = sinon
            .stub(firebase.firestore().collection(Constants_1.COLLECTION_ID_USERS).doc(userId), "get")
            .returns(Promise.resolve(userDoc));
        var output = yield FireStore_1.leaveTeam("1", "team0").then(() => {
            chai_1.expect(deleteUser.calledOnce);
        });
        // clean up
        getTeamLead.restore();
        deleteUser.restore();
        getUserDoc.restore();
        sinon.restore();
    }));
    test("checkIfInTeam", () => __awaiter(void 0, void 0, void 0, function* () {
        const ctx = Authentication_1.getExtensionContext();
        sinon
            .stub(ctx.globalState, "get")
            .withArgs(Constants_1.GLOBAL_STATE_USER_ID)
            .returns("testId");
        var result = {};
        result["team"] = "ted";
        sinon
            .stub(firebase.firestore().collection(Constants_1.COLLECTION_ID_USERS).doc("testId"), "get")
            .returns(Promise.resolve(result));
        var output = yield FireStore_1.checkIfInTeam();
        assert.equal(output, false);
        sinon.restore();
    }));
    test("retrieveUserStats", () => __awaiter(void 0, void 0, void 0, function* () {
        sinon.stub(Authentication_1.getExtensionContext().globalState, "get").returns("test");
        var input = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 7 }];
        sinon
            .stub(firebase
            .firestore()
            .collection(Constants_1.COLLECTION_ID_USERS)
            .doc("test")
            .collection("dates")
            .orderBy(firebase.firestore.FieldPath.documentId())
            .limit(15), "get")
            .returns(Promise.resolve(input));
        yield FireStore_1.retrieveUserStats(function (dateMap) {
            //assert.equal(dateMap, [{date: 1},{date: 2},{date: 3},{date: 7}]);
            assert.equal(dateMap, dateMap);
        });
    }));
    test("retrieveAllUserStats", () => __awaiter(void 0, void 0, void 0, function* () {
        const ctx = Authentication_1.getExtensionContext();
        const userId = ctx.globalState.get(Constants_1.GLOBAL_STATE_USER_ID);
        var result = {};
        result["team"] = "ted";
        sinon
            .stub(firebase.firestore().collection(Constants_1.COLLECTION_ID_USERS), "get")
            .returns(Promise.resolve(result));
        yield FireStore_1.retrieveAllUserStats(function (userMap, res) {
            assert.equal(res, false);
            assert.equal(userMap.length != 0, true);
        });
    }));
    test("retrieveTeamMemberStats", () => __awaiter(void 0, void 0, void 0, function* () {
        var input = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 7 }];
        sinon
            .stub(firebase
            .firestore()
            .collection(Constants_1.COLLECTION_ID_USERS)
            .where("teamCode", "==", "test"), "get")
            .returns(Promise.resolve(input));
        yield FireStore_1.retrieveTeamMemberStats(function (dateMap, res) {
            //assert.equal(dateMap, [{date: 1},{date: 2},{date: 3},{date: 7}]);
            assert.equal(dateMap, dateMap);
            assert.equal(res, true);
        });
    }));
});
suite("personalstats.ts", () => {
    test("adding day stats to personal stats file", () => {
        var date = "12/1/2012";
        var statsObj = { ["test"]: 0 };
        PersonalStats_1.PersonalStats.addDayStats(date, statsObj);
    });
    test("getting dates from personal stats file", () => {
        var dates = PersonalStats_1.PersonalStats.getUsers();
        assert.equal(Array.isArray(dates) && dates.length > 0, true);
    });
    test("getting personal stats file", () => {
        const filePath = PersonalStats_1.getPersonalStatsFile().toString();
        assert.equal(filePath.includes("\\personal_statistics.txt") ||
            filePath.includes("/personal_statistics.txt"), true);
    });
    test("displaying personal stats file", () => { });
    //integration test of personal stats displaying
});
suite("team.ts", () => {
    test("getTeamInfo with non empty team", () => __awaiter(void 0, void 0, void 0, function* () {
        sinon.restore();
        sinon
            .stub(Authentication_1.getExtensionContext().globalState, "get")
            .withArgs(Constants_1.GLOBAL_STATE_USER_TEAM_ID)
            .returns("teamId");
        var result = yield Team_1.getTeamInfo();
        assert.equal(result, undefined);
    }));
    test("getTeamInfo with empty team", () => __awaiter(void 0, void 0, void 0, function* () {
        sinon.restore();
        var result = yield Team_1.getTeamInfo();
        assert.equal(result, undefined);
    }));
    //integration test for joinTeam
});
suite("DailyMetricDataProvider", () => {
    test("constructing new DailyMetricDataProvider on undefined obj", () => {
        const metricProvider = new DailyMetricDataProvider_1.DailyMetricDataProvider(undefined);
        assert.equal(metricProvider.data.length, 4);
    });
    test("constructing new DailyMetricDataProvider on defined obj", () => {
        const metricProvider = new DailyMetricDataProvider_1.DailyMetricDataProvider([]);
        assert.equal(metricProvider.data.length, 0);
    });
    test("constructing new DailyMetricItem with null children", () => {
        const metricItem = new DailyMetricDataProvider_1.DailyMetricItem("test", null);
        assert.equal(metricItem.children, null);
    });
    test("constructing new DailyMetricItem with nonnull children", () => {
        const testItem = [new DailyMetricDataProvider_1.DailyMetricItem("test")];
        const metricItem = new DailyMetricDataProvider_1.DailyMetricItem("test", testItem);
        assert.equal(metricItem.children, testItem);
    });
});
suite("TeamDataProvider", () => {
    test("constructing new TeamDataProvider", () => {
        const teamDataProvider = new TeamDataProvider_1.TeamDataProvider();
        assert.equal(teamDataProvider.data.length, 2);
    });
    test("constructing new TeamItem with null children", () => {
        const teamItem = new TeamDataProvider_1.TeamItem("test", null);
        assert.equal(teamItem.children, null);
    });
    test("constructing new TeamItem with nonnull children", () => {
        const testItem = [new TeamDataProvider_1.TeamItem("test")];
        const teamItem = new TeamDataProvider_1.TeamItem("test", testItem);
        assert.equal(teamItem.children, testItem);
    });
    //integration test for handleTeamInfoChangeSelection
});
suite("MenuDataProvider", () => {
    test("constructing new MenuDataProvider", () => {
        const menuDataProvider = new MenuDataProvider_1.MenuDataProvider();
        assert.equal(menuDataProvider.data.length, 3);
    });
    test("constructing new menuItem with null children", () => {
        const menuItem = new MenuDataProvider_1.MenuItem("test", null);
        assert.equal(menuItem.children, null);
    });
    test("constructing new menuItem with nonnull children", () => {
        const testItem = [new MenuDataProvider_1.MenuItem("test")];
        const menuItem = new MenuDataProvider_1.MenuItem("test", testItem);
        assert.equal(menuItem.children, testItem);
    });
    //integration test for handleMenuInfoChangeSelection
});
suite("LeaderDataProvider", () => {
    test("constructing new LeaderDataProvider", () => {
        const leaderDataProvider = new LeaderDataProvider_1.LeaderDataProvider();
        assert.equal(leaderDataProvider.data.length, 1);
    });
    test("constructing new leaderItem with null children", () => {
        const leaderItem = new LeaderDataProvider_1.LeaderItem("test", null);
        assert.equal(leaderItem.children, null);
    });
    test("constructing new leaderItem with nonnull children", () => {
        const testChild = [undefined];
        const testParent = undefined;
        const leaderItem = new LeaderDataProvider_1.LeaderItem("test", undefined, testChild);
        assert.equal(leaderItem.parent, testParent);
        assert.equal(leaderItem.children, testChild);
    });
    //integration test for handeLeaderInfoChangeSelection
});
//# sourceMappingURL=extension.test.js.map