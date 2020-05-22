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
exports.storeCurrentPayload = exports.getCurrentPayloadFile = exports.sendBatchPayload = exports.batchSendPayloadData = exports.getLastSavedKeystrokesStats = exports.batchSendData = exports.batchSendArrayData = exports.sendOfflineData = exports.sendOfflineEvents = exports.sendOfflineTimeData = exports.clearLastSavedKeystrokeStats = void 0;
var HttpClient_1 = require('../http/HttpClient');
var Util_1 = require('../Util');
var TimeSummaryData_1 = require('../storage/TimeSummaryData');
var fs = require('fs');
// batch offline payloads in 8. sqs has a 256k body limit
var batch_limit = 8;
var latestPayload = null;
function clearLastSavedKeystrokeStats() {
  latestPayload = null;
}
exports.clearLastSavedKeystrokeStats = clearLastSavedKeystrokeStats;
/**
 * send the offline TimeData payloads
 */
function sendOfflineTimeData() {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      batchSendArrayData(
        '/data/time',
        TimeSummaryData_1.getTimeDataSummaryFile(),
      );
      // clear time data data. this will also clear the
      // code time and active code time numbers
      TimeSummaryData_1.clearTimeDataSummary();
      return [2 /*return*/];
    });
  });
}
exports.sendOfflineTimeData = sendOfflineTimeData;
/**
 * send the offline Event payloads
 */
function sendOfflineEvents() {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      batchSendData('/data/event', Util_1.getPluginEventsFile());
      return [2 /*return*/];
    });
  });
}
exports.sendOfflineEvents = sendOfflineEvents;
/**
 * send the offline data.
 */
function sendOfflineData(isNewDay) {
  if (isNewDay === void 0) {
    isNewDay = false;
  }
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      batchSendData('/data/batch', Util_1.getSoftwareDataStoreFile());
      return [2 /*return*/];
    });
  });
}
exports.sendOfflineData = sendOfflineData;
/**
 * batch send array data
 * @param api
 * @param file
 */
function batchSendArrayData(api, file) {
  return __awaiter(this, void 0, void 0, function () {
    var isonline, payloads;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, HttpClient_1.serverIsAvailable()];
        case 1:
          isonline = _a.sent();
          if (!isonline) {
            return [2 /*return*/];
          }
          try {
            if (fs.existsSync(file)) {
              payloads = Util_1.getFileDataArray(file);
              batchSendPayloadData(api, file, payloads);
            }
          } catch (e) {
            Util_1.logIt('Error batch sending payloads: ' + e.message);
          }
          return [2 /*return*/];
      }
    });
  });
}
exports.batchSendArrayData = batchSendArrayData;
function batchSendData(api, file) {
  return __awaiter(this, void 0, void 0, function () {
    var isonline, payloads;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, HttpClient_1.serverIsAvailable()];
        case 1:
          isonline = _a.sent();
          if (!isonline) {
            return [2 /*return*/];
          }
          try {
            if (fs.existsSync(file)) {
              payloads = Util_1.getFileDataPayloadsAsJson(file);
              batchSendPayloadData(api, file, payloads);
            }
          } catch (e) {
            Util_1.logIt('Error batch sending payloads: ' + e.message);
          }
          return [2 /*return*/];
      }
    });
  });
}
exports.batchSendData = batchSendData;
function getLastSavedKeystrokesStats() {
  return __awaiter(this, void 0, void 0, function () {
    var dataFile, currentPayloads;
    return __generator(this, function (_a) {
      dataFile = Util_1.getSoftwareDataStoreFile();
      try {
        // try to get the last paylaod from the file first (data.json)
        if (fs.existsSync(dataFile)) {
          currentPayloads = Util_1.getFileDataPayloadsAsJson(dataFile);
          if (currentPayloads && currentPayloads.length) {
            // sort in descending order
            currentPayloads.sort(function (a, b) {
              return b.start - a.start;
            });
            // get the 1st element
            latestPayload = currentPayloads[0];
          }
        }
      } catch (e) {
        Util_1.logIt('Error fetching last payload: ' + e.message);
      }
      // returns one in memory if not found in file
      return [2 /*return*/, latestPayload];
    });
  });
}
exports.getLastSavedKeystrokesStats = getLastSavedKeystrokesStats;
function batchSendPayloadData(api, file, payloads) {
  return __awaiter(this, void 0, void 0, function () {
    var batch, i, resp, resp;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (!(payloads && payloads.length > 0)) return [3 /*break*/, 7];
          Util_1.logEvent(
            'sending batch payloads: ' + JSON.stringify(payloads),
          );
          batch = [];
          i = 0;
          _a.label = 1;
        case 1:
          if (!(i < payloads.length)) return [3 /*break*/, 5];
          if (!(batch.length >= batch_limit)) return [3 /*break*/, 3];
          return [4 /*yield*/, sendBatchPayload(api, batch)];
        case 2:
          resp = _a.sent();
          if (!HttpClient_1.isResponseOk(resp)) {
            // there was a problem with the transmission.
            // bail out so we don't delete the offline data
            return [2 /*return*/];
          }
          batch = [];
          _a.label = 3;
        case 3:
          batch.push(payloads[i]);
          _a.label = 4;
        case 4:
          i++;
          return [3 /*break*/, 1];
        case 5:
          if (!(batch.length > 0)) return [3 /*break*/, 7];
          return [4 /*yield*/, sendBatchPayload(api, batch)];
        case 6:
          resp = _a.sent();
          if (!HttpClient_1.isResponseOk(resp)) {
            // there was a problem with the transmission.
            // bail out so we don't delete the offline data
            return [2 /*return*/];
          }
          _a.label = 7;
        case 7:
          // we're online so just delete the file
          Util_1.deleteFile(file);
          return [2 /*return*/];
      }
    });
  });
}
exports.batchSendPayloadData = batchSendPayloadData;
function sendBatchPayload(api, batch) {
  // console.log("SEND BATCH LOOK HERE");
  // console.log(batch);
  return HttpClient_1.softwarePost(api, batch, Util_1.getItem('jwt'))['catch'](
    function (e) {
      Util_1.logIt('Unable to send plugin data batch, error: ' + e.message);
    },
  );
}
exports.sendBatchPayload = sendBatchPayload;
function getCurrentPayloadFile() {
  var file = Util_1.getSoftwareDir();
  if (Util_1.isWindows()) {
    file += '\\latestKeystrokes.json';
  } else {
    file += '/latestKeystrokes.json';
  }
  return file;
}
exports.getCurrentPayloadFile = getCurrentPayloadFile;
function storeCurrentPayload(payload) {
  return __awaiter(this, void 0, void 0, function () {
    var content;
    return __generator(this, function (_a) {
      try {
        content = JSON.stringify(payload, null, 4);
        fs.writeFileSync(this.getCurrentPayloadFile(), content, function (err) {
          if (err)
            Util_1.logIt('Deployer: Error writing time data: ' + err.message);
        });
      } catch (e) {
        //
      }
      return [2 /*return*/];
    });
  });
}
exports.storeCurrentPayload = storeCurrentPayload;
