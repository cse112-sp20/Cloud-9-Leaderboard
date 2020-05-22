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
exports.showSlackChannelMenu = exports.sendSlackMessage = exports.slackContributor = exports.disconnectSlack = exports.connectSlack = exports.sendGeneratedReportReport = exports.generateSlackReport = void 0;
var Constants_1 = require('../Constants');
var Util_1 = require('../Util');
var DataController_1 = require('../DataController');
var WebClient = require('@slack/web-api').WebClient;
var MenuManager_1 = require('./MenuManager');
var HttpClient_1 = require('../http/HttpClient');
var vscode_1 = require('vscode');
var GitUtil_1 = require('../repo/GitUtil');
var fs = require('fs');
//// NEW LOGIC /////
function generateSlackReport() {
  return __awaiter(this, void 0, void 0, function () {
    var slackAccessToken, connectConfirm, projectDir, slackReportCommits;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          slackAccessToken = Util_1.getItem('slack_access_token');
          if (!!slackAccessToken) return [3 /*break*/, 2];
          return [
            4 /*yield*/,
            vscode_1.window.showInformationMessage.apply(
              vscode_1.window,
              __spreadArrays(['Connect Slack to continue'], ['Yes']),
            ),
          ];
        case 1:
          connectConfirm = _a.sent();
          if (connectConfirm && connectConfirm === 'Yes') {
            connectSlack(sendGeneratedReportReport);
          }
          return [3 /*break*/, 4];
        case 2:
          projectDir = Util_1.findFirstActiveDirectoryOrWorkspaceDirectory();
          return [4 /*yield*/, GitUtil_1.getSlackReportCommits(projectDir)];
        case 3:
          slackReportCommits = _a.sent();
          _a.label = 4;
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
exports.generateSlackReport = generateSlackReport;
//// OLD LOGIC /////
function sendGeneratedReportReport() {
  return __awaiter(this, void 0, void 0, function () {
    var slackAccessToken, connectConfirm, filePath, content, selectedChannel;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          slackAccessToken = Util_1.getItem('slack_access_token');
          if (!!slackAccessToken) return [3 /*break*/, 2];
          return [
            4 /*yield*/,
            vscode_1.window.showInformationMessage.apply(
              vscode_1.window,
              __spreadArrays(['Connect Slack to continue'], ['Yes']),
            ),
          ];
        case 1:
          connectConfirm = _a.sent();
          if (connectConfirm && connectConfirm === 'Yes') {
            connectSlack(sendGeneratedReportReport);
          }
          return [3 /*break*/, 4];
        case 2:
          filePath = Util_1.getDailyReportSummaryFile();
          content = fs.readFileSync(filePath).toString();
          return [4 /*yield*/, showSlackChannelMenu()];
        case 3:
          selectedChannel = _a.sent();
          if (!selectedChannel) {
            return [2 /*return*/];
          }
          sendSlackMessage(content, selectedChannel);
          _a.label = 4;
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
exports.sendGeneratedReportReport = sendGeneratedReportReport;
/**
 * This won't be available until they've connected to spotify
 */
function connectSlack(callback) {
  if (callback === void 0) {
    callback = null;
  }
  return __awaiter(this, void 0, void 0, function () {
    var slackAccessToken, jwt, encodedJwt, qryStr, endpoint;
    return __generator(this, function (_a) {
      slackAccessToken = Util_1.getItem('slack_access_token');
      if (slackAccessToken) {
        vscode_1.window.showInformationMessage('Slack is already connected');
        return [2 /*return*/];
      }
      jwt = Util_1.getItem('jwt');
      encodedJwt = encodeURIComponent(jwt);
      qryStr = 'integrate=slack&plugin=musictime&token=' + encodedJwt;
      endpoint = Constants_1.api_endpoint + '/auth/slack?' + qryStr;
      Util_1.launchWebUrl(endpoint);
      DataController_1.refetchSlackConnectStatusLazily(callback);
      return [2 /*return*/];
    });
  });
}
exports.connectSlack = connectSlack;
function disconnectSlack() {
  return __awaiter(this, void 0, void 0, function () {
    var selection, result;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            vscode_1.window.showInformationMessage.apply(
              vscode_1.window,
              __spreadArrays(
                ['Are you sure you would like to disconnect Slack?'],
                ['Yes'],
              ),
            ),
          ];
        case 1:
          selection = _a.sent();
          if (!(selection === 'Yes')) return [3 /*break*/, 3];
          return [
            4 /*yield*/,
            HttpClient_1.softwarePut(
              '/auth/slack/disconnect',
              {},
              Util_1.getItem('jwt'),
            ),
          ];
        case 2:
          result = _a.sent();
          // oauth is not null, initialize spotify
          Util_1.setItem('slack_access_token', null);
          vscode_1.window.showInformationMessage(
            'Successfully disconnected your Slack connection.',
          );
          _a.label = 3;
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
exports.disconnectSlack = disconnectSlack;
function showSlackMessageInputPrompt() {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            vscode_1.window.showInputBox({
              value: '',
              placeHolder: 'Enter a message to appear in the selected channel',
              validateInput: function (text) {
                return !text
                  ? 'Please enter a valid message to continue.'
                  : null;
              },
            }),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function slackContributor() {
  return __awaiter(this, void 0, void 0, function () {
    var selectedChannel, message;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, showSlackChannelMenu()];
        case 1:
          selectedChannel = _a.sent();
          if (!selectedChannel) {
            return [2 /*return*/];
          }
          return [4 /*yield*/, showSlackMessageInputPrompt()];
        case 2:
          message = _a.sent();
          if (!message) {
            return [2 /*return*/];
          }
          sendSlackMessage(message, selectedChannel);
          return [2 /*return*/];
      }
    });
  });
}
exports.slackContributor = slackContributor;
function sendSlackMessage(message, selectedChannel) {
  return __awaiter(this, void 0, void 0, function () {
    var slackAccessToken, msg, web;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          slackAccessToken = Util_1.getItem('slack_access_token');
          msg = '' + message;
          web = new WebClient(slackAccessToken);
          return [
            4 /*yield*/,
            web.chat
              .postMessage({
                text: msg,
                channel: selectedChannel,
                as_user: true,
              })
              ['catch'](function (err) {
                // try without sending "as_user"
                web.chat
                  .postMessage({
                    text: msg,
                    channel: selectedChannel,
                  })
                  ['catch'](function (err) {
                    if (err.message) {
                      console.log('error posting slack message: ', err.message);
                    }
                  });
              }),
          ];
        case 1:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
exports.sendSlackMessage = sendSlackMessage;
function showSlackChannelMenu() {
  return __awaiter(this, void 0, void 0, function () {
    var menuOptions, channelNames, pick;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          menuOptions = {
            items: [],
            placeholder: 'Select a channel',
          };
          return [4 /*yield*/, getChannelNames()];
        case 1:
          channelNames = _a.sent();
          channelNames.sort();
          channelNames.forEach(function (channelName) {
            menuOptions.items.push({
              label: channelName,
            });
          });
          return [4 /*yield*/, MenuManager_1.showQuickPick(menuOptions)];
        case 2:
          pick = _a.sent();
          if (pick && pick.label) {
            return [2 /*return*/, pick.label];
          }
          return [2 /*return*/, null];
      }
    });
  });
}
exports.showSlackChannelMenu = showSlackChannelMenu;
function getChannels() {
  return __awaiter(this, void 0, void 0, function () {
    var slackAccessToken, web, result;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          slackAccessToken = Util_1.getItem('slack_access_token');
          web = new WebClient(slackAccessToken);
          return [
            4 /*yield*/,
            web.channels
              .list({exclude_archived: true, exclude_members: false})
              ['catch'](function (err) {
                console.log('Unable to retrieve slack channels: ', err.message);
                return [];
              }),
          ];
        case 1:
          result = _a.sent();
          if (result && result.ok) {
            return [2 /*return*/, result.channels];
          }
          return [2 /*return*/, []];
      }
    });
  });
}
function getChannelNames() {
  return __awaiter(this, void 0, void 0, function () {
    var channels;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, getChannels()];
        case 1:
          channels = _a.sent();
          if (channels && channels.length > 0) {
            return [
              2 /*return*/,
              channels.map(function (channel) {
                return channel.name;
              }),
            ];
          }
          return [2 /*return*/, []];
      }
    });
  });
}
