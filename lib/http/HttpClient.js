"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.isResponseOk = exports.hasTokenExpired = exports.softwareDelete = exports.softwarePost = exports.softwarePut = exports.softwareGet = exports.spotifyApiPut = exports.serverIsAvailable = void 0;
var axios_1 = require("axios");
var Constants_1 = require("../Constants");
var Util_1 = require("../Util");
var CacheManager_1 = require("../cache/CacheManager");
// build the axios api base url
var beApi = axios_1["default"].create({
    baseURL: "" + Constants_1.api_endpoint
});
var spotifyApi = axios_1["default"].create({});
var cacheMgr = CacheManager_1.CacheManager.getInstance();
function serverIsAvailable() {
    return __awaiter(this, void 0, void 0, function () {
        var isAvail;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    isAvail = cacheMgr.get("serverAvailable");
                    if (!(isAvail === undefined || isAvail === null)) return [3 /*break*/, 2];
                    return [4 /*yield*/, softwareGet("/ping", null)
                            .then(function (result) {
                            return isResponseOk(result);
                        })["catch"](function (e) {
                            return false;
                        })];
                case 1:
                    isAvail = _a.sent();
                    cacheMgr.set("serverAvailable", isAvail, 60);
                    _a.label = 2;
                case 2: return [2 /*return*/, isAvail];
            }
        });
    });
}
exports.serverIsAvailable = serverIsAvailable;
function spotifyApiPut(api, payload, accessToken) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (api.indexOf("https://api.spotify.com") === -1) {
                        api = "https://api.spotify.com" + api;
                    }
                    spotifyApi.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
                    return [4 /*yield*/, spotifyApi.put(api, payload)["catch"](function (err) {
                            Util_1.logIt("error posting data for " + api + ", message: " + err.message);
                            return err;
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.spotifyApiPut = spotifyApiPut;
/**
 * Response returns a paylod with the following...
 * data: <payload>, status: 200, statusText: "OK", config: Object
 * @param api
 * @param jwt
 */
function softwareGet(api, jwt) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (jwt) {
                        beApi.defaults.headers.common["Authorization"] = jwt;
                    }
                    return [4 /*yield*/, beApi.get(api)["catch"](function (err) {
                            Util_1.logIt("error fetching data for " + api + ", message: " + err.message);
                            return err;
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.softwareGet = softwareGet;
/**
 * perform a put request
 */
function softwarePut(api, payload, jwt) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // PUT the kpm to the PluginManager
                    beApi.defaults.headers.common["Authorization"] = jwt;
                    return [4 /*yield*/, beApi
                            .put(api, payload)
                            .then(function (resp) {
                            return resp;
                        })["catch"](function (err) {
                            Util_1.logIt("error posting data for " + api + ", message: " + err.message);
                            return err;
                        })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.softwarePut = softwarePut;
/**
 * perform a post request
 */
function softwarePost(api, payload, jwt) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // POST the kpm to the PluginManager
            beApi.defaults.headers.common["Authorization"] = jwt;
            return [2 /*return*/, beApi
                    .post(api, payload)
                    .then(function (resp) {
                    return resp;
                })["catch"](function (err) {
                    Util_1.logIt("error posting data for " + api + ", message: " + err.message);
                    return err;
                })];
        });
    });
}
exports.softwarePost = softwarePost;
/**
 * perform a delete request
 */
function softwareDelete(api, jwt) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            beApi.defaults.headers.common["Authorization"] = jwt;
            return [2 /*return*/, beApi["delete"](api)
                    .then(function (resp) {
                    return resp;
                })["catch"](function (err) {
                    Util_1.logIt("error with delete request for " + api + ", message: " + err.message);
                    return err;
                })];
        });
    });
}
exports.softwareDelete = softwareDelete;
/**
 * Check if the spotify response has an expired token
 * {"error": {"status": 401, "message": "The access token expired"}}
 */
function hasTokenExpired(resp) {
    // when a token expires, we'll get the following error data
    // err.response.status === 401
    // err.response.statusText = "Unauthorized"
    if (resp &&
        resp.response &&
        resp.response.status &&
        resp.response.status === 401) {
        return true;
    }
    return false;
}
exports.hasTokenExpired = hasTokenExpired;
/**
 * check if the reponse is ok or not
 * axios always sends the following
 * status:200
 * statusText:"OK"
 *
    code:"ENOTFOUND"
    config:Object {adapter: , transformRequest: Object, transformResponse: Object, …}
    errno:"ENOTFOUND"
    host:"api.spotify.com"
    hostname:"api.spotify.com"
    message:"getaddrinfo ENOTFOUND api.spotify.com api.spotify.com:443"
    port:443
 */
function isResponseOk(resp) {
    var status = getResponseStatus(resp);
    if (status && resp && status < 300) {
        return true;
    }
    return false;
}
exports.isResponseOk = isResponseOk;
/**
 * get the response http status code
 * axios always sends the following
 * status:200
 * statusText:"OK"
 */
function getResponseStatus(resp) {
    var status = null;
    if (resp && resp.status) {
        status = resp.status;
    }
    else if (resp && resp.response && resp.response.status) {
        status = resp.response.status;
    }
    return status;
}
