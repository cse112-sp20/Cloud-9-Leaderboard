'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = {next: verb(0), throw: verb(1), return: verb(2)}),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return {value: op[1], done: false};
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return {value: op[0] ? op[1] : void 0, done: true};
    }
  };
var __spreadArrays =
  (this && this.__spreadArrays) ||
  function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++)
      s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
        r[k] = a[j];
    return r;
  };
exports.__esModule = true;
exports.getFileDataPayloadsAsJson = exports.getFileDataArray = exports.getFileDataAsJson = exports.cleanJsonString = exports.getFileType = exports.createSpotifyIdFromUri = exports.buildQueryString = exports.getColumnHeaders = exports.getRowLabels = exports.getRightAlignedTableHeader = exports.getTableHeader = exports.getSectionHeader = exports.getDashboardBottomBorder = exports.getDashboardRow = exports.showWarningMessage = exports.showInformationMessage = exports.connectAtlassian = exports.buildLoginUrl = exports.showLoginPrompt = exports.launchLogin = exports.humanizeMinutes = exports.formatNumber = exports.launchWebUrl = exports.wrapExecPromise = exports.getGitEmail = exports.getSongDisplayName = exports.normalizeGithubEmail = exports.deleteFile = exports.randomCode = exports.getNowTimes = exports.isNewDay = exports.getFormattedDay = exports.getOffsetSeconds = exports.nowInSecs = exports.showOfflinePrompt = exports.getSoftwareSessionAsJson = exports.logIt = exports.logEvent = exports.getExtensionName = exports.getExtensionDisplayName = exports.openFileInEditor = exports.displayReadmeIfNotExists = exports.getImagesDir = exports.getLocalREADMEFile = exports.getPluginEventsFile = exports.getSoftwareDataStoreFile = exports.getSoftwareSessionFile = exports.jwtExists = exports.softwareSessionFileExists = exports.getSoftwareDir = exports.getDailyReportSummaryFile = exports.getProjectContributorCodeSummaryFile = exports.getProjectCodeSummaryFile = exports.getSummaryInfoFile = exports.getCommitSummaryFile = exports.getDashboardFile = exports.getOsUsername = exports.getCommandResultList = exports.getCommandResultLine = exports.getOs = exports.getHostname = exports.isMac = exports.isWindows = exports.isLinux = exports.isEmptyObj = exports.isStatusBarTextVisible = exports.toggleStatusBar = exports.handleCodeTimeStatusToggle = exports.showStatus = exports.showLoading = exports.getItem = exports.setItem = exports.validateEmail = exports.getProjectFolder = exports.getWorkspaceFolderByPath = exports.getRootPathForFile = exports.isFileOpen = exports.getNumberOfTextDocumentsOpen = exports.getFirstWorkspaceFolder = exports.getWorkspaceFolders = exports.findFirstActiveDirectoryOrWorkspaceDirectory = exports.getActiveProjectWorkspace = exports.getFileAgeInDays = exports.isGitProject = exports.getSessionFileCreateTime = exports.codeTimeExtInstalled = exports.isCodeTimeMetricsFile = exports.getVersion = exports.getPluginType = exports.getPluginName = exports.getPluginId = exports.getWorkspaceName = exports.MARKER_WIDTH = exports.TABLE_WIDTH = exports.DASHBOARD_LRG_COL_WIDTH = exports.DASHBOARD_COL_WIDTH = exports.DASHBOARD_VALUE_WIDTH = exports.DASHBOARD_LABEL_WIDTH = exports.alpha = void 0;
var extension_1 = require('../extension');
var vscode_1 = require('vscode');
var Constants_1 = require('./Constants');
var DataController_1 = require('./DataController');
var SessionSummaryData_1 = require('./storage/SessionSummaryData');
var EventManager_1 = require('./managers/EventManager');
var HttpClient_1 = require('./http/HttpClient');
var OnboardManager_1 = require('./user/OnboardManager');
var moment = require('moment-timezone');
var open = require('open');
var exec = require('child_process').exec;
var fs = require('fs');
var os = require('os');
var crypto = require('crypto');
var path = require('path');
exports.alpha = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
exports.DASHBOARD_LABEL_WIDTH = 28;
exports.DASHBOARD_VALUE_WIDTH = 36;
exports.DASHBOARD_COL_WIDTH = 21;
exports.DASHBOARD_LRG_COL_WIDTH = 38;
exports.TABLE_WIDTH = 80;
exports.MARKER_WIDTH = 4;
var NUMBER_IN_EMAIL_REGEX = new RegExp('^\\d+\\+');
var dayFormat = 'YYYY-MM-DD';
var dayTimeFormat = 'LLLL';
var showStatusBarText = true;
var extensionName = null;
var extensionDisplayName = null; // Code Time or Music Time
var workspace_name = null;
function getWorkspaceName() {
  if (!workspace_name) {
    workspace_name = randomCode();
  }
  return workspace_name;
}
exports.getWorkspaceName = getWorkspaceName;
function getPluginId() {
  return Constants_1.CODE_TIME_PLUGIN_ID;
}
exports.getPluginId = getPluginId;
function getPluginName() {
  return Constants_1.CODE_TIME_EXT_ID;
}
exports.getPluginName = getPluginName;
function getPluginType() {
  return Constants_1.CODE_TIME_TYPE;
}
exports.getPluginType = getPluginType;
function getVersion() {
  var extension = vscode_1.extensions.getExtension(
    Constants_1.CODE_TIME_EXT_ID,
  );
  return extension.packageJSON.version;
}
exports.getVersion = getVersion;
function isCodeTimeMetricsFile(fileName) {
  fileName = fileName || '';
  if (fileName.includes('.software') && fileName.includes('CodeTime')) {
    return true;
  }
  return false;
}
exports.isCodeTimeMetricsFile = isCodeTimeMetricsFile;
function codeTimeExtInstalled() {
  var codeTimeExt = vscode_1.extensions.getExtension(
    Constants_1.CODE_TIME_EXT_ID,
  );
  return codeTimeExt ? true : false;
}
exports.codeTimeExtInstalled = codeTimeExtInstalled;
function getSessionFileCreateTime() {
  var sessionFile = getSoftwareSessionFile();
  var stat = fs.statSync(sessionFile);
  if (stat.birthtime) {
    return stat.birthtime;
  }
  return stat.ctime;
}
exports.getSessionFileCreateTime = getSessionFileCreateTime;
function isGitProject(projectDir) {
  if (!projectDir) {
    return false;
  }
  if (!fs.existsSync(path.join(projectDir, '.git'))) {
    return false;
  }
  return true;
}
exports.isGitProject = isGitProject;
/**
 * This method is sync, no need to await on it.
 * @param file
 */
