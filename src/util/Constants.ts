/**
 * Summary. (use period)
 *
 * Description. (use period)
 *
 * @link   URL
 * @file   This files defines the MyClass class.
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

export const PERSONAL_STATISTIC_ROW_1 =
  "     ____                                 _   ____  _        _   _     _   _          \n";
export const PERSONAL_STATISTIC_ROW_2 =
  "    |  _ \\ ___ _ __ ___  ___  _ __   __ _| | / ___|| |_ __ _| |_(_)___| |_(_) ___ ___ \n";
export const PERSONAL_STATISTIC_ROW_3 =
  "    | |_) / _ \\ '__/ __|/ _ \\| '_ \\ / _` | | \\___ \\| __/ _` | __| / __| __| |/ __/ __|\n";
export const PERSONAL_STATISTIC_ROW_4 =
  "    |  __/  __/ |  \\__ \\ (_) | | | | (_| | |  ___) | || (_| | |_| \\__ \\ |_| | (__\\__ \\\n";
export const PERSONAL_STATISTIC_ROW_5 =
  "    |_|   \\___|_|  |___/\\___/|_| |_|\\__,_|_| |____/ \\__\\__,_|\\__|_|___/\\__|_|\\___|___/\n";

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

export const ACHIEVEMENT_ROW_1 =
  "    _        _     _                                     _  \n";
export const ACHIEVEMENT_ROW_2 =
  "   / \\   ___| |__ (_) _____   _____ _ __ ___   ___ _ __ | |_ ___ \n";
export const ACHIEVEMENT_ROW_3 =
  "  / _ \\ / __| '_ \\| |/ _ \\ \\ / / _ \\ '_ ` _ \\ / _ \\ '_ \\| __/ __|\n";
export const ACHIEVEMENT_ROW_4 =
  " / ___ \\ (__| | | | |  __/\\ V /  __/ | | | | |  __/ | | | |_\\__ \\\n";
export const ACHIEVEMENT_ROW_5 =
  "/_/   \\_\\___|_| |_|_|\\___| \\_/ \\___|_| |_| |_|\\___|_| |_|\\__|___/\n";

export const CLOUD9_LEADERBOARD_ROW_1 =
  "            ____ _                 _    ___    _                   _           _                         _\n";
export const CLOUD9_LEADERBOARD_ROW_2 =
  "  / ___| | ___  _   _  __| |  / _ \\  | |    ___  __ _  __| | ___ _ __| |__   ___   __ _ _ __ __| |\n";
export const CLOUD9_LEADERBOARD_ROW_3 =
  " | |   | |/ _ \\| | | |/ _` | | (_) | | |   / _ \\/ _` |/ _` |/ _ \\ '__| '_ \\ / _ \\ / _` | '__/ _` |\n";
export const CLOUD9_LEADERBOARD_ROW_4 =
  " | |___| | (_) | |_| | (_| |  \\__, | | |__|  __/ (_| | (_| |  __/ |  | |_) | (_) | (_| | | | (_| |\n";
export const CLOUD9_LEADERBOARD_ROW_5 =
  "  \\____|_|\\___/ \\__,_|\\__,_|    /_/  |_____\\___|\\__,_|\\__,_|\\___|_|  |_.__/ \\___/ \\__,_|_|  \\__,_|\n";
