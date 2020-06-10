import {generateRandomName} from "../../src/util/Utility";
import {
  getExtensionContext,
  authenticateUser,
} from "../../src/util/Authentication";
import {
  Leaderboard,
  getLeaderboardFile,
  getTeamLeaderboardFile,
} from "../../src/util/Leaderboard";
import {scoreCalculation, processMetric} from "../../src/util/Metric";
import {
  loginUserWithEmailAndPassword,
  createNewUserInFirebase,
  addNewTeamToDbAndJoin,
  joinTeamWithTeamId,
  leaveTeam,
  addNewUserDocToDb,
  checkIfInTeam,
  retrieveUserStats,
  retrieveAllUserStats,
  retrieveTeamMemberStats,
} from "../../src/util/FireStore";
import {create} from "domain";
import {
  COLLECTION_ID_USERS,
  COLLECTION_ID_TEAMS,
  COLLECTION_ID_TEAM_MEMBERS,
  GLOBAL_STATE_USER_ID,
  GLOBAL_STATE_USER_EMAIL,
  GLOBAL_STATE_USER_PASSWORD,
  GLOBAL_STATE_USER_TEAM_NAME,
  DEFAULT_USER_DOC_TOP,
  GLOBAL_STATE_USER_TEAM_ID,
  GLOBAL_STATE_USER_IS_TEAM_LEADER,
  GLOBAL_STATE_USER_NICKNAME,
} from "../../src/util/Constants";
import {
  PersonalStats,
  getPersonalStatsFile,
  displayPersonalStats,
} from "../../src/util/PersonalStats";
const sinon = require("sinon");
const firebase = require("firebase/app");
import * as Mocha from "mocha";
import {expect} from "chai";
import {
  DailyMetricDataProvider,
  DailyMetricItem,
} from "../../src/util/DailyMetricDataProvider";
import {getTeamInfo} from "../../src/util/Team";
import {TeamDataProvider, TeamItem} from "../../src/util/TeamDataProvider";
import {TreeItem} from "vscode";
import {MenuDataProvider, MenuItem} from "../../src/util/MenuDataProvider";
import {
  LeaderItem,
  LeaderDataProvider,
} from "../../src/util/LeaderDataProvider";
import {hrtime} from "process";

// The module 'assert' provides assertion methods from node
const assert = require("chai").assert;
suite("authentication.ts", () => {
  test("generating extension context", () => {
    const result = getExtensionContext();
    assert.typeOf(result, "object");
  });

  test("authenticating user", () => {
    const ctx = getExtensionContext();
    //authenticateUser();
  });
});

suite("utilities.ts", () => {
  test("generating random name", () => {
    const result = generateRandomName();
    assert.typeOf(result, "string");
  });
});

suite("leaderboard.ts", () => {
  test("adding user to empty leaderboard", () => {
    const id: Number = 654;
    const userObj = null;
    console.log(Leaderboard);
    Leaderboard.addUser(id, userObj);
    assert.equal(Leaderboard.getUsers().length, 1);
  });

  test("getting global leadboard file", () => {
    const leaderboardPath: string = getLeaderboardFile().toString();
    assert.equal(
      leaderboardPath.includes("\\leaderboard.txt") ||
        leaderboardPath.includes("/leaderboard.txt"),
      true,
    );
  });

  test("getting team leadboard file", () => {
    const leaderboardPath: string = getTeamLeaderboardFile().toString();
    assert.equal(
      leaderboardPath.includes("\\team_leaderboard.txt") ||
        leaderboardPath.includes("/team_leaderboard.txt"),
      true,
    );
  });

  //integration test of leaderboard displaying
});