function getFileAgeInDays(file) {
  if (!fs.existsSync(file)) {
    return 0;
  }
  var stat = fs.statSync(file);
  var creationTimeSec = stat.birthtimeMs || stat.ctimeMs;
  // convert to seconds
  creationTimeSec /= 1000;
  var daysDiff = moment
    .duration(moment().diff(moment.unix(creationTimeSec)))
    .asDays();
  // if days diff is 0 then use 200, otherwise 100 per day, which is equal to a 9000 limit for 90 days
  return daysDiff > 1 ? parseInt(daysDiff, 10) : 1;
}
exports.getFileAgeInDays = getFileAgeInDays;
function getActiveProjectWorkspace() {
  var activeDocPath = findFirstActiveDirectoryOrWorkspaceDirectory();
  if (activeDocPath) {
    if (
      vscode_1.workspace.workspaceFolders &&
      vscode_1.workspace.workspaceFolders.length > 0
    ) {
      for (var i = 0; i < vscode_1.workspace.workspaceFolders.length; i++) {
        var workspaceFolder = vscode_1.workspace.workspaceFolders[i];
        var folderPath = workspaceFolder.uri.fsPath;
        if (activeDocPath.indexOf(folderPath) !== -1) {
          return workspaceFolder;
        }
      }
    }
  }
  return null;
}
exports.getActiveProjectWorkspace = getActiveProjectWorkspace;
function findFirstActiveDirectoryOrWorkspaceDirectory() {
  if (getNumberOfTextDocumentsOpen() > 0) {
    // check if the .software/CodeTime has already been opened
    for (var i = 0; i < vscode_1.workspace.textDocuments.length; i++) {
      var docObj = vscode_1.workspace.textDocuments[i];
      if (docObj.fileName) {
        var dir = getRootPathForFile(docObj.fileName);
        if (dir) {
          return dir;
        }
      }
    }
  }
  var folder = getFirstWorkspaceFolder();
  if (folder) {
    return folder.uri.fsPath;
  }
  return '';
}
exports.findFirstActiveDirectoryOrWorkspaceDirectory = findFirstActiveDirectoryOrWorkspaceDirectory;
/**
 * These will return the workspace folders.
 * use the uri.fsPath to get the full path
 * use the name to get the folder name
 */
