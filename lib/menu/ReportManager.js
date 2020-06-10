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
exports.generateDailyReport = exports.displayProjectContributorCommitsDashboard = exports.displayProjectCommitsDashboardByRangeType = exports.displayProjectCommitsDashboardByStartEnd = void 0;
var DataController_1 = require('../DataController');
var Util_1 = require('../Util');
var vscode_1 = require('vscode');
var SlackManager_1 = require('./SlackManager');
function displayProjectCommitsDashboardByStartEnd(start, end, projectIds) {
  if (projectIds === void 0) {
    projectIds = [];
  }
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          // 1st write the code time metrics dashboard file
          return [
            4 /*yield*/,
            DataController_1.writeProjectCommitDashboardByStartEnd(
              start,
              end,
              projectIds,
            ),
          ];
        case 1:
          // 1st write the code time metrics dashboard file
          _a.sent();
          openProjectCommitDocument();
          return [2 /*return*/];
      }
    });
  });
}
exports.displayProjectCommitsDashboardByStartEnd = displayProjectCommitsDashboardByStartEnd;
function displayProjectCommitsDashboardByRangeType(type, projectIds) {
  if (type === void 0) {
    type = 'lastWeek';
  }
  if (projectIds === void 0) {
    projectIds = [];
  }
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          // 1st write the code time metrics dashboard file
          return [
            4 /*yield*/,
            DataController_1.writeProjectCommitDashboardByRangeType(
              type,
              projectIds,
            ),
          ];
        case 1:
          // 1st write the code time metrics dashboard file
          _a.sent();
          openProjectCommitDocument();
          return [2 /*return*/];
      }
    });
  });
}
exports.displayProjectCommitsDashboardByRangeType = displayProjectCommitsDashboardByRangeType;
function openProjectCommitDocument() {
  var filePath = Util_1.getProjectCodeSummaryFile();
  vscode_1.workspace.openTextDocument(filePath).then(function (doc) {
    // only focus if it's not already open
    vscode_1.window
      .showTextDocument(doc, vscode_1.ViewColumn.One, false)
      .then(function (e) {
        // done
      });
  });
}
function displayProjectContributorCommitsDashboard(identifier) {
  return __awaiter(this, void 0, void 0, function () {
    var filePath;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          // 1st write the code time metrics dashboard file
          return [
            4 /*yield*/,
            DataController_1.writeProjectContributorCommitDashboardFromGitLogs(
              identifier,
            ),
          ];
        case 1:
          // 1st write the code time metrics dashboard file
          _a.sent();
          filePath = Util_1.getProjectContributorCodeSummaryFile();
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
exports.displayProjectContributorCommitsDashboard = displayProjectContributorCommitsDashboard;
function generateDailyReport(type, projectIds) {
  if (type === void 0) {
    type = 'yesterday';
  }
  if (projectIds === void 0) {
    projectIds = [];
  }
  return __awaiter(this, void 0, void 0, function () {
    var filePath;
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            DataController_1.writeDailyReportDashboard(type, projectIds),
          ];
        case 1:
          _a.sent();
          filePath = Util_1.getDailyReportSummaryFile();
          vscode_1.workspace.openTextDocument(filePath).then(function (doc) {
            // only focus if it's not already open
            vscode_1.window
              .showTextDocument(doc, vscode_1.ViewColumn.One, false)
              .then(function (e) {
                return __awaiter(_this, void 0, void 0, function () {
                  var submitToSlack;
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [
                          4 /*yield*/,
                          vscode_1.window.showInformationMessage.apply(
                            vscode_1.window,
                            __spreadArrays(
                              ['Submit report to slack?'],
                              ['Yes'],
                            ),
                          ),
                        ];
                      case 1:
                        submitToSlack = _a.sent();
                        if (submitToSlack && submitToSlack === 'Yes') {
                          // take the content and send it to a selected channel
                          SlackManager_1.sendGeneratedReportReport();
                        }
                        return [2 /*return*/];
                    }
                  });
                });
              });
          });
          return [2 /*return*/];
      }
    });
  });
}
exports.generateDailyReport = generateDailyReport;