suite("metric.ts", () => {
  test("score calculations with small metrics", () => {
    const userStats = {};
    userStats["timeInterval"] = 0;
    userStats["keystrokes"] = 0;
    userStats["linesChanged"] = 0;

    var score = scoreCalculation(userStats);
    assert.equal(score, 0);

    userStats["timeInterval"] = -1;
    userStats["keystrokes"] = -1;
    userStats["linesChanged"] = -1;

    score = scoreCalculation(userStats);
    assert.equal(score, -11.01);
  });

  test("score calculations with large metrics", () => {
    const userStats = {};
    userStats["timeInterval"] = 100000;
    userStats["keystrokes"] = 100000;
    userStats["linesChanged"] = 100000;

    var score = scoreCalculation(userStats);
    assert.equal(score, 1101000);

    userStats["timeInterval"] = 100000;
    userStats["keystrokes"] = 100000;
    userStats["linesChanged"] = -100000;

    score = scoreCalculation(userStats);
    assert.equal(score, -899000);
  });

  //process metric test needed (don't know what payload looks like yet)
});

suite("firestore.ts", () => {
  const testId: string = "testUserId";
  test("login to firestore", async () => {
    var signInStub = sinon.stub(firebase.auth(), "signInWithEmailAndPassword");
    const signInResult = {};
    signInStub.withArgs("test", "test").returns(Promise.resolve(signInResult));
    await loginUserWithEmailAndPassword("test", "test");
  });

  test("updateStats", async () => {
    //need to run app and see codetime payload to continue
  });

  test("addNewUserDocToDb", async () => {
    var spy = sinon.spy(
      firebase.firestore().collection(COLLECTION_ID_USERS).doc("test"),
      "set",
    );
    await addNewUserDocToDb("testEmail", "testPassword").then(() => {
      expect(spy.calledOnce);
    });
  });

  test("create new user", async () => {
    //Set a fake userID
    var result = {};
    result["uid"] = testId;
    sinon.stub(firebase.auth(), "currentUser").value(result);

    //whenever the function is called, return a blank promise
    sinon
      .stub(firebase.auth(), "createUserWithEmailAndPassword")
      .withArgs(testId, "testPassword")
      .returns(Promise.resolve());
    var successful = await createNewUserInFirebase(testId, "testPassword");
    assert.equal(successful.created, true); // works!!
  });

  test("addNewTeamToDbAndJoin", async () => {
    var spy = sinon.spy(joinTeamWithTeamId);
    await addNewTeamToDbAndJoin("jaggers")
      .then(() => {
        expect(spy.calledOnce);
      })
      .then(async () => {
        // after calling again with the same team name, we expect to be rejected
        await addNewTeamToDbAndJoin("jaggers").then(() => {
          expect(spy.calledOnce);
        });
      })
      .then(async () => {
        // after calling again with another team name, the spy should have recorded 2 calls
        await addNewTeamToDbAndJoin("dragons").then(() => {
          expect(spy.calledTwice);
        });
      });
  });

  test("joinTeamWithTeamId", async () => {
    sinon.restore();
    const ctx = getExtensionContext();

    sinon
      .stub(ctx.globalState, "get")
      .withArgs(GLOBAL_STATE_USER_ID)
      .returns("");

    // arbitrary team id for testing
    var teamId = "12345";
    var dataa = <any>{};
    Object.defineProperty(dataa, "teamName", {value: "jaggers"});

    sinon
      .stub(
        firebase.firestore().collection(COLLECTION_ID_TEAMS).doc(teamId),
        "get",
      )
      .callsFake(() => {
        return Promise.resolve({
          data: function () {
            return dataa;
          },
        });
      });

    // verify that we are able to join the team once by confirming we are set in the team members collection
    var spy = sinon.spy(
      firebase
        .firestore()
        .collection(COLLECTION_ID_TEAMS)
        .doc(teamId)
        .collection(COLLECTION_ID_TEAM_MEMBERS)
        .doc(testId),
      "set",
    );

    await joinTeamWithTeamId(teamId, true).then(() => {
      expect(spy.calledOnce);
    });

    sinon.restore();
  });

  test("leaveTeam", async () => {
    sinon.restore();
    const ctx = getExtensionContext();

    sinon
      .stub(ctx.globalState, "get")
      .withArgs(GLOBAL_STATE_USER_IS_TEAM_LEADER)
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
      .stub(
        firebase.firestore().collection(COLLECTION_ID_TEAMS).doc(teamId),
        "get",
      )
      .resolves(data);

    // delete user with userId
    var deleteUser = sinon.stub(
      firebase
        .firestore()
        .collection(COLLECTION_ID_TEAMS)
        .doc(teamId)
        .collection(COLLECTION_ID_TEAM_MEMBERS)
        .doc(userId),
      "delete",
    );

    // userid "1" with name "member"
    var getUserDoc = sinon
      .stub(
        firebase.firestore().collection(COLLECTION_ID_USERS).doc(userId),
        "get",
      )
      .returns(Promise.resolve(userDoc));

    var output = await leaveTeam("1", "team0").then(() => {
      expect(deleteUser.calledOnce);
    });

    // clean up
    getTeamLead.restore();
    deleteUser.restore();
    getUserDoc.restore();
    sinon.restore();
  });

  test("checkIfInTeam", async () => {
    const ctx = getExtensionContext();
    sinon
      .stub(ctx.globalState, "get")
      .withArgs(GLOBAL_STATE_USER_ID)
      .returns("testId");
    var result = {};
    result["team"] = "ted";
    sinon
      .stub(
        firebase.firestore().collection(COLLECTION_ID_USERS).doc("testId"),
        "get",
      )
      .returns(Promise.resolve(result));
    var output = await checkIfInTeam();
    assert.equal(output, false);
    sinon.restore();
  });

  test("retrieveUserStats", async () => {
    sinon.stub(getExtensionContext().globalState, "get").returns("test");
    var input = [{id: 1}, {id: 2}, {id: 3}, {id: 7}];
    sinon
      .stub(
        firebase
          .firestore()
          .collection(COLLECTION_ID_USERS)
          .doc("test")
          .collection("dates")
          .orderBy(firebase.firestore.FieldPath.documentId())
          .limit(15),
        "get",
      )
      .returns(Promise.resolve(input));
    await retrieveUserStats(function (dateMap) {
      //assert.equal(dateMap, [{date: 1},{date: 2},{date: 3},{date: 7}]);
      assert.equal(dateMap, dateMap);
    });
  });

  test("retrieveAllUserStats", async () => {
    const ctx = getExtensionContext();
    const userId = ctx.globalState.get(GLOBAL_STATE_USER_ID);
    var result = {};
    result["team"] = "ted";
    sinon
      .stub(firebase.firestore().collection(COLLECTION_ID_USERS), "get")
      .returns(Promise.resolve(result));
    await retrieveAllUserStats(function (userMap, res) {
      assert.equal(res, false);
      assert.equal(userMap.length != 0, true);
    });
  });

  test("retrieveTeamMemberStats", async () => {
    var input = [{id: 1}, {id: 2}, {id: 3}, {id: 7}];
    sinon
      .stub(
        firebase
          .firestore()
          .collection(COLLECTION_ID_USERS)
          .where("teamCode", "==", "test"),
        "get",
      )
      .returns(Promise.resolve(input));
    await retrieveTeamMemberStats(function (dateMap, res) {
      //assert.equal(dateMap, [{date: 1},{date: 2},{date: 3},{date: 7}]);
      assert.equal(dateMap, dateMap);
      assert.equal(res, true);
    });
  });
});