function getWorkspaceFolders() {
  var folders = [];
  if (
    vscode_1.workspace.workspaceFolders &&
    vscode_1.workspace.workspaceFolders.length > 0
  ) {
    for (var i = 0; i < vscode_1.workspace.workspaceFolders.length; i++) {
      var workspaceFolder = vscode_1.workspace.workspaceFolders[i];
      var folderUri = workspaceFolder.uri;
      if (folderUri && folderUri.fsPath) {
        // paths.push(folderUri.fsPath);
        folders.push(workspaceFolder);
      }
    }
  }
  return folders;
}
exports.getWorkspaceFolders = getWorkspaceFolders;
function getFirstWorkspaceFolder() {
  var workspaceFolders = getWorkspaceFolders();
  if (workspaceFolders && workspaceFolders.length) {
    return workspaceFolders[0];
  }
  return null;
}
exports.getFirstWorkspaceFolder = getFirstWorkspaceFolder;
function getNumberOfTextDocumentsOpen() {
  return vscode_1.workspace.textDocuments
    ? vscode_1.workspace.textDocuments.length
    : 0;
}
exports.getNumberOfTextDocumentsOpen = getNumberOfTextDocumentsOpen;
function isFileOpen(fileName) {
  if (getNumberOfTextDocumentsOpen() > 0) {
    // check if the .software/CodeTime has already been opened
    for (var i = 0; i < vscode_1.workspace.textDocuments.length; i++) {
      var docObj = vscode_1.workspace.textDocuments[i];
      if (docObj.fileName && docObj.fileName === fileName) {
        return true;
      }
    }
  }
  return false;
}
exports.isFileOpen = isFileOpen;
function getRootPathForFile(fileName) {
  var folder = getProjectFolder(fileName);
  if (folder) {
    return folder.uri.fsPath;
  }
  return null;
}
exports.getRootPathForFile = getRootPathForFile;
function getWorkspaceFolderByPath(path) {
  var liveshareFolder = null;
  if (
    vscode_1.workspace.workspaceFolders &&
    vscode_1.workspace.workspaceFolders.length > 0
  ) {
    for (var i = 0; i < vscode_1.workspace.workspaceFolders.length; i++) {
      var workspaceFolder = vscode_1.workspace.workspaceFolders[i];
      if (path.includes(workspaceFolder.uri.fsPath)) {
        return workspaceFolder;
      }
    }
  }
  return null;
}
exports.getWorkspaceFolderByPath = getWorkspaceFolderByPath;
function getProjectFolder(fileName) {
  var liveshareFolder = null;
  if (
    vscode_1.workspace.workspaceFolders &&
    vscode_1.workspace.workspaceFolders.length > 0
  ) {
    for (var i = 0; i < vscode_1.workspace.workspaceFolders.length; i++) {
      var workspaceFolder = vscode_1.workspace.workspaceFolders[i];
      if (workspaceFolder.uri) {
        var isVslsScheme = workspaceFolder.uri.scheme === 'vsls' ? true : false;
        if (isVslsScheme) {
          liveshareFolder = workspaceFolder;
        }
        var folderUri = workspaceFolder.uri;
        if (
          folderUri &&
          folderUri.fsPath &&
          !isVslsScheme &&
          fileName.includes(folderUri.fsPath)
        ) {
          return workspaceFolder;
        }
      }
    }
  }
  // wasn't found but if liveshareFolder was found, return that
  if (liveshareFolder) {
    return liveshareFolder;
  }
  return null;
}
exports.getProjectFolder = getProjectFolder;
function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}
exports.validateEmail = validateEmail;
function setItem(key, value) {
  // now save it on file
  var jsonObj = getSoftwareSessionAsJson();
  jsonObj[key] = value;
  var content = JSON.stringify(jsonObj);
  var sessionFile = getSoftwareSessionFile();
  fs.writeFileSync(sessionFile, content, function (err) {
    if (err)
      logIt('Error writing to the Software session file: ' + err.message);
  });
}
exports.setItem = setItem;
function getItem(key) {
  // get it from the file
  var jsonObj = getSoftwareSessionAsJson();
  var val = jsonObj[key] || null;
  return val;
}
exports.getItem = getItem;
function showLoading() {
  var loadingMsg = '⏳ code time metrics';
  updateStatusBar(loadingMsg, '');
}
exports.showLoading = showLoading;
function showStatus(fullMsg, tooltip) {
  if (!tooltip) {
    tooltip = 'Active code time today. Click to see more from Code Time.';
  }
  updateStatusBar(fullMsg, tooltip);
}
exports.showStatus = showStatus;
function handleCodeTimeStatusToggle() {
  toggleStatusBar();
}
exports.handleCodeTimeStatusToggle = handleCodeTimeStatusToggle;
function updateStatusBar(msg, tooltip) {
  var loggedInName = getItem('name');
  var userInfo = '';
  if (loggedInName && loggedInName !== '') {
    userInfo = ' Connected as ' + loggedInName;
  }
  if (!tooltip) {
    tooltip = 'Click to see more from Code Time';
  }
  if (!showStatusBarText) {
    // add the message to the tooltip
    tooltip = msg + ' | ' + tooltip;
  }
  if (!extension_1.getStatusBarItem()) {
    return;
  }
  extension_1.getStatusBarItem().tooltip = '' + tooltip + userInfo;
  if (!showStatusBarText) {
    extension_1.getStatusBarItem().text = '$(clock)';
  } else {
    extension_1.getStatusBarItem().text = msg;
  }
}
function toggleStatusBar() {
  showStatusBarText = !showStatusBarText;
  SessionSummaryData_1.updateStatusBarWithSummaryData();
}
exports.toggleStatusBar = toggleStatusBar;
function isStatusBarTextVisible() {
  return showStatusBarText;
}
exports.isStatusBarTextVisible = isStatusBarTextVisible;
function isEmptyObj(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}
exports.isEmptyObj = isEmptyObj;
function isLinux() {
  return isWindows() || isMac() ? false : true;
}
exports.isLinux = isLinux;
// process.platform return the following...
//   -> 'darwin', 'freebsd', 'linux', 'sunos' or 'win32'
function isWindows() {
  return process.platform.indexOf('win32') !== -1;
}
exports.isWindows = isWindows;
function isMac() {
  return process.platform.indexOf('darwin') !== -1;
}
exports.isMac = isMac;
function getHostname() {
  return __awaiter(this, void 0, void 0, function () {
    var hostname;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, getCommandResultLine('hostname')];
        case 1:
          hostname = _a.sent();
          return [2 /*return*/, hostname];
      }
    });
  });
}
exports.getHostname = getHostname;
function getOs() {
  var parts = [];
  var osType = os.type();
  if (osType) {
    parts.push(osType);
  }
  var osRelease = os.release();
  if (osRelease) {
    parts.push(osRelease);
  }
  var platform = os.platform();
  if (platform) {
    parts.push(platform);
  }
  if (parts.length > 0) {
    return parts.join('_');
  }
  return '';
}
exports.getOs = getOs;
function getCommandResultLine(cmd, projectDir) {
  if (projectDir === void 0) {
    projectDir = null;
  }
  return __awaiter(this, void 0, void 0, function () {
    var resultList, resultLine, i, line;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, getCommandResultList(cmd, projectDir)];
        case 1:
          resultList = _a.sent();
          resultLine = '';
          if (resultList && resultList.length) {
            for (i = 0; i < resultList.length; i++) {
              line = resultList[i];
              if (line && line.trim().length > 0) {
                resultLine = line.trim();
                break;
              }
            }
          }
          return [2 /*return*/, resultLine];
      }
    });
  });
}
exports.getCommandResultLine = getCommandResultLine;
function getCommandResultList(cmd, projectDir) {
  if (projectDir === void 0) {
    projectDir = null;
  }
  return __awaiter(this, void 0, void 0, function () {
    var result, contentList;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, wrapExecPromise('' + cmd, projectDir)];
        case 1:
          result = _a.sent();
          if (!result) {
            return [2 /*return*/, []];
          }
          contentList = result
            .replace(/\r\n/g, '\r')
            .replace(/\n/g, '\r')
            .split(/\r/);
          return [2 /*return*/, contentList];
      }
    });
  });
}
exports.getCommandResultList = getCommandResultList;
function getOsUsername() {
  return __awaiter(this, void 0, void 0, function () {
    var username;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          username = os.userInfo().username;
          if (!(!username || username.trim() === '')) return [3 /*break*/, 2];
          return [4 /*yield*/, getCommandResultLine('whoami')];
        case 1:
          username = _a.sent();
          _a.label = 2;
        case 2:
          return [2 /*return*/, username];
      }
    });
  });
}
exports.getOsUsername = getOsUsername;
function getDashboardFile() {
  var file = getSoftwareDir();
  if (isWindows()) {
    file += '\\CodeTime.txt';
  } else {
    file += '/CodeTime.txt';
  }
  return file;
}
exports.getDashboardFile = getDashboardFile;
function getCommitSummaryFile() {
  var file = getSoftwareDir();
  if (isWindows()) {
    file += '\\CommitSummary.txt';
  } else {
    file += '/CommitSummary.txt';
  }
  return file;
}
exports.getCommitSummaryFile = getCommitSummaryFile;
function getSummaryInfoFile() {
  var file = getSoftwareDir();
  if (isWindows()) {
    file += '\\SummaryInfo.txt';
  } else {
    file += '/SummaryInfo.txt';
  }
  return file;
}
exports.getSummaryInfoFile = getSummaryInfoFile;
function getProjectCodeSummaryFile() {
  var file = getSoftwareDir();
  if (isWindows()) {
    file += '\\ProjectCodeSummary.txt';
  } else {
    file += '/ProjectCodeSummary.txt';
  }
  return file;
}
exports.getProjectCodeSummaryFile = getProjectCodeSummaryFile;
function getProjectContributorCodeSummaryFile() {
  var file = getSoftwareDir();
  if (isWindows()) {
    file += '\\ProjectContributorCodeSummary.txt';
  } else {
    file += '/ProjectContributorCodeSummary.txt';
  }
  return file;
}
exports.getProjectContributorCodeSummaryFile = getProjectContributorCodeSummaryFile;
function getDailyReportSummaryFile() {
  var file = getSoftwareDir();
  if (isWindows()) {
    file += '\\DailyReportSummary.txt';
  } else {
    file += '/DailyReportSummary.txt';
  }
  return file;
}
exports.getDailyReportSummaryFile = getDailyReportSummaryFile;
function getSoftwareDir(autoCreate) {
  if (autoCreate === void 0) {
    autoCreate = true;
  }
  var homedir = os.homedir();
  var softwareDataDir = homedir;
  if (isWindows()) {
    softwareDataDir += '\\.software';
  } else {
    softwareDataDir += '/.software';
  }
  if (autoCreate && !fs.existsSync(softwareDataDir)) {
    fs.mkdirSync(softwareDataDir);
  }
  return softwareDataDir;
}
exports.getSoftwareDir = getSoftwareDir;
function softwareSessionFileExists() {
  // don't auto create the file
  var file = getSoftwareSessionFile();
  // check if it exists
  var sessionFileExists = fs.existsSync(file);
  return sessionFileExists;
}
exports.softwareSessionFileExists = softwareSessionFileExists;
function jwtExists() {
  var jwt = getItem('jwt');
  return !jwt ? false : true;
}
exports.jwtExists = jwtExists;
function getSoftwareSessionFile() {
  var file = getSoftwareDir();
  if (isWindows()) {
    file += '\\session.json';
  } else {
    file += '/session.json';
  }
  return file;
}
exports.getSoftwareSessionFile = getSoftwareSessionFile;
function getSoftwareDataStoreFile() {
  var file = getSoftwareDir();
  if (isWindows()) {
    file += '\\data.json';
  } else {
    file += '/data.json';
  }
  return file;
}
exports.getSoftwareDataStoreFile = getSoftwareDataStoreFile;
function getPluginEventsFile() {
  var file = getSoftwareDir();
  if (isWindows()) {
    file += '\\events.json';
  } else {
    file += '/events.json';
  }
  return file;
}
exports.getPluginEventsFile = getPluginEventsFile;
function getLocalREADMEFile() {
  var file = __dirname;
  if (isWindows()) {
    file += '\\README.md';
  } else {
    file += '/README.md';
  }
  return file;
}
exports.getLocalREADMEFile = getLocalREADMEFile;
function getImagesDir() {
  var dir = __dirname;
  if (isWindows()) {
    dir += '\\images';
  } else {
    dir += '/images';
  }
  return dir;
}
exports.getImagesDir = getImagesDir;
function displayReadmeIfNotExists(override) {
  if (override === void 0) {
    override = false;
  }
  var displayedReadme = getItem('vscode_CtReadme');
  if (!displayedReadme || override) {
    var readmeUri = vscode_1.Uri.file(getLocalREADMEFile());
    vscode_1.commands.executeCommand(
      'markdown.showPreview',
      readmeUri,
      vscode_1.ViewColumn.One,
    );
    setItem('vscode_CtReadme', true);
  }
}
exports.displayReadmeIfNotExists = displayReadmeIfNotExists;
function openFileInEditor(file) {
  vscode_1.workspace.openTextDocument(file).then(
    function (doc) {
      // Show open document and set focus
      vscode_1.window
        .showTextDocument(doc, 1, false)
        .then(undefined, function (error) {
          if (error.message) {
            vscode_1.window.showErrorMessage(error.message);
          } else {
            logIt(error);
          }
        });
    },
    function (error) {
      if (
        error.message &&
        error.message.toLowerCase().includes('file not found')
      ) {
        vscode_1.window.showErrorMessage(
          'Cannot open ' + file + '.  File not found.',
        );
      } else {
        logIt(error);
      }
    },
  );
}
exports.openFileInEditor = openFileInEditor;
function getExtensionDisplayName() {
  if (extensionDisplayName) {
    return extensionDisplayName;
  }
  var extInfoFile = __dirname;
  if (isWindows()) {
    extInfoFile += '\\extensioninfo.json';
  } else {
    extInfoFile += '/extensioninfo.json';
  }
  if (fs.existsSync(extInfoFile)) {
    var content = fs.readFileSync(extInfoFile).toString();
    if (content) {
      try {
        var data = JSON.parse(cleanJsonString(content));
        if (data) {
          extensionDisplayName = data.displayName;
        }
      } catch (e) {
        logIt('unable to read ext info name: ' + e.message);
      }
    }
  }
  if (!extensionDisplayName) {
    extensionDisplayName = 'Code Time';
  }
  return extensionDisplayName;
}
exports.getExtensionDisplayName = getExtensionDisplayName;
function getExtensionName() {
  if (extensionName) {
    return extensionName;
  }
  var extInfoFile = __dirname;
  if (isWindows()) {
    extInfoFile += '\\extensioninfo.json';
  } else {
    extInfoFile += '/extensioninfo.json';
  }
  if (fs.existsSync(extInfoFile)) {
    var content = fs.readFileSync(extInfoFile).toString();
    if (content) {
      try {
        var data = JSON.parse(cleanJsonString(content));
        if (data) {
          extensionName = data.name;
        }
      } catch (e) {
        logIt('unable to read ext info name: ' + e.message);
      }
    }
  }
  if (!extensionName) {
    extensionName = 'swdc-vscode';
  }
  return extensionName;
}
exports.getExtensionName = getExtensionName;
function logEvent(message) {
  var logEvents = DataController_1.getToggleFileEventLoggingState();
  if (logEvents) {
    console.log(getExtensionName() + ': ' + message);
  }
}
exports.logEvent = logEvent;
function logIt(message) {
  console.log(getExtensionName() + ': ' + message);
}
exports.logIt = logIt;
function getSoftwareSessionAsJson() {
  var data = null;
  var sessionFile = getSoftwareSessionFile();
  if (fs.existsSync(sessionFile)) {
    var content = fs.readFileSync(sessionFile).toString();
    if (content) {
      try {
        data = JSON.parse(cleanJsonString(content));
      } catch (e) {
        logIt('unable to read session info: ' + e.message);
        // error trying to read the session file, delete it
        deleteFile(sessionFile);
        data = {};
      }
    }
  }
  return data ? data : {};
}
exports.getSoftwareSessionAsJson = getSoftwareSessionAsJson;
function showOfflinePrompt(addReconnectMsg) {
  if (addReconnectMsg === void 0) {
    addReconnectMsg = false;
  }
  return __awaiter(this, void 0, void 0, function () {
    var infoMsg;
    return __generator(this, function (_a) {
      infoMsg = 'Our service is temporarily unavailable. ';
      if (addReconnectMsg) {
        infoMsg +=
          'We will try to reconnect again in 10 minutes. Your status bar will not update at this time.';
      } else {
        infoMsg += 'Please try again later.';
      }
      // set the last update time so we don't try to ask too frequently
      vscode_1.window.showInformationMessage.apply(
        vscode_1.window,
        __spreadArrays([infoMsg], ['OK']),
      );
      return [2 /*return*/];
    });
  });
}
exports.showOfflinePrompt = showOfflinePrompt;
function nowInSecs() {
  return Math.round(Date.now() / 1000);
}
exports.nowInSecs = nowInSecs;
function getOffsetSeconds() {
  var d = new Date();
  return d.getTimezoneOffset() * 60;
}
exports.getOffsetSeconds = getOffsetSeconds;
function getFormattedDay(unixSeconds) {
  return moment.unix(unixSeconds).format(dayFormat);
}
exports.getFormattedDay = getFormattedDay;
function isNewDay() {
  var day = getNowTimes().day;
  var currentDay = getItem('currentDay');
  return currentDay !== day ? true : false;
}
exports.isNewDay = isNewDay;
/**
 * now - current time in UTC (Moment object)
 * now_in_sec - current time in UTC, unix seconds
 * offset_in_sec - timezone offset from UTC (sign = -420 for Pacific Time)
 * local_now_in_sec - current time in UTC plus the timezone offset
 * utcDay - current day in UTC
 * day - current day in local TZ
 * localDayTime - current day in local TZ
 *
 * Example:
 * { day: "2020-04-07", localDayTime: "Tuesday, April 7, 2020 9:48 PM",
 * local_now_in_sec: 1586296107, now: "2020-04-08T04:48:27.120Z", now_in_sec: 1586321307,
 * offset_in_sec: -25200, utcDay: "2020-04-08" }
 */
