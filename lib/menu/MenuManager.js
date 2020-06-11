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
exports.__esModule = true;
exports.displayWeeklyCommitSummary = exports.displayCodeTimeMetricsDashboard = exports.launchWebDashboardView = exports.showMenuOptions = exports.buildWebDashboardUrl = exports.showQuickPick = void 0;
var vscode_1 = require('vscode');
var Util_1 = require('../Util');
var DataController_1 = require('../DataController');
var HttpClient_1 = require('../http/HttpClient');
var Constants_1 = require('../Constants');
var EventManager_1 = require('../managers/EventManager');
/**
 * Pass in the following array of objects
 * options: {placeholder, items: [{label, description, url, detail, tooltip},...]}
 */
function showQuickPick(pickOptions) {
  var _this = this;
  if (!pickOptions || !pickOptions['items']) {
    return;
  }
  var options = {
    matchOnDescription: false,
    matchOnDetail: false,
    placeHolder: pickOptions.placeholder || '',
  };
  return vscode_1.window
    .showQuickPick(pickOptions.items, options)
    .then(function (item) {
      return __awaiter(_this, void 0, void 0, function () {
        var url, cb, command;
        return __generator(this, function (_a) {
          if (item) {
            url = item['url'];
            cb = item['cb'];
            command = item['command'];
            if (url) {
              Util_1.launchWebUrl(url);
            } else if (cb) {
              cb();
            } else if (command) {
              vscode_1.commands.executeCommand(command);
            }
            if (item['eventDescription']) {
              EventManager_1.EventManager.getInstance().createCodeTimeEvent(
                'mouse',
                'click',
                item['eventDescription'],
              );
            }
          }
          return [2 /*return*/, item];
        });
      });
    });
}
exports.showQuickPick = showQuickPick;
function buildWebDashboardUrl() {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      return [2 /*return*/, Constants_1.launch_url];
    });
  });
}
exports.buildWebDashboardUrl = buildWebDashboardUrl;
function showMenuOptions() {
  return __awaiter(this, void 0, void 0, function () {
    var serverIsOnline,
      loggedIn,
      kpmMenuOptions,
      loginMsgDetail,
      toggleStatusBarTextLabel;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, HttpClient_1.serverIsAvailable()];
        case 1:
          serverIsOnline = _a.sent();
          EventManager_1.EventManager.getInstance().createCodeTimeEvent(
            'mouse',
            'click',
            'ShowPaletteMenu',
          );
          return [4 /*yield*/, DataController_1.isLoggedIn()];
        case 2:
          loggedIn = _a.sent();
          kpmMenuOptions = {
            items: [],
          };
          kpmMenuOptions.items.push({
            label: 'Generate dashboard',
            detail: 'View your latest coding metrics right here in your editor',
            url: null,
            cb: displayCodeTimeMetricsDashboard,
            eventDescription: 'PaletteMenuLaunchDashboard',
          });
          loginMsgDetail =
            'Finish creating your account and see rich data visualizations.';
          if (!serverIsOnline) {
            loginMsgDetail =
              'Our service is temporarily unavailable. Please try again later.';
          }
          if (!loggedIn) {
            kpmMenuOptions.items.push({
              label: Constants_1.LOGIN_LABEL,
              detail: loginMsgDetail,
              url: null,
              cb: Util_1.launchLogin,
              eventDescription: 'PaletteMenuLogin',
            });
          }
          toggleStatusBarTextLabel = 'Hide status bar metrics';
          if (!Util_1.isStatusBarTextVisible()) {
            toggleStatusBarTextLabel = 'Show status bar metrics';
          }
          kpmMenuOptions.items.push({
            label: toggleStatusBarTextLabel,
            detail: 'Toggle the Code Time status bar metrics text',
            url: null,
            cb: null,
            command: 'codetime.toggleStatusBar',
          });
          kpmMenuOptions.items.push({
            label: 'Submit an issue on GitHub',
            detail: 'Encounter a bug? Submit an issue on our GitHub page',
            url: 'https://github.com/swdotcom/swdc-vscode/issues',
            cb: null,
          });
          kpmMenuOptions.items.push({
            label: 'Submit feedback',
            detail: 'Send us an email at cody@software.com',
            cb: null,
            command: 'codetime.sendFeedback',
          });
          if (loggedIn) {
            kpmMenuOptions.items.push({
              label: 'Web dashboard',
              detail: 'See rich data visualizations in the web app',
              url: null,
              cb: launchWebDashboardView,
              eventDescription: 'PaletteMenuLaunchWebDashboard',
            });
          }
          // kpmMenuOptions.items.push({
          //     label:
          //         "___________________________________________________________________",
          //     cb: null,
          //     url: null,
          //     command: null
          // });
          // const atlassianAccessToken = getItem("atlassian_access_token");
          // if (!atlassianAccessToken) {
          //     kpmMenuOptions.items.push({
          //         label: "Connect Atlassian",
          //         detail: "To integrate with your Jira projects",
          //         cb: null,
          //         command: "codetime.connectAtlassian"
          //     });
          // }
          showQuickPick(kpmMenuOptions);
          return [2 /*return*/];
      }
    });
  });
}
exports.showMenuOptions = showMenuOptions;
function launchWebDashboardView() {
  return __awaiter(this, void 0, void 0, function () {
    var webUrl;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, buildWebDashboardUrl()];
        case 1:
          webUrl = _a.sent();
          Util_1.launchWebUrl(webUrl + '/login');
          return [2 /*return*/];
      }
    });
  });
}
exports.launchWebDashboardView = launchWebDashboardView;
function displayCodeTimeMetricsDashboard() {
  return __awaiter(this, void 0, void 0, function () {
    var filePath;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          // 1st write the code time metrics dashboard file
          return [
            4 /*yield*/,
            DataController_1.writeCodeTimeMetricsDashboard(),
          ];
        case 1:
          // 1st write the code time metrics dashboard file
          _a.sent();
          filePath = Util_1.getDashboardFile();
          vscode_1.workspace.openTextDocument(filePath).then(function (doc) {
            // only focus if it's not already open
            vscode_1.window
              .showTextDocument(doc, vscode_1.ViewColumn.One, false)
              .then(function (e) {
                // done
              });
          });
          return [2 /*return*/];
      }
    });
  });
}
exports.displayCodeTimeMetricsDashboard = displayCodeTimeMetricsDashboard;
function displayWeeklyCommitSummary() {
  return __awaiter(this, void 0, void 0, function () {
    var filePath;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          // 1st write the commit summary data, then show it
          return [4 /*yield*/, DataController_1.writeCommitSummaryData()];
        case 1:
          // 1st write the commit summary data, then show it
          _a.sent();
          filePath = Util_1.getCommitSummaryFile();
          vscode_1.workspace.openTextDocument(filePath).then(function (doc) {
            // only focus if it's not already open
            vscode_1.window
              .showTextDocument(doc, vscode_1.ViewColumn.One, false)
              .then(function (e) {
                // done
              });
          });
          return [2 /*return*/];
      }
    });
  });
}
exports.displayWeeklyCommitSummary = displayWeeklyCommitSummary;