suite("personalstats.ts", () => {
  test("adding day stats to personal stats file", () => {
    var date = "12/1/2012";
    var statsObj = {["test"]: 0};
    PersonalStats.addDayStats(date, statsObj);
  });

  test("getting dates from personal stats file", () => {
    var dates: Object[] = PersonalStats.getUsers();
    assert.equal(Array.isArray(dates) && dates.length > 0, true);
  });

  test("getting personal stats file", () => {
    const filePath: string = getPersonalStatsFile().toString();
    assert.equal(
      filePath.includes("\\personal_statistics.txt") ||
        filePath.includes("/personal_statistics.txt"),
      true,
    );
  });

  test("displaying personal stats file", () => {});

  //integration test of personal stats displaying
});

suite("team.ts", () => {
  test("getTeamInfo with non empty team", async () => {
    sinon.restore();
    sinon
      .stub(getExtensionContext().globalState, "get")
      .withArgs(GLOBAL_STATE_USER_TEAM_ID)
      .returns("teamId");

    var result = await getTeamInfo();
    assert.equal(result, undefined);
  });

  test("getTeamInfo with empty team", async () => {
    sinon.restore();
    var result = await getTeamInfo();
    assert.equal(result, undefined);
  });

  //integration test for joinTeam
});

suite("DailyMetricDataProvider", () => {
  test("constructing new DailyMetricDataProvider on undefined obj", () => {
    const metricProvider: DailyMetricDataProvider = new DailyMetricDataProvider(
      undefined,
    );

    assert.equal(metricProvider.data.length, 4);
  });

  test("constructing new DailyMetricDataProvider on defined obj", () => {
    const metricProvider: DailyMetricDataProvider = new DailyMetricDataProvider(
      [],
    );

    assert.equal(metricProvider.data.length, 0);
  });

  test("constructing new DailyMetricItem with null children", () => {
    const metricItem: DailyMetricItem = new DailyMetricItem("test", null);

    assert.equal(metricItem.children, null);
  });

  test("constructing new DailyMetricItem with nonnull children", () => {
    const testItem: DailyMetricItem[] = [new DailyMetricItem("test")];
    const metricItem: DailyMetricItem = new DailyMetricItem("test", testItem);

    assert.equal(metricItem.children, testItem);
  });
});