function getNowTimes() {
  var now = moment.utc();
  var now_in_sec = now.unix();
  var offset_in_sec = moment().utcOffset() * 60;
  var local_now_in_sec = now_in_sec + offset_in_sec;
  var utcDay = now.format(dayFormat);
  var day = moment().format(dayFormat);
  var localDayTime = moment().format(dayTimeFormat);
  return {
    now: now,
    now_in_sec: now_in_sec,
    offset_in_sec: offset_in_sec,
    local_now_in_sec: local_now_in_sec,
    utcDay: utcDay,
    day: day,
    localDayTime: localDayTime,
  };
}
exports.getNowTimes = getNowTimes;
function randomCode() {
  return crypto
    .randomBytes(16)
    .map(function (value) {
      return exports.alpha.charCodeAt(
        Math.floor((value * exports.alpha.length) / 256),
      );
    })
    .toString();
}
exports.randomCode = randomCode;
function deleteFile(file) {
  // if the file exists, get it
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
}
exports.deleteFile = deleteFile;
function execPromise(command, opts) {
  return new Promise(function (resolve, reject) {
    exec(command, opts, function (error, stdout, stderr) {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout.trim());
    });
  });
}
function normalizeGithubEmail(email, filterOutNonEmails) {
  if (filterOutNonEmails === void 0) {
    filterOutNonEmails = true;
  }
  if (email) {
    if (
      filterOutNonEmails &&
      (email.endsWith('github.com') || email.includes('users.noreply'))
    ) {
      return null;
    } else {
      var found = email.match(NUMBER_IN_EMAIL_REGEX);
      if (found && email.includes('users.noreply')) {
        // filter out the ones that look like
        // 2342353345+username@users.noreply.github.com"
        return null;
      }
    }
  }
  return email;
}
exports.normalizeGithubEmail = normalizeGithubEmail;
function getSongDisplayName(name) {
  if (!name) {
    return '';
  }
  name = name.trim();
  if (name.length > 11) {
    return name.substring(0, 10) + '...';
  }
  return name;
}
exports.getSongDisplayName = getSongDisplayName;
function getGitEmail() {
  return __awaiter(this, void 0, void 0, function () {
    var workspaceFolders, i, projectDir, email;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          workspaceFolders = getWorkspaceFolders();
          if (!workspaceFolders || workspaceFolders.length === 0) {
            return [2 /*return*/, null];
          }
          i = 0;
          _a.label = 1;
        case 1:
          if (!(i < workspaceFolders.length)) return [3 /*break*/, 4];
          projectDir = workspaceFolders[i].uri.fsPath;
          return [
            4 /*yield*/,
            wrapExecPromise('git config user.email', projectDir),
          ];
        case 2:
          email = _a.sent();
          if (email) {
            return [2 /*return*/, email];
          }
          _a.label = 3;
        case 3:
          i++;
          return [3 /*break*/, 1];
        case 4:
          return [2 /*return*/, null];
      }
    });
  });
}
exports.getGitEmail = getGitEmail;
function wrapExecPromise(cmd, projectDir) {
  return __awaiter(this, void 0, void 0, function () {
    var result, opts, e_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          result = null;
          _a.label = 1;
        case 1:
          _a.trys.push([1, 3, , 4]);
          opts =
            projectDir !== undefined && projectDir !== null
              ? {cwd: projectDir}
              : {};
          return [
            4 /*yield*/,
            execPromise(cmd, opts)['catch'](function (e) {
              if (e.message) {
                console.log(e.message);
              }
              return null;
            }),
          ];
        case 2:
          result = _a.sent();
          return [3 /*break*/, 4];
        case 3:
          e_1 = _a.sent();
          if (e_1.message) {
            console.log(e_1.message);
          }
          result = null;
          return [3 /*break*/, 4];
        case 4:
          return [2 /*return*/, result];
      }
    });
  });
}
exports.wrapExecPromise = wrapExecPromise;
function launchWebUrl(url) {
  open(url);
}
exports.launchWebUrl = launchWebUrl;
/**
 * @param num The number to round
 * @param precision The number of decimal places to preserve
 */
