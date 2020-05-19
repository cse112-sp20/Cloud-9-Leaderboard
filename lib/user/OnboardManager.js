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
exports.updateAtlassianAccessInfo = exports.getAtlassianOauth = exports.refetchAtlassianOauthLazily = exports.createAnonymousUser = exports.onboardInit = void 0;
var vscode_1 = require("vscode");
var DataController_1 = require("../DataController");
var Util_1 = require("../Util");
var HttpClient_1 = require("../http/HttpClient");
var EventManager_1 = require("../managers/EventManager");
var retry_counter = 0;
// 2 minute
var one_min_millis = 1000 * 60;
var atlassianOauthFetchTimeout = null;
function onboardInit(ctx, callback) {
    var jwt = Util_1.getItem("jwt");
    if (jwt) {
        // we have the jwt, call the callback that anon was not created
        return callback(ctx, false /*anonCreated*/);
    }
    var windowState = vscode_1.window.state;
    if (windowState.focused) {
        // perform primary window related work
        primaryWindowOnboarding(ctx, callback);
    }
    else {
        // call the secondary onboarding logic
        secondaryWindowOnboarding(ctx, callback);
    }
}
exports.onboardInit = onboardInit;
function primaryWindowOnboarding(ctx, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var serverIsOnline;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, HttpClient_1.serverIsAvailable()];
                case 1:
                    serverIsOnline = _a.sent();
                    if (!serverIsOnline) return [3 /*break*/, 3];
                    // great, it's online, create the anon user
                    return [4 /*yield*/, createAnonymousUser(serverIsOnline)];
                case 2:
                    // great, it's online, create the anon user
                    _a.sent();
                    // great, it worked. call the callback
                    return [2 /*return*/, callback(ctx, true /*anonCreated*/)];
                case 3:
                    // not online, try again in a minute
                    if (retry_counter === 0) {
                        // show the prompt that we're unable connect to our app 1 time only
                        Util_1.showOfflinePrompt(true);
                    }
                    // call activate again later
                    setTimeout(function () {
                        retry_counter++;
                        onboardInit(ctx, callback);
                    }, one_min_millis);
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * This is called if there's no JWT. If it reaches a
 * 6th call it will create an anon user.
 * @param ctx
 * @param callback
 */
function secondaryWindowOnboarding(ctx, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var serverIsOnline;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, HttpClient_1.serverIsAvailable()];
                case 1:
                    serverIsOnline = _a.sent();
                    if (!serverIsOnline) {
                        // not online, try again later
                        setTimeout(function () {
                            onboardInit(ctx, callback);
                        }, one_min_millis);
                    }
                    else if (retry_counter < 5) {
                        if (serverIsOnline) {
                            retry_counter++;
                        }
                        // call activate again in about 6 seconds
                        setTimeout(function () {
                            onboardInit(ctx, callback);
                        }, 1000 * 5);
                    }
                    // tried enough times, create an anon user
                    return [4 /*yield*/, createAnonymousUser(serverIsOnline)];
                case 2:
                    // tried enough times, create an anon user
                    _a.sent();
                    // call the callback
                    return [2 /*return*/, callback(ctx, true /*anonCreated*/)];
            }
        });
    });
}
/**
 * create an anonymous user based on github email or mac addr
 */
function createAnonymousUser(serverIsOnline) {
    return __awaiter(this, void 0, void 0, function () {
        var appJwt, jwt, creation_annotation, username, timezone, hostname, workspace_name, eventType, resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, DataController_1.getAppJwt(serverIsOnline)];
                case 1:
                    appJwt = _a.sent();
                    if (!(appJwt && serverIsOnline)) return [3 /*break*/, 5];
                    jwt = Util_1.getItem("jwt");
                    if (!!jwt) return [3 /*break*/, 5];
                    creation_annotation = "NO_SESSION_FILE";
                    return [4 /*yield*/, Util_1.getOsUsername()];
                case 2:
                    username = _a.sent();
                    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
                    return [4 /*yield*/, Util_1.getHostname()];
                case 3:
                    hostname = _a.sent();
                    workspace_name = Util_1.getWorkspaceName();
                    eventType = "createanon-" + workspace_name;
                    EventManager_1.EventManager.getInstance().createCodeTimeEvent(eventType, "anon_creation", "anon creation");
                    return [4 /*yield*/, HttpClient_1.softwarePost("/data/onboard", {
                            timezone: timezone,
                            username: username,
                            creation_annotation: creation_annotation,
                            hostname: hostname
                        }, appJwt)];
                case 4:
                    resp = _a.sent();
                    if (HttpClient_1.isResponseOk(resp) && resp.data && resp.data.jwt) {
                        Util_1.setItem("jwt", resp.data.jwt);
                        return [2 /*return*/, resp.data.jwt];
                    }
                    _a.label = 5;
                case 5: return [2 /*return*/, null];
            }
        });
    });
}
exports.createAnonymousUser = createAnonymousUser;
function refetchAtlassianOauthLazily(tryCountUntilFoundUser) {
    if (tryCountUntilFoundUser === void 0) { tryCountUntilFoundUser = 40; }
    if (atlassianOauthFetchTimeout) {
        return;
    }
    atlassianOauthFetchTimeout = setTimeout(function () {
        atlassianOauthFetchTimeout = null;
        refetchAtlassianOauthFetchHandler(tryCountUntilFoundUser);
    }, 10000);
}
exports.refetchAtlassianOauthLazily = refetchAtlassianOauthLazily;
function refetchAtlassianOauthFetchHandler(tryCountUntilFoundUser) {
    return __awaiter(this, void 0, void 0, function () {
        var serverIsOnline, oauth, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, HttpClient_1.serverIsAvailable()];
                case 1:
                    serverIsOnline = _a.sent();
                    return [4 /*yield*/, getAtlassianOauth(serverIsOnline)];
                case 2:
                    oauth = _a.sent();
                    if (!oauth) {
                        // try again if the count is not zero
                        if (tryCountUntilFoundUser > 0) {
                            tryCountUntilFoundUser -= 1;
                            refetchAtlassianOauthLazily(tryCountUntilFoundUser);
                        }
                    }
                    else {
                        message = "Successfully connected to Atlassian";
                        vscode_1.window.showInformationMessage(message);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function getAtlassianOauth(serverIsOnline) {
    return __awaiter(this, void 0, void 0, function () {
        var jwt, user, i, oauthInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    jwt = Util_1.getItem("jwt");
                    if (!(serverIsOnline && jwt)) return [3 /*break*/, 2];
                    return [4 /*yield*/, DataController_1.getUser(serverIsOnline, jwt)];
                case 1:
                    user = _a.sent();
                    if (user && user.auths) {
                        // get the one that is "slack"
                        for (i = 0; i < user.auths.length; i++) {
                            oauthInfo = user.auths[i];
                            if (oauthInfo.type === "atlassian") {
                                updateAtlassianAccessInfo(oauthInfo);
                                return [2 /*return*/, oauthInfo];
                            }
                        }
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/, null];
            }
        });
    });
}
exports.getAtlassianOauth = getAtlassianOauth;
function updateAtlassianAccessInfo(oauth) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            /**
             * {access_token, refresh_token}
             */
            if (oauth) {
                Util_1.setItem("atlassian_access_token", oauth.access_token);
            }
            else {
                Util_1.setItem("atlassian_access_token", null);
            }
            return [2 /*return*/];
        });
    });
}
exports.updateAtlassianAccessInfo = updateAtlassianAccessInfo;
