"use strict";
/**
 * File: Constants.ts
 *
 * Contains constants value used throughout cloud9
 *
 * @link   URL
 * @file   This files defines constants
 * @author AuthorName.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.LINE_BAR = exports.METRIC_STRING = exports.RECORD_TITLE = exports.STATISTICS_TITLE = exports.ACHIEVEMENTS_TITLE = exports.LEADERBOARD_ACHIEVEMENTS = exports.LEADERBOARD_ROW_5 = exports.LEADERBOARD_ROW_4 = exports.LEADERBOARD_ROW_3 = exports.LEADERBOARD_ROW_2 = exports.LEADERBOARD_ROW_1 = exports.WECOME_TO_CLOUD9_ROW_5 = exports.WECOME_TO_CLOUD9_ROW_4 = exports.WECOME_TO_CLOUD9_ROW_3 = exports.WECOME_TO_CLOUD9_ROW_2 = exports.WECOME_TO_CLOUD9_ROW_1 = exports.FIELD_LENGTH = exports.STAT_LENGTH = exports.SECTION_BAR = exports.MAX_RANK_LENGTH = exports.MAX_USERNAME_LENGTH = exports.AUTH_ERR_CODE_INVALID_EMAIL = exports.AUTH_ERR_CODE_USER_NOT_FOUND = exports.AUTH_ERR_CODE_WEAK_PASSWORD = exports.AUTH_ERR_CODE_WRONG_PASSWORD = exports.AUTH_ERR_CODE_EMAIL_USED = exports.AUTH_NOT_LOGGED_IN = exports.AUTH_CREATE_ACCOUNT = exports.AUTH_SIGN_IN = exports.GLOBAL_STATE_USER_TEAM_MEMBERS = exports.GLOBAL_STATE_USER_IS_TEAM_LEADER = exports.GLOBAL_STATE_USER_TEAM_ID = exports.GLOBAL_STATE_USER_TEAM_NAME = exports.GLOBAL_STATE_USER_PASSWORD = exports.GLOBAL_STATE_USER_EMAIL = exports.GLOBAL_STATE_USER_NICKNAME = exports.GLOBAL_STATE_USER_ID = exports.FIELD_ID_TEAM_LEAD_USER_ID = exports.COLLECTION_ID_TEAM_MEMBERS = exports.COLLECTION_ID_TEAMS = exports.COLLECTION_ID_USERS = exports.DEFAULT_TEAM_DOC = exports.DEFAULT_USER_DOC_TOP = exports.DEFAULT_USER_DOC = exports.DEFAULT_PASSWORD = exports.firebaseConfig = void 0;
exports.firebaseConfig = {
    apiKey: "AIzaSyAk7NlFSVbRfiwJvWLt7KBQArDTJpcmnO8",
    authDomain: "cloud-9-4cd71.firebaseapp.com",
    databaseURL: "https://cloud-9-4cd71.firebaseio.com",
    projectId: "cloud-9-4cd71",
    storageBucket: "cloud-9-4cd71.appspot.com",
    messagingSenderId: "423584327013",
    appId: "1:423584327013:web:7f5f11495b4e0c0c196d8c",
    measurementId: "G-XHTKV8VR6F",
};
exports.DEFAULT_PASSWORD = "PASSWORD";
exports.DEFAULT_USER_DOC = {
    keystrokes: 0,
    linesChanged: 0,
    timeInterval: 0,
    teamId: "",
    points: 0,
};
exports.DEFAULT_USER_DOC_TOP = {
    keystrokes: 0,
    linesChanged: 0,
    timeInterval: 0,
    teamCode: "",
    cumulativePoints: 0,
    teamName: "",
    isTeamLeader: false,
};
exports.DEFAULT_TEAM_DOC = {
// teamName: '',
// teamMembersId: {},
// teamLeadId:''
};
// firebase collection IDs
exports.COLLECTION_ID_USERS = "Users";
exports.COLLECTION_ID_TEAMS = "Leaderboards";
exports.COLLECTION_ID_TEAM_MEMBERS = "Members";
exports.FIELD_ID_TEAM_LEAD_USER_ID = "teamLeadUserId";
// vscode persistent storage keys
exports.GLOBAL_STATE_USER_ID = "cachedUserId";
exports.GLOBAL_STATE_USER_NICKNAME = "cachedUserNickname";
exports.GLOBAL_STATE_USER_EMAIL = "cachedUserEmail";
exports.GLOBAL_STATE_USER_PASSWORD = "cachedUserPassword";
exports.GLOBAL_STATE_USER_TEAM_NAME = "cachedUserTeamName";
exports.GLOBAL_STATE_USER_TEAM_ID = "cachedUserTeamId";
exports.GLOBAL_STATE_USER_IS_TEAM_LEADER = "cachedUserIsTeamLeader"; //bool
exports.GLOBAL_STATE_USER_TEAM_MEMBERS = "cachedUserTeamMembers"; //maps
// authentication options
exports.AUTH_SIGN_IN = "Sign in";
exports.AUTH_CREATE_ACCOUNT = "Create a new account";
exports.AUTH_NOT_LOGGED_IN = "You are not signed in!";
// firebase authentication error codes
exports.AUTH_ERR_CODE_EMAIL_USED = "auth/email-already-in-use";
exports.AUTH_ERR_CODE_WRONG_PASSWORD = "auth/wrong-password";
exports.AUTH_ERR_CODE_WEAK_PASSWORD = "auth/weak-password";
exports.AUTH_ERR_CODE_USER_NOT_FOUND = "auth/user-not-found";
exports.AUTH_ERR_CODE_INVALID_EMAIL = "auth/invalid-email";
exports.MAX_USERNAME_LENGTH = 46;
exports.MAX_RANK_LENGTH = 6;
exports.SECTION_BAR = "\n".padStart(92, "=");
exports.STAT_LENGTH = 30;
exports.FIELD_LENGTH = 12;
exports.WECOME_TO_CLOUD9_ROW_1 = "__        __   _                            _____        ____ _                 _    ___\n";
exports.WECOME_TO_CLOUD9_ROW_2 = "\\ \\      / /__| | ___ ___  _ __ ___   ___  |_   _|__    / ___| | ___  _   _  __| |  / _ \\ \n";
exports.WECOME_TO_CLOUD9_ROW_3 = " \\ \\ /\\ / / _ \\ |/ __/ _ \\| '_ ` _ \\ / _ \\   | |/ _ \\  | |   | |/ _ \\| | | |/ _` | | (_) |\n";
exports.WECOME_TO_CLOUD9_ROW_4 = "  \\ V  V /  __/ | (_| (_) | | | | | |  __/   | | (_) | | |___| | (_) | |_| | (_| |  \\__, |\n";
exports.WECOME_TO_CLOUD9_ROW_5 = "   \\_/\\_/ \\___|_|\\___\\___/|_| |_| |_|\\___|   |_|\\___/   \\____|_|\\___/ \\__,_|\\__,_|    /_/ \n";
exports.LEADERBOARD_ROW_1 = "                _                   _           _                         _\n";
exports.LEADERBOARD_ROW_2 = "               | |    ___  __ _  __| | ___ _ __| |__   ___   __ _ _ __ __| |\n";
exports.LEADERBOARD_ROW_3 = "               | |   / _ \\/ _` |/ _` |/ _ \\ '__| '_ \\ / _ \\ / _` | '__/ _` |\n";
exports.LEADERBOARD_ROW_4 = "               | |__|  __/ (_| | (_| |  __/ |  | |_) | (_) | (_| | | | (_| |\n";
exports.LEADERBOARD_ROW_5 = "               |_____\\___|\\__,_|\\__,_|\\___|_|  |_.__/ \\___/ \\__,_|_|  \\__,_|\n";
exports.LEADERBOARD_ACHIEVEMENTS = "These are personal achievements/milestones that you can earn\n\n" +
    "__________________________________________________________________________________________\n" +
    "|                                                              |                          |\n" +
    "|                           ACHIEVEMENTS                       |           BADGE          |\n" +
    "|______________________________________________________________|__________________________|\n" +
    "|                                                              |                          |\n" +
    "|                   Reach 5000 total keystrokes                |             💎           |\n" +
    "|______________________________________________________________|__________________________|\n" +
    "|                                                              |                          |\n" +
    "|                  Reach 2000 total lines changed              |             🔎           |\n" +
    "|______________________________________________________________|__________________________|\n" +
    "|                                                              |                          |\n" +
    "|                  Spend total of 200 hours coding             |             🔥           |\n" +
    "|______________________________________________________________|__________________________|\n" +
    "|                                                              |                          |\n" +
    "|                   Reach 500 total keystrokes daily           |             💪           |\n" +
    "|______________________________________________________________|__________________________|\n" +
    "|                                                              |                          |\n" +
    "|                 Reach 200 total lines changed daily          |             🥊           |\n" +
    "|______________________________________________________________|__________________________|\n" +
    "|                                                              |                          |\n" +
    "|                 Spend total of 6 hours coding daily          |             🎈           |\n" +
    "|______________________________________________________________|__________________________|\n";
exports.ACHIEVEMENTS_TITLE = "                                        Achievements\n";
exports.STATISTICS_TITLE = "                                         Statistics\n";
exports.RECORD_TITLE = "                                           Record\n";
exports.METRIC_STRING = "Each second spent coding:                            + 0.01 points per second \n";
+"Each keystroke:                                      +    1 points per keystroke\n";
+"Each modified line:                                  +   10 points per line \n\n";
exports.LINE_BAR = "___________________________________________________________________________________________\n";
//# sourceMappingURL=Constants.js.map