function roundUp(num, precision) {
  precision = Math.pow(10, precision);
  return Math.ceil(num * precision) / precision;
}
function formatNumber(num) {
  var str = '';
  num = num ? parseFloat(num) : 0;
  if (num >= 1000) {
    str = num.toLocaleString();
  } else if (num % 1 === 0) {
    str = num.toFixed(0);
  } else {
    str = num.toFixed(2);
  }
  return str;
}
exports.formatNumber = formatNumber;
/**
 * humanize the minutes
 */
function humanizeMinutes(min) {
  min = parseInt(min, 0) || 0;
  var str = '';
  if (min === 60) {
    str = '1 hr';
  } else if (min > 60) {
    var hrs = parseFloat(min) / 60;
    var roundedTime = roundUp(hrs, 1);
    str = roundedTime.toFixed(1) + ' hrs';
  } else if (min === 1) {
    str = '1 min';
  } else {
    // less than 60 seconds
    str = min.toFixed(0) + ' min';
  }
  return str;
}
exports.humanizeMinutes = humanizeMinutes;
function launchLogin(loginType) {
  if (loginType === void 0) {
    loginType = 'software';
  }
  return __awaiter(this, void 0, void 0, function () {
    var serverOnline, loginUrl;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, HttpClient_1.serverIsAvailable()];
        case 1:
          serverOnline = _a.sent();
          if (!serverOnline) {
            showOfflinePrompt();
            return [2 /*return*/];
          }
          return [4 /*yield*/, buildLoginUrl(serverOnline, loginType)];
        case 2:
          loginUrl = _a.sent();
          setItem('authType', loginType);
          launchWebUrl(loginUrl);
          // use the defaults
          DataController_1.refetchUserStatusLazily();
          return [2 /*return*/];
      }
    });
  });
}
exports.launchLogin = launchLogin;
/**
 * check if the user needs to see the login prompt or not
 */