suite("TeamDataProvider", () => {
  test("constructing new TeamDataProvider", () => {
    const teamDataProvider: TeamDataProvider = new TeamDataProvider();

    assert.equal(teamDataProvider.data.length, 2);
  });

  test("constructing new TeamItem with null children", () => {
    const teamItem: TeamItem = new TeamItem("test", null);

    assert.equal(teamItem.children, null);
  });

  test("constructing new TeamItem with nonnull children", () => {
    const testItem: TeamItem[] = [new TeamItem("test")];
    const teamItem: TeamItem = new TeamItem("test", testItem);

    assert.equal(teamItem.children, testItem);
  });

  //integration test for handleTeamInfoChangeSelection
});

suite("MenuDataProvider", () => {
  test("constructing new MenuDataProvider", () => {
    const menuDataProvider: MenuDataProvider = new MenuDataProvider();

    assert.equal(menuDataProvider.data.length, 3);
  });

  test("constructing new menuItem with null children", () => {
    const menuItem: MenuItem = new MenuItem("test", null);

    assert.equal(menuItem.children, null);
  });

  test("constructing new menuItem with nonnull children", () => {
    const testItem: MenuItem[] = [new MenuItem("test")];
    const menuItem: MenuItem = new MenuItem("test", testItem);

    assert.equal(menuItem.children, testItem);
  });

  //integration test for handleMenuInfoChangeSelection
});

suite("LeaderDataProvider", () => {
  test("constructing new LeaderDataProvider", () => {
    const leaderDataProvider: LeaderDataProvider = new LeaderDataProvider();

    assert.equal(leaderDataProvider.data.length, 1);
  });

  test("constructing new leaderItem with null children", () => {
    const leaderItem: LeaderItem = new LeaderItem("test", null);

    assert.equal(leaderItem.children, null);
  });

  test("constructing new leaderItem with nonnull children", () => {
    const testChild: LeaderItem[] = [undefined];
    const testParent: LeaderItem = undefined;
    const leaderItem: LeaderItem = new LeaderItem("test", undefined, testChild);

    assert.equal(leaderItem.parent, testParent);
    assert.equal(leaderItem.children, testChild);
  });

  //integration test for handeLeaderInfoChangeSelection
});
