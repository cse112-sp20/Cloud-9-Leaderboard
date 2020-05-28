"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLOUD9_LEADERBOARD_ROW_5 = exports.CLOUD9_LEADERBOARD_ROW_4 = exports.CLOUD9_LEADERBOARD_ROW_3 = exports.CLOUD9_LEADERBOARD_ROW_2 = exports.CLOUD9_LEADERBOARD_ROW_1 = exports.ACHIEVEMENT_ROW_5 = exports.ACHIEVEMENT_ROW_4 = exports.ACHIEVEMENT_ROW_3 = exports.ACHIEVEMENT_ROW_2 = exports.ACHIEVEMENT_ROW_1 = exports.LEADERBOARD_ROW_5 = exports.LEADERBOARD_ROW_4 = exports.LEADERBOARD_ROW_3 = exports.LEADERBOARD_ROW_2 = exports.LEADERBOARD_ROW_1 = exports.WECOME_TO_CLOUD9_ROW_5 = exports.WECOME_TO_CLOUD9_ROW_4 = exports.WECOME_TO_CLOUD9_ROW_3 = exports.WECOME_TO_CLOUD9_ROW_2 = exports.WECOME_TO_CLOUD9_ROW_1 = exports.PERSONAL_STATISTIC_ROW_5 = exports.PERSONAL_STATISTIC_ROW_4 = exports.PERSONAL_STATISTIC_ROW_3 = exports.PERSONAL_STATISTIC_ROW_2 = exports.PERSONAL_STATISTIC_ROW_1 = exports.FIELD_LENGTH = exports.STAT_LENGTH = exports.SECTION_BAR = exports.MAX_RANK_LENGTH = exports.MAX_USERNAME_LENGTH = exports.GLOBAL_STATE_USER_IS_TEAM_LEADER = exports.GLOBAL_STATE_USER_TEAM_ID = exports.GLOBAL_STATE_USER_TEAM_NAME = exports.GLOBAL_STATE_USER_PASSWORD = exports.GLOBAL_STATE_USER_EMAIL = exports.GLOBAL_STATE_USER_NICKNAME = exports.GLOBAL_STATE_USER_ID = exports.FIELD_ID_TEAM_LEAD_USER_ID = exports.COLLECTION_ID_TEAM_MEMBERS = exports.COLLECTION_ID_TEAMS = exports.COLLECTION_ID_USERS = exports.DEFAULT_TEAM_DOC = exports.DEFAULT_USER_DOC_TOP = exports.DEFAULT_USER_DOC = exports.DEFAULT_PASSWORD = exports.firebaseConfig = void 0;
exports.firebaseConfig = {
    apiKey: 'AIzaSyAk7NlFSVbRfiwJvWLt7KBQArDTJpcmnO8',
    authDomain: 'cloud-9-4cd71.firebaseapp.com',
    databaseURL: 'https://cloud-9-4cd71.firebaseio.com',
    projectId: 'cloud-9-4cd71',
    storageBucket: 'cloud-9-4cd71.appspot.com',
    messagingSenderId: '423584327013',
    appId: '1:423584327013:web:7f5f11495b4e0c0c196d8c',
    measurementId: 'G-XHTKV8VR6F',
};
exports.DEFAULT_PASSWORD = 'PASSWORD';
exports.DEFAULT_USER_DOC = {
    keystrokes: 0,
    linesChanged: 0,
    timeInterval: 0,
    teamId: '',
    points: 0,
};
exports.DEFAULT_USER_DOC_TOP = {
    keystrokes: 0,
    linesChanged: 0,
    timeInterval: 0,
    teamCode: '',
    cumulativePoints: 0,
    teamName: '',
};
exports.DEFAULT_TEAM_DOC = {
// teamName: '',
// teamMembersId: {},
// teamLeadId:''
};
// firebase collection IDs
exports.COLLECTION_ID_USERS = 'Users';
exports.COLLECTION_ID_TEAMS = 'Leaderboards';
exports.COLLECTION_ID_TEAM_MEMBERS = 'Members';
exports.FIELD_ID_TEAM_LEAD_USER_ID = 'teamLeadUserId';
// vscode persistent storage keys
exports.GLOBAL_STATE_USER_ID = 'cachedUserId';
exports.GLOBAL_STATE_USER_NICKNAME = 'cachedUserNickname';
exports.GLOBAL_STATE_USER_EMAIL = 'cachedUserEmail';
exports.GLOBAL_STATE_USER_PASSWORD = 'cachedUserPassword';
exports.GLOBAL_STATE_USER_TEAM_NAME = 'cachedUserTeamName';
exports.GLOBAL_STATE_USER_TEAM_ID = 'cachedUserTeamId';
exports.GLOBAL_STATE_USER_IS_TEAM_LEADER = 'cachedUserIsTeamLeader'; //bool
exports.MAX_USERNAME_LENGTH = 50;
exports.MAX_RANK_LENGTH = 6;
exports.SECTION_BAR = '\n'.padStart(80, '=');
exports.STAT_LENGTH = 30;
exports.FIELD_LENGTH = 12;
exports.PERSONAL_STATISTIC_ROW_1 = '     ____                                 _   ____  _        _   _     _   _          \n';
exports.PERSONAL_STATISTIC_ROW_2 = '    |  _ \\ ___ _ __ ___  ___  _ __   __ _| | / ___|| |_ __ _| |_(_)___| |_(_) ___ ___ \n';
exports.PERSONAL_STATISTIC_ROW_3 = "    | |_) / _ \\ '__/ __|/ _ \\| '_ \\ / _` | | \\___ \\| __/ _` | __| / __| __| |/ __/ __|\n";
exports.PERSONAL_STATISTIC_ROW_4 = '    |  __/  __/ |  \\__ \\ (_) | | | | (_| | |  ___) | || (_| | |_| \\__ \\ |_| | (__\\__ \\\n';
exports.PERSONAL_STATISTIC_ROW_5 = '    |_|   \\___|_|  |___/\\___/|_| |_|\\__,_|_| |____/ \\__\\__,_|\\__|_|___/\\__|_|\\___|___/\n';
exports.WECOME_TO_CLOUD9_ROW_1 = '  __        __   _                            _____        ____ _                 _    ___\n';
exports.WECOME_TO_CLOUD9_ROW_2 = '  \\ \\      / /__| | ___ ___  _ __ ___   ___  |_   _|__    / ___| | ___  _   _  __| |  / _ \\ \n';
exports.WECOME_TO_CLOUD9_ROW_3 = "   \\ \\ /\\ / / _ \\ |/ __/ _ \\| '_ ` _ \\ / _ \\   | |/ _ \\  | |   | |/ _ \\| | | |/ _` | | (_) |\n";
exports.WECOME_TO_CLOUD9_ROW_4 = '    \\ V  V /  __/ | (_| (_) | | | | | |  __/   | | (_) | | |___| | (_) | |_| | (_| |  \\__, |\n';
exports.WECOME_TO_CLOUD9_ROW_5 = '     \\_/\\_/ \\___|_|\\___\\___/|_| |_| |_|\\___|   |_|\\___/   \\____|_|\\___/ \\__,_|\\__,_|    /_/ \n';
exports.LEADERBOARD_ROW_1 = ' _                   _           _                         _\n';
exports.LEADERBOARD_ROW_2 = '| |    ___  __ _  __| | ___ _ __| |__   ___   __ _ _ __ __| |\n';
exports.LEADERBOARD_ROW_3 = "| |   / _ \\/ _` |/ _` |/ _ \\ '__| '_ \\ / _ \\ / _` | '__/ _` |\n";
exports.LEADERBOARD_ROW_4 = '| |__|  __/ (_| | (_| |  __/ |  | |_) | (_) | (_| | | | (_| |\n';
exports.LEADERBOARD_ROW_5 = '|_____\\___|\\__,_|\\__,_|\\___|_|  |_.__/ \\___/ \\__,_|_|  \\__,_|\n';
exports.ACHIEVEMENT_ROW_1 = '    _        _     _                                     _  \n';
exports.ACHIEVEMENT_ROW_2 = '   / \\   ___| |__ (_) _____   _____ _ __ ___   ___ _ __ | |_ ___ \n';
exports.ACHIEVEMENT_ROW_3 = "  / _ \\ / __| '_ \\| |/ _ \\ \\ / / _ \\ '_ ` _ \\ / _ \\ '_ \\| __/ __|\n";
exports.ACHIEVEMENT_ROW_4 = ' / ___ \\ (__| | | | |  __/\\ V /  __/ | | | | |  __/ | | | |_\\__ \\\n';
exports.ACHIEVEMENT_ROW_5 = '/_/   \\_\\___|_| |_|_|\\___| \\_/ \\___|_| |_| |_|\\___|_| |_|\\__|___/\n';
exports.CLOUD9_LEADERBOARD_ROW_1 = '   ____ _                 _    ___    _                   _           _                         _\n';
exports.CLOUD9_LEADERBOARD_ROW_2 = '  / ___| | ___  _   _  __| |  / _ \\  | |    ___  __ _  __| | ___ _ __| |__   ___   __ _ _ __ __| |\n';
exports.CLOUD9_LEADERBOARD_ROW_3 = " | |   | |/ _ \\| | | |/ _` | | (_) | | |   / _ \\/ _` |/ _` |/ _ \\ '__| '_ \\ / _ \\ / _` | '__/ _` |\n";
exports.CLOUD9_LEADERBOARD_ROW_4 = ' | |___| | (_) | |_| | (_| |  \\__, | | |__|  __/ (_| | (_| |  __/ |  | |_) | (_) | (_| | | | (_| |\n';
exports.CLOUD9_LEADERBOARD_ROW_5 = '  \\____|_|\\___/ \\__,_|\\__,_|    /_/  |_____\\___|\\__,_|\\__,_|\\___|_|  |_.__/ \\___/ \\__,_|_|  \\__,_|\n';
//# sourceMappingURL=Constants.js.map