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
exports.updateAggregateInfo = exports.storePayload = exports.processPayload = void 0;
var Util_1 = require('../Util');
var TimeSummaryData_1 = require('../storage/TimeSummaryData');
var FileChangeInfoSummaryData_1 = require('../storage/FileChangeInfoSummaryData');
var models_1 = require('../model/models');
var Constants_1 = require('../Constants');
var SessionSummaryData_1 = require('../storage/SessionSummaryData');
var KpmRepoManager_1 = require('../repo/KpmRepoManager');
var SummaryManager_1 = require('./SummaryManager');
var FileManager_1 = require('./FileManager');
var WallClockManager_1 = require('./WallClockManager');
var Project_1 = require('../model/Project');
var FireStore_1 = require('../../src/util/FireStore');
var os = require('os');
var fs = require('fs');
var path = require('path');
/**
 * This will update the cumulative editor and session seconds.
 * It will also provide any error details if any are encountered.
 * @param payload
 * @param sessionMinutes
 */
function validateAndUpdateCumulativeData(payload, sessionMinutes) {
  return __awaiter(this, void 0, void 0, function () {
    var td,
      lastPayload,
      _a,
      cumulative_editor_seconds,
      cumulative_session_seconds;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [
            4 /*yield*/,
            TimeSummaryData_1.incrementSessionAndFileSecondsAndFetch(
              payload.project,
              sessionMinutes,
            ),
          ];
        case 1:
          td = _b.sent();
          // default error to empty
          payload.project_null_error = '';
          return [4 /*yield*/, FileManager_1.getLastSavedKeystrokesStats()];
        case 2:
          lastPayload = _b.sent();
          if (!Util_1.isNewDay()) return [3 /*break*/, 4];
          lastPayload = null;
          if (td) {
            // don't rely on the previous TimeData
            td = null;
            payload.project_null_error =
              'TimeData should be null as its a new day';
          }
          return [
            4 /*yield*/,
            SummaryManager_1.SummaryManager.getInstance().newDayChecker(),
          ];
        case 3:
          _b.sent();
          _b.label = 4;
        case 4:
          // set the workspace name
          payload.workspace_name = Util_1.getWorkspaceName();
          _a = payload;
          return [4 /*yield*/, Util_1.getHostname()];
        case 5:
          _a.hostname = _b.sent();
          // set the project null error if we're unable to find the time project metrics for this payload
          if (!td) {
            // We don't have a TimeData value, use the last recorded kpm data
            payload.project_null_error =
              'No TimeData for: ' + payload.project.directory;
          }
          cumulative_editor_seconds = 60;
          cumulative_session_seconds = 60;
          if (td) {
            // We found a TimeData object, use that info
            cumulative_editor_seconds = td.editor_seconds;
            cumulative_session_seconds = td.session_seconds;
          } else if (lastPayload) {
            // use the last saved keystrokestats
            if (lastPayload.cumulative_editor_seconds) {
              cumulative_editor_seconds =
                lastPayload.cumulative_editor_seconds + 60;
            }
            if (lastPayload.cumulative_session_seconds) {
              cumulative_session_seconds =
                lastPayload.cumulative_session_seconds + 60;
            }
          }
          // Check if the final cumulative editor seconds is less than the cumulative session seconds
          if (cumulative_editor_seconds < cumulative_session_seconds) {
            // make sure to set it to at least the session seconds
            cumulative_editor_seconds = cumulative_session_seconds;
          }
          // update the cumulative editor seconds
          payload.cumulative_editor_seconds = cumulative_editor_seconds;
          payload.cumulative_session_seconds = cumulative_session_seconds;
          return [2 /*return*/];
      }
    });
  });
}
function processPayload(payload, sendNow) {
  if (sendNow === void 0) {
    sendNow = false;
  }
  return __awaiter(this, void 0, void 0, function () {
    var nowTimes,
      _a,
      sessionMinutes,
      elapsedSeconds,
      keys,
      directory,
      projName,
      resourceInfo,
      i,
      fileName,
      workspaceFolder,
      p,
      repoContributorInfo,
      repoFileCount,
      i,
      key,
      fileInfo,
      repoFileContributorCount;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          nowTimes = Util_1.getNowTimes();
          (_a = SessionSummaryData_1.getTimeBetweenLastPayload()),
            (sessionMinutes = _a.sessionMinutes),
            (elapsedSeconds = _a.elapsedSeconds);
          keys = Object.keys(payload.source);
          directory = Constants_1.UNTITLED;
          projName = Constants_1.NO_PROJ_NAME;
          resourceInfo = null;
          i = 0;
          _b.label = 1;
        case 1:
          if (!(i < keys.length)) return [3 /*break*/, 4];
          fileName = keys[i];
          workspaceFolder = Util_1.getProjectFolder(fileName);
          if (!workspaceFolder) return [3 /*break*/, 3];
          directory = workspaceFolder.uri.fsPath;
          projName = workspaceFolder.name;
          return [4 /*yield*/, KpmRepoManager_1.getResourceInfo(directory)];
        case 2:
          // since we have this, look for the repo identifier
          resourceInfo = _b.sent();
          return [3 /*break*/, 4];
        case 3:
          i++;
          return [3 /*break*/, 1];
        case 4:
          p = new Project_1['default']();
          p.directory = directory;
          p.name = projName;
          p.resource = resourceInfo;
          p.identifier =
            resourceInfo && resourceInfo.identifier
              ? resourceInfo.identifier
              : '';
          payload.project = p;
          // validate the cumulative data
          return [
            4 /*yield*/,
            validateAndUpdateCumulativeData(payload, sessionMinutes),
          ];
        case 5:
          // validate the cumulative data
          _b.sent();
          payload.end = nowTimes.now_in_sec;
          payload.local_end = nowTimes.local_now_in_sec;
          if (!p.identifier) return [3 /*break*/, 8];
          return [
            4 /*yield*/,
            KpmRepoManager_1.getRepoContributorInfo(directory, true),
          ];
        case 6:
          repoContributorInfo = _b.sent();
          payload.repoContributorCount = repoContributorInfo
            ? repoContributorInfo.count || 0
            : 0;
          return [4 /*yield*/, KpmRepoManager_1.getRepoFileCount(directory)];
        case 7:
          repoFileCount = _b.sent();
          payload.repoFileCount = repoFileCount || 0;
          return [3 /*break*/, 9];
        case 8:
          payload.repoContributorCount = 0;
          payload.repoFileCount = 0;
          _b.label = 9;
        case 9:
          // set the elapsed seconds (last end time to this end time)
          payload.elapsed_seconds = elapsedSeconds;
          if (!(keys && keys.length > 0)) return [3 /*break*/, 14];
          i = 0;
          _b.label = 10;
        case 10:
          if (!(i < keys.length)) return [3 /*break*/, 14];
          key = keys[i];
          fileInfo = payload.source[key];
          // ensure there is an end time
          if (!fileInfo.end) {
            fileInfo.end = nowTimes.now_in_sec;
            fileInfo.local_end = nowTimes.local_now_in_sec;
          }
          if (!p.identifier) return [3 /*break*/, 12];
          return [4 /*yield*/, KpmRepoManager_1.getFileContributorCount(key)];
        case 11:
          repoFileContributorCount = _b.sent();
          fileInfo.repoFileContributorCount = repoFileContributorCount || 0;
          _b.label = 12;
        case 12:
          payload.source[key] = fileInfo;
          _b.label = 13;
        case 13:
          i++;
          return [3 /*break*/, 10];
        case 14:
          // set the timezone
          payload.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          console.log('From PayloadManager.ts');
          FireStore_1.updateStats(payload);
          // async for either
          if (sendNow) {
            // send the payload now (only called when getting installed)
            FileManager_1.sendBatchPayload('/data/batch', [payload]);
            Util_1.logIt('sending kpm metrics');
          } else {
            // store to send the batch later
            storePayload(payload, sessionMinutes);
            Util_1.logIt('storing kpm metrics');
          }
          // Update the latestPayloadTimestampEndUtc. It's used to determine session time and elapsed_seconds
          Util_1.setItem('latestPayloadTimestampEndUtc', nowTimes.now_in_sec);
          return [2 /*return*/];
      }
    });
  });
}
exports.processPayload = processPayload;
/**
 * this should only be called if there's file data in the source
 * @param payload
 */
