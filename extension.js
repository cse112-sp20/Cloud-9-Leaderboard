'use strict';
// Copyright (c) 2018 Software. All Rights Reserved.
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
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
exports.intializePlugin = exports.activate = exports.deactivate = exports.getStatusBarItem = exports.isTelemetryOn = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
var vscode_1 = require('vscode');
var DataController_1 = require('./lib/DataController');
var OnboardManager_1 = require('./lib/user/OnboardManager');
var Util_1 = require('./lib/Util');
var HttpClient_1 = require('./lib/http/HttpClient');
var KpmRepoManager_1 = require('./lib/repo/KpmRepoManager');
var LiveshareManager_1 = require('./lib/LiveshareManager');
var vsls = require('vsls/vscode');
var command_helper_1 = require('./lib/command-helper');
var KpmManager_1 = require('./lib/managers/KpmManager');
var SummaryManager_1 = require('./lib/managers/SummaryManager');
var SessionSummaryData_1 = require('./lib/storage/SessionSummaryData');
var WallClockManager_1 = require('./lib/managers/WallClockManager');
var EventManager_1 = require('./lib/managers/EventManager');
var FileManager_1 = require('./lib/managers/FileManager');
var Authentication_1 = require('./src/util/Authentication');
var TELEMETRY_ON = true;
var statusBarItem = null;
var _ls = null;
var fifteen_minute_interval = null;
var twenty_minute_interval = null;
var thirty_minute_interval = null;
var hourly_interval = null;
var liveshare_update_interval = null;
var one_min_millis = 1000 * 60;
var thirty_min_millis = one_min_millis * 30;
var one_hour_millis = one_min_millis * 60;
//
// Add the keystroke controller to the ext ctx, which
// will then listen for text document changes.
//
var kpmController = KpmManager_1.KpmManager.getInstance();
function isTelemetryOn() {
  return TELEMETRY_ON;
}
exports.isTelemetryOn = isTelemetryOn;
function getStatusBarItem() {
  return statusBarItem;
}
exports.getStatusBarItem = getStatusBarItem;
function deactivate(ctx) {
  // store the deactivate event
  EventManager_1.EventManager.getInstance().createCodeTimeEvent(
    'resource',
    'unload',
    'EditorDeactivate',
  );
  if (_ls && _ls.id) {
    // the IDE is closing, send this off
    var nowSec = Util_1.nowInSecs();
    var offsetSec = Util_1.getOffsetSeconds();
    var localNow = nowSec - offsetSec;
    // close the session on our end
    _ls['end'] = nowSec;
    _ls['local_end'] = localNow;
    LiveshareManager_1.manageLiveshareSession(_ls);
    _ls = null;
  }
  // dispose the new day timer
  SummaryManager_1.SummaryManager.getInstance().dispose();
  clearInterval(fifteen_minute_interval);
  clearInterval(twenty_minute_interval);
  clearInterval(thirty_minute_interval);
  clearInterval(hourly_interval);
  clearInterval(liveshare_update_interval);
  // softwareDelete(`/integrations/${PLUGIN_ID}`, getItem("jwt")).then(resp => {
  //     if (isResponseOk(resp)) {
  //         if (resp.data) {
  //             console.log(`Uninstalled plugin`);
  //         } else {
  //             console.log(
  //                 "Failed to update Code Time about the uninstall event"
  //             );
  //         }
  //     }
  // });
}
exports.deactivate = deactivate;
//export var extensionContext;
function activate(ctx) {
  return __awaiter(this, void 0, void 0, function () {
    var workspace_name, eventName, secondDelay, nonFocusedEventType_1;
    return __generator(this, function (_a) {
      //console.log("CLOUD9 ACTIVATED");
      vscode_1.window.showInformationMessage('Cloud9 Activated!');
      // add the code time commands
      ctx.subscriptions.push(command_helper_1.createCommands(kpmController));
      workspace_name = Util_1.getWorkspaceName();
      eventName = 'onboard-' + workspace_name;
      // onboard the user as anonymous if it's being installed
      if (vscode_1.window.state.focused) {
        EventManager_1.EventManager.getInstance().createCodeTimeEvent(
          'focused_onboard',
          eventName,
          'onboarding',
        );
        OnboardManager_1.onboardInit(ctx, intializePlugin /*successFunction*/);
      } else {
        secondDelay = getRandomArbitrary(10, 15);
        nonFocusedEventType_1 = 'nonfocused_onboard-' + secondDelay;
        // initialize in 5 seconds if this is the secondary window
        setTimeout(function () {
          EventManager_1.EventManager.getInstance().createCodeTimeEvent(
            nonFocusedEventType_1,
            eventName,
            'onboarding',
          );
          OnboardManager_1.onboardInit(
            ctx,
            intializePlugin /*successFunction*/,
          );
        }, 1000 * secondDelay);
      }
      // sign the user in
      Authentication_1.authenticateUser(ctx);
      return [2 /*return*/];
    });
  });
}
exports.activate = activate;
function getRandomArbitrary(min, max) {
  max = max + 0.1;
  return parseInt(Math.random() * (max - min) + min, 10);
}
function intializePlugin(ctx, createdAnonUser) {
  return __awaiter(this, void 0, void 0, function () {
    var serverIsOnline, initializedVscodePlugin;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          Util_1.logIt(
            'Loaded ' + Util_1.getPluginName() + ' v' + Util_1.getVersion(),
          );
          // store the activate event
          EventManager_1.EventManager.getInstance().createCodeTimeEvent(
            'resource',
            'load',
            'EditorActivate',
          );
          // initialize the wall clock timer
          WallClockManager_1.WallClockManager.getInstance();
          // load the last payload into memory
          FileManager_1.getLastSavedKeystrokesStats();
          return [4 /*yield*/, HttpClient_1.serverIsAvailable()];
        case 1:
          serverIsOnline = _a.sent();
          // get the user preferences whether it's music time or code time
          // this will also fetch the user and update loggedInCacheState if it's found
          return [
            4 /*yield*/,
            DataController_1.initializePreferences(serverIsOnline),
          ];
        case 2:
          // get the user preferences whether it's music time or code time
          // this will also fetch the user and update loggedInCacheState if it's found
          _a.sent();
          // add the interval jobs
          initializeIntervalJobs();
          // in 30 seconds
          setTimeout(function () {
            vscode_1.commands.executeCommand('codetime.sendOfflineData');
          }, 1000 * 30);
          // in 2 minutes task
          setTimeout(function () {
            KpmRepoManager_1.getHistoricalCommits(serverIsOnline);
          }, one_min_millis * 2);
          // in 4 minutes task
          setTimeout(function () {
            FileManager_1.sendOfflineEvents();
          }, one_min_millis * 3);
          initializeLiveshare();
          // get the login status
          // {loggedIn: true|false}
          return [4 /*yield*/, DataController_1.isLoggedIn()];
        case 3:
          // get the login status
          // {loggedIn: true|false}
          _a.sent();
          initializedVscodePlugin = Util_1.getItem('vscode_CtInit');
          if (!initializedVscodePlugin) {
            Util_1.setItem('vscode_CtInit', true);
            // send a bootstrap kpm payload
            kpmController.buildBootstrapKpmPayload();
            // send a heartbeat that the plugin as been installed
            // (or the user has deleted the session.json and restarted the IDE)
            DataController_1.sendHeartbeat('INSTALLED', serverIsOnline);
            setTimeout(function () {
              vscode_1.commands.executeCommand('codetime.displayTree');
            }, 1200);
          }
          // initialize the day check timer
          SummaryManager_1.SummaryManager.getInstance().updateSessionSummaryFromServer();
          // show the readme if it doesn't exist
          Util_1.displayReadmeIfNotExists();
          // show the status bar text info
          setTimeout(function () {
            statusBarItem = vscode_1.window.createStatusBarItem(
              vscode_1.StatusBarAlignment.Right,
              10,
            );
            // add the name to the tooltip if we have it
            var name = Util_1.getItem('name');
            var tooltip = 'Click to see more from Code Time';
            if (name) {
              tooltip = tooltip + ' (' + name + ')';
            }
            statusBarItem.tooltip = tooltip;
            // statusBarItem.command = "codetime.softwarePaletteMenu";
            statusBarItem.command = 'codetime.displayTree';
            statusBarItem.show();
            // update the status bar
            SessionSummaryData_1.updateStatusBarWithSummaryData();
          }, 0);
          return [2 /*return*/];
      }
    });
  });
}
exports.intializePlugin = intializePlugin;
// add the interval jobs
function initializeIntervalJobs() {
  var _this = this;
  hourly_interval = setInterval(function () {
    return __awaiter(_this, void 0, void 0, function () {
      var isonline;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, HttpClient_1.serverIsAvailable()];
          case 1:
            isonline = _a.sent();
            DataController_1.sendHeartbeat('HOURLY', isonline);
            return [2 /*return*/];
        }
      });
    });
  }, one_hour_millis);
  thirty_minute_interval = setInterval(function () {
    return __awaiter(_this, void 0, void 0, function () {
      var isonline;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, HttpClient_1.serverIsAvailable()];
          case 1:
            isonline = _a.sent();
            return [
              4 /*yield*/,
              KpmRepoManager_1.getHistoricalCommits(isonline),
            ];
          case 2:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  }, thirty_min_millis);
  twenty_minute_interval = setInterval(function () {
    return __awaiter(_this, void 0, void 0, function () {
      var name_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, FileManager_1.sendOfflineEvents()];
          case 1:
            _a.sent();
            // this will get the login status if the window is focused
            // and they're currently not a logged in
            if (vscode_1.window.state.focused) {
              name_1 = Util_1.getItem('name');
              // but only if checkStatus is true
              if (!name_1) {
                DataController_1.isLoggedIn();
              }
            }
            return [2 /*return*/];
        }
      });
    });
  }, one_min_millis * 20);
  // every 15 minute tasks
  fifteen_minute_interval = setInterval(function () {
    return __awaiter(_this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        vscode_1.commands.executeCommand('codetime.sendOfflineData');
        return [2 /*return*/];
      });
    });
  }, one_min_millis * 15);
  // update liveshare in the offline kpm data if it has been initiated
  liveshare_update_interval = setInterval(function () {
    return __awaiter(_this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        if (vscode_1.window.state.focused) {
          updateLiveshareTime();
        }
        return [2 /*return*/];
      });
    });
  }, one_min_millis);
}
function handlePauseMetricsEvent() {
  TELEMETRY_ON = false;
  Util_1.showStatus('Code Time Paused', 'Enable metrics to resume');
}
function handleEnableMetricsEvent() {
  TELEMETRY_ON = true;
  Util_1.showStatus('Code Time', null);
}
function updateLiveshareTime() {
  if (_ls) {
    var nowSec = Util_1.nowInSecs();
    var diffSeconds = nowSec - parseInt(_ls['start'], 10);
    SessionSummaryData_1.setSessionSummaryLiveshareMinutes(diffSeconds * 60);
  }
}
function initializeLiveshare() {
  return __awaiter(this, void 0, void 0, function () {
    var liveshare;
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, vsls.getApi()];
        case 1:
          liveshare = _a.sent();
          if (liveshare) {
            // {access: number, id: string, peerNumber: number, role: number, user: json}
            Util_1.logIt('liveshare version - ' + liveshare['apiVersion']);
            liveshare.onDidChangeSession(function (event) {
              return __awaiter(_this, void 0, void 0, function () {
                var nowSec, offsetSec, localNow;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      nowSec = Util_1.nowInSecs();
                      offsetSec = Util_1.getOffsetSeconds();
                      localNow = nowSec - offsetSec;
                      if (!!_ls) return [3 /*break*/, 2];
                      _ls = __assign({}, event.session);
                      _ls['apiVesion'] = liveshare['apiVersion'];
                      _ls['start'] = nowSec;
                      _ls['local_start'] = localNow;
                      _ls['end'] = 0;
                      return [
                        4 /*yield*/,
                        LiveshareManager_1.manageLiveshareSession(_ls),
                      ];
                    case 1:
                      _a.sent();
                      return [3 /*break*/, 4];
                    case 2:
                      if (!(_ls && (!event || !event['id'])))
                        return [3 /*break*/, 4];
                      updateLiveshareTime();
                      // close the session on our end
                      _ls['end'] = nowSec;
                      _ls['local_end'] = localNow;
                      return [
                        4 /*yield*/,
                        LiveshareManager_1.manageLiveshareSession(_ls),
                      ];
                    case 3:
                      _a.sent();
                      _ls = null;
                      _a.label = 4;
                    case 4:
                      return [2 /*return*/];
                  }
                });
              });
            });
          }
          return [2 /*return*/];
      }
    });
  });
}
