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
exports.createCommands = void 0;
var vscode_1 = require('vscode');
var DataController_1 = require('./DataController');
var MenuManager_1 = require('./menu/MenuManager');
var Util_1 = require('./Util');
var KpmProvider_1 = require('./tree/KpmProvider');
var CodeTimeMenuProvider_1 = require('./tree/CodeTimeMenuProvider');
var KpmProviderManager_1 = require('./tree/KpmProviderManager');
var ProjectCommitManager_1 = require('./menu/ProjectCommitManager');
var CodeTimeTeamProvider_1 = require('./tree/CodeTimeTeamProvider');
var ReportManager_1 = require('./menu/ReportManager');
var FileManager_1 = require('./managers/FileManager');
var Leaderboard_1 = require('../src/util/Leaderboard');
var Authentication_1 = require('../src/util/Authentication');
function createCommands(kpmController) {
  var _this = this;
  var cmds = [];
  cmds.push(kpmController);
  // MENU TREE: INIT
  var codetimeMenuTreeProvider = new CodeTimeMenuProvider_1.CodeTimeMenuProvider();
  var codetimeMenuTreeView = vscode_1.window.createTreeView('ct-menu-tree', {
    treeDataProvider: codetimeMenuTreeProvider,
    showCollapseAll: false,
  });
  codetimeMenuTreeProvider.bindView(codetimeMenuTreeView);
  cmds.push(
    CodeTimeMenuProvider_1.connectCodeTimeMenuTreeView(codetimeMenuTreeView),
  );
  // MENU TREE: REVEAL
  cmds.push(
    vscode_1.commands.registerCommand('codetime.displayTree', function () {
      codetimeMenuTreeProvider.revealTree();
    }),
  );
  // MENU TREE: REFRESH
  cmds.push(
    vscode_1.commands.registerCommand(
      'codetime.refreshCodetimeMenuTree',
      function () {
        codetimeMenuTreeProvider.refresh();
      },
    ),
  );
  // DAILY METRICS TREE: INIT
  var kpmTreeProvider = new KpmProvider_1.KpmProvider();
  var kpmTreeView = vscode_1.window.createTreeView('ct-metrics-tree', {
    treeDataProvider: kpmTreeProvider,
    showCollapseAll: false,
  });
  kpmTreeProvider.bindView(kpmTreeView);
  cmds.push(KpmProvider_1.connectKpmTreeView(kpmTreeView));
  // TEAM TREE: INIT
  var codetimeTeamTreeProvider = new CodeTimeTeamProvider_1.CodeTimeTeamProvider();
  var codetimeTeamTreeView = vscode_1.window.createTreeView('ct-team-tree', {
    treeDataProvider: codetimeTeamTreeProvider,
    showCollapseAll: false,
  });
  codetimeTeamTreeProvider.bindView(codetimeTeamTreeView);
  cmds.push(
    CodeTimeTeamProvider_1.connectCodeTimeTeamTreeView(codetimeTeamTreeView),
  );
  // TEAM TREE: REFRESH
  cmds.push(
    vscode_1.commands.registerCommand(
      'codetime.refreshCodetimeTeamTree',
      function () {
        codetimeTeamTreeProvider.refresh();
      },
    ),
  );
  cmds.push(
    vscode_1.commands.registerCommand('codetime.refreshTreeViews', function () {
      codetimeMenuTreeProvider.refresh();
      kpmTreeProvider.refresh();
      codetimeTeamTreeProvider.refresh();
    }),
  );
  // TEAM TREE: INVITE MEMBER
  cmds.push(
    vscode_1.commands.registerCommand('codetime.inviteTeamMember', function (
      item,
    ) {
      return __awaiter(_this, void 0, void 0, function () {
        var identifier, email, name, msg, selection;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              identifier = item.value;
              email = item.description;
              name = item.label;
              msg = 'Send invitation to ' + email + '?';
              return [
                4 /*yield*/,
                vscode_1.window.showInformationMessage.apply(
                  vscode_1.window,
                  __spreadArrays([msg, {modal: true}], ['YES']),
                ),
              ];
            case 1:
              selection = _a.sent();
              if (selection && selection === 'YES') {
                DataController_1.sendTeamInvite(identifier, [email]);
              }
              return [2 /*return*/];
          }
        });
      });
    }),
  );
  // SEND OFFLINE DATA
  cmds.push(
    vscode_1.commands.registerCommand('codetime.sendOfflineData', function () {
      FileManager_1.sendOfflineData();
    }),
  );
  // SHOW ASCII DASHBOARD
  cmds.push(
    vscode_1.commands.registerCommand(
      'codetime.softwareKpmDashboard',
      function () {
        DataController_1.handleKpmClickedEvent();
      },
    ),
  );
  // OPEN SPECIFIED FILE IN EDITOR
  cmds.push(
    vscode_1.commands.registerCommand('codetime.openFileInEditor', function (
      file,
    ) {
      Util_1.openFileInEditor(file);
    }),
  );
  // REFRESH MENU
  cmds.push(
    vscode_1.commands.registerCommand('codetime.toggleStatusBar', function () {
      Util_1.toggleStatusBar();
      setTimeout(function () {
        vscode_1.commands.executeCommand('codetime.refreshCodetimeMenuTree');
      }, 500);
    }),
  );
  // LAUNCH EMAIL LOGIN
  cmds.push(
    vscode_1.commands.registerCommand('codetime.codeTimeLogin', function () {
      Util_1.launchLogin('software');
    }),
  );
  // LAUNCH GOOGLE LOGIN
  cmds.push(
    vscode_1.commands.registerCommand('codetime.googleLogin', function () {
      Util_1.launchLogin('google');
    }),
  );
  // LAUNCH GITHUB LOGIN
  cmds.push(
    vscode_1.commands.registerCommand('codetime.githubLogin', function () {
      Util_1.launchLogin('github');
    }),
  );
  // REFRESH DAILY METRICS
  cmds.push(
    vscode_1.commands.registerCommand('codetime.refreshKpmTree', function (
      keystrokeStats,
    ) {
      if (keystrokeStats) {
        KpmProviderManager_1.KpmProviderManager.getInstance().setCurrentKeystrokeStats(
          keystrokeStats,
        );
      }
      kpmTreeProvider.refresh();
    }),
  );
  // DISPLAY README MD
  cmds.push(
    vscode_1.commands.registerCommand('codetime.displayReadme', function () {
      Util_1.displayReadmeIfNotExists(true /*override*/);
    }),
  );
  // DISPLAY CODE TIME METRICS REPORT
  cmds.push(
    vscode_1.commands.registerCommand('codetime.codeTimeMetrics', function () {
      MenuManager_1.displayCodeTimeMetricsDashboard();
    }),
  );
  /*
   * CLOUD 9 LEADERBOARD COMMAND
   */
  cmds.push(
    vscode_1.commands.registerCommand('cloud9.leaderboard', function () {
      Leaderboard_1.displayLeaderboard();
    }),
  );
  // Cloud9: command used to create a new team
  cmds.push(
    vscode_1.commands.registerCommand('cloud9.createTeam', function () {
      console.log('Cloud9: CREATE A NEW TEAM');
    }),
  );
  // Cloud9: command used to join a new team
  cmds.push(
    vscode_1.commands.registerCommand('cloud9.joinTeam', function () {
      console.log('Cloud9: JOIN A TEAM');
    }),
  );
  // Cloud9: command used to clear the cached id (for debugging and testing only)
  cmds.push(
    vscode_1.commands.registerCommand('cloud9.debugClearUserId', function () {
      console.log('Cloud9: CLEAR CACHED ID');
      Authentication_1.clearCachedUserId();
    }),
  );
  // DISPLAY PROJECT METRICS REPORT
  cmds.push(
    vscode_1.commands.registerCommand(
      'codetime.generateProjectSummary',
      function () {
        ProjectCommitManager_1.ProjectCommitManager.getInstance().launchProjectCommitMenuFlow();
      },
    ),
  );
  // DISPLAY REPO COMMIT CONTRIBUTOR REPORT
  cmds.push(
    vscode_1.commands.registerCommand(
      'codetime.generateContributorSummary',
      function (identifier) {
        ReportManager_1.displayProjectContributorCommitsDashboard(identifier);
      },
    ),
  );
  // LAUNCH COMMIT URL
  cmds.push(
    vscode_1.commands.registerCommand('codetime.launchCommitUrl', function (
      commitLink,
    ) {
      Util_1.launchWebUrl(commitLink);
    }),
  );
  // DISPLAY PALETTE MENU
  cmds.push(
    vscode_1.commands.registerCommand(
      'codetime.softwarePaletteMenu',
      function () {
        MenuManager_1.showMenuOptions();
      },
    ),
  );
  cmds.push(
    vscode_1.commands.registerCommand(
      'codetime.viewSoftwareTop40',
      function () {
        Util_1.launchWebUrl('https://api.software.com/music/top40');
      },
    ),
  );
  cmds.push(
    vscode_1.commands.registerCommand(
      'codetime.codeTimeStatusToggle',
      function () {
        Util_1.handleCodeTimeStatusToggle();
      },
    ),
  );
  cmds.push(
    vscode_1.commands.registerCommand('codetime.sendFeedback', function () {
      Util_1.launchWebUrl('mailto:cody@software.com');
    }),
  );
  cmds.push(
    vscode_1.workspace.onDidChangeConfiguration(function (e) {
      return DataController_1.updatePreferences();
    }),
  );
  return vscode_1.Disposable.from.apply(vscode_1.Disposable, cmds);
}
exports.createCommands = createCommands;