function showLoginPrompt(serverIsOnline) {
  return __awaiter(this, void 0, void 0, function () {
    var infoMsg, selection, eventName, eventType, loginUrl;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          infoMsg =
            'Finish creating your account and see rich data visualizations.';
          return [
            4 /*yield*/,
            vscode_1.window.showInformationMessage.apply(
              vscode_1.window,
              __spreadArrays(
                [infoMsg, {modal: true}],
                [Constants_1.LOGIN_LABEL],
              ),
            ),
          ];
        case 1:
          selection = _a.sent();
          eventName = '';
          eventType = '';
          if (!(selection === Constants_1.LOGIN_LABEL)) return [3 /*break*/, 3];
          return [4 /*yield*/, buildLoginUrl(serverIsOnline)];
        case 2:
          loginUrl = _a.sent();
          launchWebUrl(loginUrl);
          DataController_1.refetchUserStatusLazily();
          eventName = 'click';
          eventType = 'mouse';
          return [3 /*break*/, 4];
        case 3:
          // create an event showing login was not selected
          eventName = 'close';
          eventType = 'window';
          _a.label = 4;
        case 4:
          EventManager_1.EventManager.getInstance().createCodeTimeEvent(
            eventType,
            eventName,
            'OnboardPrompt',
          );
          return [2 /*return*/];
      }
    });
  });
}
exports.showLoginPrompt = showLoginPrompt;
function buildLoginUrl(serverOnline, loginType) {
  if (loginType === void 0) {
    loginType = 'software';
  }
  return __awaiter(this, void 0, void 0, function () {
    var jwt, encodedJwt, loginUrl;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          jwt = getItem('jwt');
          if (!!jwt) return [3 /*break*/, 2];
          return [4 /*yield*/, DataController_1.getAppJwt(serverOnline)];
        case 1:
          // we should always have a jwt, but if  not create one
          // this will serve as a temp token until they've onboarded
          jwt = _a.sent();
          setItem('jwt', jwt);
          _a.label = 2;
        case 2:
          if (jwt) {
            encodedJwt = encodeURIComponent(jwt);
            loginUrl = '';
            if (loginType === 'software') {
              loginUrl =
                Constants_1.launch_url +
                '/email-signup?token=' +
                encodedJwt +
                '&plugin=' +
                getPluginType() +
                '&auth=software';
            } else if (loginType === 'github') {
              loginUrl =
                Constants_1.api_endpoint +
                '/auth/github?token=' +
                encodedJwt +
                '&plugin=' +
                getPluginType() +
                '&redirect=' +
                Constants_1.launch_url;
            } else if (loginType === 'google') {
              loginUrl =
                Constants_1.api_endpoint +
                '/auth/google?token=' +
                encodedJwt +
                '&plugin=' +
                getPluginType() +
                '&redirect=' +
                Constants_1.launch_url;
            }
            return [2 /*return*/, loginUrl];
          } else {
            // no need to build an onboarding url if we dn't have the token
            return [2 /*return*/, Constants_1.launch_url];
          }
          return [2 /*return*/];
      }
    });
  });
}
exports.buildLoginUrl = buildLoginUrl;
function connectAtlassian() {
  return __awaiter(this, void 0, void 0, function () {
    var serverOnline, jwt, encodedJwt, connectAtlassianAuth;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, HttpClient_1.serverIsAvailable()];
        case 1:
          serverOnline = _a.sent();
          if (!serverOnline) {
            showOfflinePrompt();
            return [2 /*return*/];
          }
          jwt = getItem('jwt');
          if (!!jwt) return [3 /*break*/, 3];
          return [4 /*yield*/, DataController_1.getAppJwt(serverOnline)];
        case 2:
          // we should always have a jwt, but if  not create one
          // this will serve as a temp token until they've onboarded
          jwt = _a.sent();
          setItem('jwt', jwt);
          _a.label = 3;
        case 3:
          encodedJwt = encodeURIComponent(jwt);
          connectAtlassianAuth =
            Constants_1.api_endpoint +
            '/auth/atlassian?token=' +
            jwt +
            '&plugin=' +
            getPluginType();
          launchWebUrl(connectAtlassianAuth);
          OnboardManager_1.refetchAtlassianOauthLazily();
          return [2 /*return*/];
      }
    });
  });
}
exports.connectAtlassian = connectAtlassian;
function showInformationMessage(message) {
  return vscode_1.window.showInformationMessage('' + message);
}
exports.showInformationMessage = showInformationMessage;
function showWarningMessage(message) {
  return vscode_1.window.showWarningMessage('' + message);
}
exports.showWarningMessage = showWarningMessage;
function getDashboardRow(label, value, isSectionHeader) {
  if (isSectionHeader === void 0) {
    isSectionHeader = false;
  }
  var spacesRequired = exports.DASHBOARD_LABEL_WIDTH - label.length;
  var spaces = getSpaces(spacesRequired);
  var dashboardVal = getDashboardValue(value, isSectionHeader);
  var content = '' + label + spaces + dashboardVal + '\n';
  if (isSectionHeader) {
    // add 3 to account for the " : " between the columns
    var dashLen = content.length;
    for (var i = 0; i < dashLen; i++) {
      content += '-';
    }
    content += '\n';
  }
  return content;
}
exports.getDashboardRow = getDashboardRow;
function getDashboardBottomBorder() {
  var content = '';
  var len = exports.DASHBOARD_LABEL_WIDTH + exports.DASHBOARD_VALUE_WIDTH;
  for (var i = 0; i < len; i++) {
    content += '-';
  }
  content += '\n\n';
  return content;
}
exports.getDashboardBottomBorder = getDashboardBottomBorder;
function getSectionHeader(label) {
  var content = label + '\n';
  // add 3 to account for the " : " between the columns
  var dashLen = exports.DASHBOARD_LABEL_WIDTH + exports.DASHBOARD_VALUE_WIDTH;
  for (var i = 0; i < dashLen; i++) {
    content += '-';
  }
  content += '\n';
  return content;
}
exports.getSectionHeader = getSectionHeader;
function formatRightAlignedTableLabel(label, col_width) {
  var spacesRequired = col_width - label.length;
  var spaces = '';
  if (spacesRequired > 0) {
    for (var i = 0; i < spacesRequired; i++) {
      spaces += ' ';
    }
  }
  return '' + spaces + label;
}
function getTableHeader(leftLabel, rightLabel, isFullTable) {
  if (isFullTable === void 0) {
    isFullTable = true;
  }
  // get the space between the two labels
  var fullLen = !isFullTable
    ? exports.TABLE_WIDTH - exports.DASHBOARD_COL_WIDTH
    : exports.TABLE_WIDTH;
  var spacesRequired = fullLen - leftLabel.length - rightLabel.length;
  var spaces = '';
  if (spacesRequired > 0) {
    var str = '';
    for (var i = 0; i < spacesRequired; i++) {
      spaces += ' ';
    }
  }
  return '' + leftLabel + spaces + rightLabel;
}
exports.getTableHeader = getTableHeader;
function getRightAlignedTableHeader(label) {
  var content = formatRightAlignedTableLabel(label, exports.TABLE_WIDTH) + '\n';
  for (var i = 0; i < exports.TABLE_WIDTH; i++) {
    content += '-';
  }
  content += '\n';
  return content;
}
exports.getRightAlignedTableHeader = getRightAlignedTableHeader;
function getSpaces(spacesRequired) {
  var spaces = '';
  if (spacesRequired > 0) {
    var str = '';
    for (var i = 0; i < spacesRequired; i++) {
      spaces += ' ';
    }
  }
  return spaces;
}
function getRowLabels(labels) {
  // for now 3 columns
  var content = '';
  var spacesRequired = 0;
  for (var i = 0; i < labels.length; i++) {
    var label = labels[i];
    if (i === 0) {
      content += label;
      // show a colon at the end of this column
      spacesRequired = exports.DASHBOARD_COL_WIDTH - content.length - 1;
      content += getSpaces(spacesRequired);
      content += ':';
    } else if (i === 1) {
      // middle column
      spacesRequired =
        exports.DASHBOARD_LRG_COL_WIDTH +
        exports.DASHBOARD_COL_WIDTH -
        content.length -
        label.length -
        1;
      content += getSpaces(spacesRequired);
      content += label + ' ';
    } else {
      // last column, get spaces until the end
      spacesRequired = exports.DASHBOARD_COL_WIDTH - label.length - 2;
      content += '| ';
      content += getSpaces(spacesRequired);
      content += label;
    }
  }
  content += '\n';
  return content;
}
exports.getRowLabels = getRowLabels;
function getColumnHeaders(labels) {
  // for now 3 columns
  var content = '';
  var spacesRequired = 0;
  for (var i = 0; i < labels.length; i++) {
    var label = labels[i];
    if (i === 0) {
      content += label;
    } else if (i === 1) {
      // middle column
      spacesRequired =
        exports.DASHBOARD_LRG_COL_WIDTH +
        exports.DASHBOARD_COL_WIDTH -
        content.length -
        label.length -
        1;
      content += getSpaces(spacesRequired);
      content += label + ' ';
    } else {
      // last column, get spaces until the end
      spacesRequired = exports.DASHBOARD_COL_WIDTH - label.length - 2;
      content += '| ';
      content += getSpaces(spacesRequired);
      content += label;
    }
  }
  content += '\n';
  for (var i = 0; i < exports.TABLE_WIDTH; i++) {
    content += '-';
  }
  content += '\n';
  return content;
}
exports.getColumnHeaders = getColumnHeaders;
function buildQueryString(obj) {
  var params = [];
  if (obj) {
    var keys = Object.keys(obj);
    if (keys && keys.length > 0) {
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var val = obj[key];
        if (val && val !== undefined) {
          var encodedVal = encodeURIComponent(val);
          params.push(key + '=' + encodedVal);
        }
      }
    }
  }
  if (params.length > 0) {
    return '?' + params.join('&');
  } else {
    return '';
  }
}
exports.buildQueryString = buildQueryString;
function getDashboardLabel(label, width) {
  if (width === void 0) {
    width = exports.DASHBOARD_LABEL_WIDTH;
  }
  return getDashboardDataDisplay(width, label);
}
function getDashboardValue(value, isSectionHeader) {
  if (isSectionHeader === void 0) {
    isSectionHeader = false;
  }
  var spacesRequired = exports.DASHBOARD_VALUE_WIDTH - value.length - 2;
  var spaces = getSpaces(spacesRequired);
  if (!isSectionHeader) {
    return ': ' + spaces + value;
  } else {
    // we won't show the column divider in the header
    return '  ' + spaces + value;
  }
}
function getDashboardDataDisplay(widthLen, data) {
  var content = '';
  for (var i = 0; i < widthLen; i++) {
    content += ' ';
  }
  return '' + content + data;
}
function createSpotifyIdFromUri(id) {
  if (id.indexOf('spotify:') === 0) {
    return id.substring(id.lastIndexOf(':') + 1);
  }
  return id;
}
exports.createSpotifyIdFromUri = createSpotifyIdFromUri;
function getFileType(fileName) {
  var fileType = '';
  var lastDotIdx = fileName.lastIndexOf('.');
  var len = fileName.length;
  if (lastDotIdx !== -1 && lastDotIdx < len - 1) {
    fileType = fileName.substring(lastDotIdx + 1);
  }
  return fileType;
}
exports.getFileType = getFileType;
function cleanJsonString(content) {
  content = content.replace(/\r\n/g, '').replace(/\n/g, '').trim();
  return content;
}
exports.cleanJsonString = cleanJsonString;
function getFileDataAsJson(file) {
  var data = null;
  if (fs.existsSync(file)) {
    var content = fs.readFileSync(file).toString();
    if (content) {
      try {
        data = JSON.parse(cleanJsonString(content));
      } catch (e) {
        logIt('unable to read session info: ' + e.message);
        // error trying to read the session file, delete it
        deleteFile(file);
      }
    }
  }
  return data;
}
exports.getFileDataAsJson = getFileDataAsJson;
function getFileDataArray(file) {
  var payloads = [];
  if (fs.existsSync(file)) {
    var content = fs.readFileSync(file).toString();
    try {
      var jsonData = JSON.parse(cleanJsonString(content));
      if (!Array.isArray(jsonData)) {
        payloads.push(jsonData);
      } else {
        payloads = jsonData;
      }
    } catch (e) {
      logIt('Error reading file array data: ' + e.message);
    }
  }
  return payloads;
}
exports.getFileDataArray = getFileDataArray;
function getFileDataPayloadsAsJson(file) {
  var payloads = [];
  if (fs.existsSync(file)) {
    var content = fs.readFileSync(file).toString();
    if (content) {
      payloads = content
        .split(/\r?\n/)
        .map(function (item) {
          var obj = null;
          if (item) {
            try {
              obj = JSON.parse(item);
            } catch (e) {
              //
            }
          }
          if (obj) {
            return obj;
          }
        })
        .filter(function (item) {
          return item;
        });
    }
  }
  return payloads;
}
exports.getFileDataPayloadsAsJson = getFileDataPayloadsAsJson;
