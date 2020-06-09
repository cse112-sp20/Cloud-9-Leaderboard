/**
 * File: Constants.ts
 *
 * Contains constants value used throughout cloud9
 *
 * @link   URL
 * @file   This files defines constants
 * @author AuthorName.
 */

export const firebaseConfig = {
  apiKey: "AIzaSyAk7NlFSVbRfiwJvWLt7KBQArDTJpcmnO8",
  authDomain: "cloud-9-4cd71.firebaseapp.com",
  databaseURL: "https://cloud-9-4cd71.firebaseio.com",
  projectId: "cloud-9-4cd71",
  storageBucket: "cloud-9-4cd71.appspot.com",
  messagingSenderId: "423584327013",
  appId: "1:423584327013:web:7f5f11495b4e0c0c196d8c",
  measurementId: "G-XHTKV8VR6F",
};

export const DEFAULT_PASSWORD = "PASSWORD";

export const DEFAULT_USER_DOC = {
  keystrokes: 0,
  linesChanged: 0,
  timeInterval: 0,
  teamId: "",
  points: 0,
};

export const DEFAULT_USER_DOC_TOP = {
  keystrokes: 0,
  linesChanged: 0,
  timeInterval: 0,
  teamCode: "",
  cumulativePoints: 0,
  teamName: "",
  isTeamLeader: false,
};

export const DEFAULT_TEAM_DOC = {
  // teamName: '',
  // teamMembersId: {},
  // teamLeadId:''
};

// firebase collection IDs
export const COLLECTION_ID_USERS = "Users";
export const COLLECTION_ID_TEAMS = "Leaderboards";
export const COLLECTION_ID_TEAM_MEMBERS = "Members";
export const FIELD_ID_TEAM_LEAD_USER_ID = "teamLeadUserId";

// vscode persistent storage keys
export const GLOBAL_STATE_USER_ID = "cachedUserId";
export const GLOBAL_STATE_USER_NICKNAME = "cachedUserNickname";
export const GLOBAL_STATE_USER_EMAIL = "cachedUserEmail";
export const GLOBAL_STATE_USER_PASSWORD = "cachedUserPassword";
export const GLOBAL_STATE_USER_TEAM_NAME = "cachedUserTeamName";
export const GLOBAL_STATE_USER_TEAM_ID = "cachedUserTeamId";
export const GLOBAL_STATE_USER_IS_TEAM_LEADER = "cachedUserIsTeamLeader"; //bool
export const GLOBAL_STATE_USER_TEAM_MEMBERS = "cachedUserTeamMembers"; //maps

// authentication options
export const AUTH_SIGN_IN = "Sign in";
export const AUTH_CREATE_ACCOUNT = "Create a new account";
export const AUTH_NOT_LOGGED_IN = "You are not signed in!";
// firebase authentication error codes
export const AUTH_ERR_CODE_EMAIL_USED = "auth/email-already-in-use";
export const AUTH_ERR_CODE_WRONG_PASSWORD = "auth/wrong-password";
export const AUTH_ERR_CODE_WEAK_PASSWORD = "auth/weak-password";
export const AUTH_ERR_CODE_USER_NOT_FOUND = "auth/user-not-found";
export const AUTH_ERR_CODE_INVALID_EMAIL = "auth/invalid-email";

export const MAX_USERNAME_LENGTH = 46;
export const MAX_RANK_LENGTH = 6;
export const SECTION_BAR = "\n".padStart(92, "=");

export const STAT_LENGTH = 30;
export const FIELD_LENGTH = 12;

export const WECOME_TO_CLOUD9_ROW_1 =
  "__        __   _                            _____        ____ _                 _    ___\n";
export const WECOME_TO_CLOUD9_ROW_2 =
  "\\ \\      / /__| | ___ ___  _ __ ___   ___  |_   _|__    / ___| | ___  _   _  __| |  / _ \\ \n";
export const WECOME_TO_CLOUD9_ROW_3 =
  " \\ \\ /\\ / / _ \\ |/ __/ _ \\| '_ ` _ \\ / _ \\   | |/ _ \\  | |   | |/ _ \\| | | |/ _` | | (_) |\n";
export const WECOME_TO_CLOUD9_ROW_4 =
  "  \\ V  V /  __/ | (_| (_) | | | | | |  __/   | | (_) | | |___| | (_) | |_| | (_| |  \\__, |\n";