function storePayload(payload, sessionMinutes) {
  return __awaiter(this, void 0, void 0, function () {
    var fileChangeInfoMap;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          fileChangeInfoMap = FileChangeInfoSummaryData_1.getFileChangeSummaryAsJson();
          return [
            4 /*yield*/,
            updateAggregateInfo(fileChangeInfoMap, payload, sessionMinutes),
          ];
        case 1:
          _a.sent();
          // write the fileChangeInfoMap
          FileChangeInfoSummaryData_1.saveFileChangeInfoToDisk(
            fileChangeInfoMap,
          );
          // store the payload into the data.json file
          fs.appendFileSync(
            Util_1.getSoftwareDataStoreFile(),
            JSON.stringify(payload) + os.EOL,
            function (err) {
              if (err)
                Util_1.logIt(
                  'Error appending to the Software data store file: ' +
                    err.message,
                );
            },
          );
          // update the status and tree
          WallClockManager_1.WallClockManager.getInstance().dispatchStatusViewUpdate();
          return [2 /*return*/];
      }
    });
  });
}
exports.storePayload = storePayload;
function updateAggregateInfo(fileChangeInfoMap, payload, sessionMinutes) {
  return __awaiter(this, void 0, void 0, function () {
    var aggregate;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          aggregate = new models_1.KeystrokeAggregate();
          aggregate.directory = payload.project
            ? payload.project.directory || Constants_1.NO_PROJ_NAME
            : Constants_1.NO_PROJ_NAME;
          Object.keys(payload.source).forEach(function (key) {
            var fileInfo = payload.source[key];
            /**
             * update the project info
             * project has {directory, name}
             */
            var baseName = path.basename(key);
            fileInfo.name = baseName;
            fileInfo.fsPath = key;
            fileInfo.projectDir = payload.project.directory;
            fileInfo.duration_seconds = fileInfo.end - fileInfo.start;
            // update the aggregate info
            aggregate.add += fileInfo.add;
            aggregate.close += fileInfo.close;
            aggregate['delete'] += fileInfo['delete'];
            aggregate.keystrokes += fileInfo.keystrokes;
            aggregate.linesAdded += fileInfo.linesAdded;
            aggregate.linesRemoved += fileInfo.linesRemoved;
            aggregate.open += fileInfo.open;
            aggregate.paste += fileInfo.paste;
            var existingFileInfo = fileChangeInfoMap[key];
            if (!existingFileInfo) {
              fileInfo.update_count = 1;
              fileInfo.kpm = aggregate.keystrokes;
              fileChangeInfoMap[key] = fileInfo;
            } else {
              // aggregate
              existingFileInfo.update_count += 1;
              existingFileInfo.keystrokes += fileInfo.keystrokes;
              existingFileInfo.kpm =
                existingFileInfo.keystrokes / existingFileInfo.update_count;
              existingFileInfo.add += fileInfo.add;
              existingFileInfo.close += fileInfo.close;
              existingFileInfo['delete'] += fileInfo['delete'];
              existingFileInfo.keystrokes += fileInfo.keystrokes;
              existingFileInfo.linesAdded += fileInfo.linesAdded;
              existingFileInfo.linesRemoved += fileInfo.linesRemoved;
              existingFileInfo.open += fileInfo.open;
              existingFileInfo.paste += fileInfo.paste;
              existingFileInfo.duration_seconds += fileInfo.duration_seconds;
              // non aggregates, just set
              existingFileInfo.lines = fileInfo.lines;
              existingFileInfo.length = fileInfo.length;
            }
          });
          // this will increment and store it offline
          return [
            4 /*yield*/,
            SessionSummaryData_1.incrementSessionSummaryData(
              aggregate,
              sessionMinutes,
            ),
          ];
        case 1:
          // this will increment and store it offline
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
exports.updateAggregateInfo = updateAggregateInfo;
