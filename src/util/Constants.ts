export const firebaseConfig = {
  apiKey: 'AIzaSyAk7NlFSVbRfiwJvWLt7KBQArDTJpcmnO8',
  authDomain: 'cloud-9-4cd71.firebaseapp.com',
  databaseURL: 'https://cloud-9-4cd71.firebaseio.com',
  projectId: 'cloud-9-4cd71',
  storageBucket: 'cloud-9-4cd71.appspot.com',
  messagingSenderId: '423584327013',
  appId: '1:423584327013:web:7f5f11495b4e0c0c196d8c',
  measurementId: 'G-XHTKV8VR6F',
};

export const DEFAULT_PASSWORD = 'PASSWORD';

export const DEFAULT_USER_DOC = {
  keystrokes: 0,
  linesChanged: 0,
  timeInterval: 0,
  teamId: '',
  points: 0,
};

export const DEFAULT_USER_DOC_TOP = {
  keystrokes: 0,
  linesChanged: 0,
  timeInterval: 0,
  teamCode: '',
  cumulativePoints: 0,
};

export const DEFAULT_TEAM_DOC = {
  // teamName: '',
  // teamMembersId: {},
  // teamLeadId:''
};

// firebase collection IDs
export const COLLECTION_ID_USERS = 'Users';
export const COLLECTION_ID_TEAMS = 'Leaderboards';
export const COLLECTION_ID_TEAM_MEMBERS = 'Members';
export const FIELD_ID_TEAM_LEAD_USER_ID = 'teamLeadUserId';

// vscode persistent storage keys
export const GLOBAL_STATE_USER_ID = 'cachedUserId';
export const GLOBAL_STATE_USER_EMAIL = 'cachedUserEmail';
export const GLOBAL_STATE_USER_PASSWORD = 'cachedUserPassword';
export const GLOBAL_STATE_USER_TEAM_NAME = 'cachedUserTeamName';
export const GLOBAL_STATE_USER_TEAM_ID = 'cachedUserTeamId';
export const GLOBAL_STATE_USER_IS_TEAM_LEADER = 'cachedUserIsTeamLeader'; //bool

export const MAX_USERNAME_LENGTH = 50;
export const MAX_RANK_LENGTH = 6;
export const SECTION_BAR = '\n'.padStart(80, '=');

export const STAT_LENGTH = 30;
export const FIELD_LENGTH = 12;