export const WECOME_TO_CLOUD9_ROW_5 =
  "   \\_/\\_/ \\___|_|\\___\\___/|_| |_| |_|\\___|   |_|\\___/   \\____|_|\\___/ \\__,_|\\__,_|    /_/ \n";

export const LEADERBOARD_ROW_1 =
  "                _                   _           _                         _\n";
export const LEADERBOARD_ROW_2 =
  "               | |    ___  __ _  __| | ___ _ __| |__   ___   __ _ _ __ __| |\n";
export const LEADERBOARD_ROW_3 =
  "               | |   / _ \\/ _` |/ _` |/ _ \\ '__| '_ \\ / _ \\ / _` | '__/ _` |\n";
export const LEADERBOARD_ROW_4 =
  "               | |__|  __/ (_| | (_| |  __/ |  | |_) | (_) | (_| | | | (_| |\n";
export const LEADERBOARD_ROW_5 =
  "               |_____\\___|\\__,_|\\__,_|\\___|_|  |_.__/ \\___/ \\__,_|_|  \\__,_|\n";

export const LEADERBOARD_ACHIEVEMENTS =
  "These are personal achievements/milestones that you can earn\n\n" +
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

export const ACHIEVEMENTS_TITLE =
  "                                        Achievements\n";
export const STATISTICS_TITLE =
  "                                         Statistics\n";
export const RECORD_TITLE =
  "                                           Record\n";
export const METRIC_STRING =
  "Each second spent coding:                            + 0.01 points per second \n";
+"Each keystroke:                                      +    1 points per keystroke\n";
+"Each modified line:                                  +   10 points per line \n\n";
export const LINE_BAR =
  "___________________________________________________________________________________________\n";

// TreeItem header for TeamDataProvider
export const TEAM_INFO_WELCOME_BACK_TO_TEAM_TREEVIEW =
  "🛡 Welcome back to your Team";
export const TEAM_INFO_GET_TEAM_INFO_TREEVIEW = "Get Team Info";
export const TEAM_INFO_VIEW_TEAM_LEADERBOARD_TREEVIEW =
  "📋 View Team leaderboard";
export const TEAM_INFO_CREATE_TEAM_TREEVIEW = "🛡 Create your Team";
export const TEAM_INFO_JOIN_TEAM_TREEVIEW = "🔰 Join Team";
export const TEAM_INFO_TEAM_NAME_TREEVIEW = "TeamName";
export const TEAM_INFO_TEAM_ID_TREEVIEW = "TeamID";

// TreeItem header for LeaderDataProvider
export const TEAM_MANAGEMENT_NO_PERMISSION_NOT_IN_TEAM =
  "No permission: Not in a Team yet";
export const TEAM_MANAGEMENT_NO_PERMISSION_NOT_TEAM_LEADER =
  "No permission: Not Team leader";
export const TEAM_MANAGEMENT_EMPTY_NO_TEAM_MEMBER = "Empty: No Team member yet";
export const TEAM_MANAGEMENT_REMOVE_TEAM_MEMBER = "Remove Team members";

//TreeItem header for MenuDataProvider
export const MENU_VIEW_PERSONAL_STATS_TREEVIEW = "📊 View personal stats";
export const MENU_VIEW_LEADERBOARD_TREEVIEW = "🌐 View Leaderboard";
export const MENU_LOG_OUT_ACCOUNT_TREEVIEW = "💻 Log out account";
export const MENU_SIGN_IN_CREATE_ACCOUNT_TREEVIEW = "Sign in / Create Account";

//TreeItem header for DailyMetricDataProvider
export const DAILY_METRIC_NO_DATA_YET_TREEVIEW = " (No data yet)";

export const DAILY_METRIC_KEYSTROKES_TREEVIEW = "Keystrokes";

export const DAILY_METRIC_LINES_CHANGED_TREEVIEW = "Lines Changed";

export const DAILY_METRIC_TIME_INTERVAL_TREEVIEW = "Time Interval";

export const DAILY_METRIC_POINTS_TREEVIEW = "Points";

export const DAILY_METRIC_DISPLAY_HEADER_MAP_TREEVIEW = {
  keystrokes: "Keystrokes",
  linesChanged: "Lines Changed",
  timeInterval: "Time Interval",
  points: "Total Points",
};
