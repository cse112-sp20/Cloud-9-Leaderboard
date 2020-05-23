"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECTION_BAR = exports.MAX_RANK_LENGTH = exports.MAX_USERNAME_LENGTH = exports.GLOBAL_STATE_USER_TEAM_ID = exports.GLOBAL_STATE_USER_TEAM_NAME = exports.GLOBAL_STATE_USER_PASSWORD = exports.GLOBAL_STATE_USER_EMAIL = exports.GLOBAL_STATE_USER_ID = exports.COLLECTION_ID_TEAM_MEMBERS = exports.COLLECTION_ID_TEAMS = exports.COLLECTION_ID_USERS = exports.DEFAULT_TEAM_DOC = exports.DEFAULT_USER_DOC_TOP = exports.DEFAULT_USER_DOC = exports.DEFAULT_PASSWORD = exports.firebaseConfig = void 0;
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
};
exports.DEFAULT_TEAM_DOC = {
// teamName: '',
// teamMembersId: {},
// teamLeadId:{}
};
exports.COLLECTION_ID_USERS = 'Users';
exports.COLLECTION_ID_TEAMS = 'Leaderboards';
exports.COLLECTION_ID_TEAM_MEMBERS = 'Members';
exports.GLOBAL_STATE_USER_ID = 'cachedUserId';
exports.GLOBAL_STATE_USER_EMAIL = 'cachedUserEmail';
exports.GLOBAL_STATE_USER_PASSWORD = 'cachedUserPassword';
exports.GLOBAL_STATE_USER_TEAM_NAME = 'cachedUserTeamName';
exports.GLOBAL_STATE_USER_TEAM_ID = 'cachedUserTeamId';
exports.MAX_USERNAME_LENGTH = 50;
exports.MAX_RANK_LENGTH = 6;
exports.SECTION_BAR = '\n'.padStart(80, '=');
//# sourceMappingURL=Constants.js.map