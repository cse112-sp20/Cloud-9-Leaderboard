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
exports.writeCodeTimeMetricsDashboard = exports.writeProjectContributorCommitDashboard = exports.writeProjectContributorCommitDashboardFromGitLogs = exports.writeProjectCommitDashboard = exports.writeProjectCommitDashboardByRangeType = exports.writeProjectCommitDashboardByStartEnd = exports.writeDailyReportDashboard = exports.writeCommitSummaryData = exports.handleKpmClickedEvent = exports.sendHeartbeat = exports.refetchSlackConnectStatusLazily = exports.refetchUserStatusLazily = exports.updatePreferences = exports.initializePreferences = exports.getUser = exports.getSlackOauth = exports.isLoggedIn = exports.getUserRegistrationState = exports.getAppJwt = exports.sendTeamInvite = exports.getRegisteredTeamMembers = exports.getToggleFileEventLoggingState = void 0;
var vscode_1 = require("vscode");
var HttpClient_1 = require("./http/HttpClient");
var Util_1 = require("./Util");
var MenuManager_1 = require("./menu/MenuManager");
var Constants_1 = require("./Constants");
var SessionSummaryData_1 = require("./storage/SessionSummaryData");
var GitUtil_1 = require("./repo/GitUtil");
var TimeSummaryData_1 = require("./storage/TimeSummaryData");
var fs = require("fs");
var moment = require("moment-timezone");
var toggleFileEventLogging = null;
var slackFetchTimeout = null;
var userFetchTimeout = null;
function getToggleFileEventLoggingState() {
    if (toggleFileEventLogging === null) {
        toggleFileEventLogging = vscode_1.workspace
            .getConfiguration()
            .get("toggleFileEventLogging");
    }
    return toggleFileEventLogging;
}
exports.getToggleFileEventLoggingState = getToggleFileEventLoggingState;
function getRegisteredTeamMembers(identifier) {
    return __awaiter(this, void 0, void 0, function () {
        var encodedIdentifier, api, teamMembers, resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    encodedIdentifier = encodeURIComponent(identifier);
                    api = "/repo/contributors?identifier=" + encodedIdentifier;
                    teamMembers = [];
                    return [4 /*yield*/, HttpClient_1.softwareGet(api, Util_1.getItem("jwt"))];
                case 1:
                    resp = _a.sent();
                    if (HttpClient_1.isResponseOk(resp)) {
                        teamMembers = resp.data;
                    }
                    return [2 /*return*/, teamMembers];
            }
        });
    });
}
exports.getRegisteredTeamMembers = getRegisteredTeamMembers;
function sendTeamInvite(identifier, emails) {
    return __awaiter(this, void 0, void 0, function () {
        var payload, api, resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    payload = {
                        identifier: identifier,
                        emails: emails
                    };
                    api = "/users/invite";
                    return [4 /*yield*/, HttpClient_1.softwarePost(api, payload, Util_1.getItem("jwt"))];
                case 1:
                    resp = _a.sent();
                    if (HttpClient_1.isResponseOk(resp)) {
                        vscode_1.window.showInformationMessage("Sent team invitation");
                    }
                    else {
                        vscode_1.window.showErrorMessage(resp.data.message);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.sendTeamInvite = sendTeamInvite;
/**
 * get the app jwt
 */
function getAppJwt(serverIsOnline) {
    return __awaiter(this, void 0, void 0, function () {
        var resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!serverIsOnline) return [3 /*break*/, 2];
                    return [4 /*yield*/, HttpClient_1.softwareGet("/data/apptoken?token=" + Util_1.nowInSecs(), null)];
                case 1:
                    resp = _a.sent();
                    if (HttpClient_1.isResponseOk(resp)) {
                        return [2 /*return*/, resp.data.jwt];
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/, null];
            }
        });
    });
}
exports.getAppJwt = getAppJwt;
function getUserRegistrationState(serverIsOnline) {
    return __awaiter(this, void 0, void 0, function () {
        var jwt, api, resp, state, sessionEmail, email, pluginJwt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    jwt = Util_1.getItem("jwt");
                    if (!(serverIsOnline && jwt)) return [3 /*break*/, 2];
                    api = "/users/plugin/state";
                    return [4 /*yield*/, HttpClient_1.softwareGet(api, jwt)];
                case 1:
                    resp = _a.sent();
                    if (HttpClient_1.isResponseOk(resp) && resp.data) {
                        state = resp.data.state ? resp.data.state : "UNKNOWN";
                        if (state === "OK") {
                            sessionEmail = Util_1.getItem("name");
                            email = resp.data.email;
                            // set the name using the email
                            if (email && sessionEmail !== email) {
                                Util_1.setItem("name", email);
                            }
                            pluginJwt = resp.data.jwt;
                            if (pluginJwt && pluginJwt !== jwt) {
                                // update it
                                Util_1.setItem("jwt", pluginJwt);
                            }
                            // if we need the user it's "resp.data.user"
                            return [2 /*return*/, { loggedOn: true, state: state }];
                        }
                        // return the state that is returned
                        return [2 /*return*/, { loggedOn: false, state: state }];
                    }
                    _a.label = 2;
                case 2: 
                // all else fails, set false and UNKNOWN
                return [2 /*return*/, { loggedOn: false, state: "UNKNOWN" }];
            }
        });
    });
}
exports.getUserRegistrationState = getUserRegistrationState;
/**
 * return whether the user is logged on or not
 * {loggedIn: true|false}
 */
function isLoggedIn() {
    return __awaiter(this, void 0, void 0, function () {
        var name, serverIsOnline, state;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    name = Util_1.getItem("name");
                    if (name) {
                        return [2 /*return*/, true];
                    }
                    return [4 /*yield*/, HttpClient_1.serverIsAvailable()];
                case 1:
                    serverIsOnline = _a.sent();
                    return [4 /*yield*/, getUserRegistrationState(serverIsOnline)];
                case 2:
                    state = _a.sent();
                    if (state.loggedOn) {
                        initializePreferences(serverIsOnline);
                    }
                    return [2 /*return*/, state.loggedOn];
            }
        });
    });
}
exports.isLoggedIn = isLoggedIn;
function getSlackOauth(serverIsOnline) {
    return __awaiter(this, void 0, void 0, function () {
        var jwt, user, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    jwt = Util_1.getItem("jwt");
                    if (!(serverIsOnline && jwt)) return [3 /*break*/, 2];
                    return [4 /*yield*/, getUser(serverIsOnline, jwt)];
                case 1:
                    user = _a.sent();
                    if (user && user.auths) {
                        // get the one that is "slack"
                        for (i = 0; i < user.auths.length; i++) {
                            if (user.auths[i].type === "slack") {
                                Util_1.setItem("slack_access_token", user.auths[i].access_token);
                                return [2 /*return*/, user.auths[i]];
                            }
                        }
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
exports.getSlackOauth = getSlackOauth;
function getUser(serverIsOnline, jwt) {
    return __awaiter(this, void 0, void 0, function () {
        var api, resp, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(jwt && serverIsOnline)) return [3 /*break*/, 2];
                    api = "/users/me";
                    return [4 /*yield*/, HttpClient_1.softwareGet(api, jwt)];
                case 1:
                    resp = _a.sent();
                    if (HttpClient_1.isResponseOk(resp)) {
                        if (resp && resp.data && resp.data.data) {
                            user = resp.data.data;
                            if (user.registered === 1) {
                                // update jwt to what the jwt is for this spotify user
                                Util_1.setItem("name", user.email);
                            }
                            return [2 /*return*/, user];
                        }
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/, null];
            }
        });
    });
}
exports.getUser = getUser;
function initializePreferences(serverIsOnline) {
    return __awaiter(this, void 0, void 0, function () {
        var jwt, sessionThresholdInSec, user, userId, prefs, prefsShowGit, prefsShowRank;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    jwt = Util_1.getItem("jwt");
                    sessionThresholdInSec = Constants_1.DEFAULT_SESSION_THRESHOLD_SECONDS;
                    if (!(jwt && serverIsOnline)) return [3 /*break*/, 6];
                    return [4 /*yield*/, getUser(serverIsOnline, jwt)];
                case 1:
                    user = _a.sent();
                    if (!(user && user.preferences)) return [3 /*break*/, 6];
                    // obtain the session threshold in seconds "sessionThresholdInSec"
                    sessionThresholdInSec =
                        user.preferences.sessionThresholdInSec ||
                            Constants_1.DEFAULT_SESSION_THRESHOLD_SECONDS;
                    userId = parseInt(user.id, 10);
                    prefs = user.preferences;
                    prefsShowGit = prefs.showGit !== null && prefs.showGit !== undefined
                        ? prefs.showGit
                        : null;
                    prefsShowRank = prefs.showRank !== null && prefs.showRank !== undefined
                        ? prefs.showRank
                        : null;
                    if (!(prefsShowGit === null || prefsShowRank === null)) return [3 /*break*/, 3];
                    return [4 /*yield*/, sendPreferencesUpdate(userId, prefs)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 3:
                    if (!(prefsShowGit !== null)) return [3 /*break*/, 5];
                    return [4 /*yield*/, vscode_1.workspace
                            .getConfiguration()
                            .update("showGitMetrics", prefsShowGit, vscode_1.ConfigurationTarget.Global)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    if (prefsShowRank !== null) {
                        // await workspace
                        //     .getConfiguration()
                        //     .update(
                        //         "showWeeklyRanking",
                        //         prefsShowRank,
                        //         ConfigurationTarget.Global
                        //     );
                    }
                    _a.label = 6;
                case 6:
                    // update the session threshold in seconds config
                    Util_1.setItem("sessionThresholdInSec", sessionThresholdInSec);
                    return [2 /*return*/];
            }
        });
    });
}
exports.initializePreferences = initializePreferences;
function sendPreferencesUpdate(userId, userPrefs) {
    return __awaiter(this, void 0, void 0, function () {
        var api, showGitMetrics, resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    api = "/users/" + userId;
                    showGitMetrics = vscode_1.workspace.getConfiguration().get("showGitMetrics");
                    // let showWeeklyRanking = workspace
                    //     .getConfiguration()
                    //     .get("showWeeklyRanking");
                    userPrefs["showGit"] = showGitMetrics;
                    // userPrefs["showRank"] = showWeeklyRanking;
                    // update the preferences
                    // /:id/preferences
                    api = "/users/" + userId + "/preferences";
                    return [4 /*yield*/, HttpClient_1.softwarePut(api, userPrefs, Util_1.getItem("jwt"))];
                case 1:
                    resp = _a.sent();
                    if (HttpClient_1.isResponseOk(resp)) {
                        Util_1.logIt("update user code time preferences");
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function updatePreferences() {
    return __awaiter(this, void 0, void 0, function () {
        var showGitMetrics, jwt, serverIsOnline, user, api, resp, prefs, prefsShowGit, prefsShowRank;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    toggleFileEventLogging = vscode_1.workspace
                        .getConfiguration()
                        .get("toggleFileEventLogging");
                    showGitMetrics = vscode_1.workspace.getConfiguration().get("showGitMetrics");
                    jwt = Util_1.getItem("jwt");
                    return [4 /*yield*/, HttpClient_1.serverIsAvailable()];
                case 1:
                    serverIsOnline = _a.sent();
                    if (!(jwt && serverIsOnline)) return [3 /*break*/, 5];
                    return [4 /*yield*/, getUser(serverIsOnline, jwt)];
                case 2:
                    user = _a.sent();
                    if (!user) {
                        return [2 /*return*/];
                    }
                    api = "/users/" + user.id;
                    return [4 /*yield*/, HttpClient_1.softwareGet(api, jwt)];
                case 3:
                    resp = _a.sent();
                    if (!HttpClient_1.isResponseOk(resp)) return [3 /*break*/, 5];
                    if (!(resp && resp.data && resp.data.data && resp.data.data.preferences)) return [3 /*break*/, 5];
                    prefs = resp.data.data.preferences;
                    prefsShowGit = prefs.showGit !== null && prefs.showGit !== undefined
                        ? prefs.showGit
                        : null;
                    prefsShowRank = prefs.showRank !== null && prefs.showRank !== undefined
                        ? prefs.showRank
                        : null;
                    if (!(prefsShowGit === null || prefsShowGit !== showGitMetrics)) return [3 /*break*/, 5];
                    return [4 /*yield*/, sendPreferencesUpdate(parseInt(user.id, 10), prefs)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.updatePreferences = updatePreferences;
function refetchUserStatusLazily(tryCountUntilFoundUser, interval) {
    if (tryCountUntilFoundUser === void 0) { tryCountUntilFoundUser = 50; }
    if (interval === void 0) { interval = 10000; }
    if (userFetchTimeout) {
        return;
    }
    userFetchTimeout = setTimeout(function () {
        userFetchTimeout = null;
        userStatusFetchHandler(tryCountUntilFoundUser, interval);
    }, interval);
}
exports.refetchUserStatusLazily = refetchUserStatusLazily;
function userStatusFetchHandler(tryCountUntilFoundUser, interval) {
    return __awaiter(this, void 0, void 0, function () {
        var serverIsOnline, loggedIn, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, HttpClient_1.serverIsAvailable()];
                case 1:
                    serverIsOnline = _a.sent();
                    return [4 /*yield*/, isLoggedIn()];
                case 2:
                    loggedIn = _a.sent();
                    if (!loggedIn) {
                        // try again if the count is not zero
                        if (tryCountUntilFoundUser > 0) {
                            tryCountUntilFoundUser -= 1;
                            refetchUserStatusLazily(tryCountUntilFoundUser, interval);
                        }
                    }
                    else {
                        sendHeartbeat("STATE_CHANGE:LOGGED_IN:true", serverIsOnline);
                        message = "Successfully logged on to Code Time";
                        vscode_1.window.showInformationMessage(message);
                        vscode_1.commands.executeCommand("codetime.sendOfflineData");
                        vscode_1.commands.executeCommand("codetime.refreshTreeViews");
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function refetchSlackConnectStatusLazily(callback, tryCountUntilFound) {
    if (tryCountUntilFound === void 0) { tryCountUntilFound = 40; }
    if (slackFetchTimeout) {
        return;
    }
    slackFetchTimeout = setTimeout(function () {
        slackFetchTimeout = null;
        slackConnectStatusHandler(callback, tryCountUntilFound);
    }, 10000);
}
exports.refetchSlackConnectStatusLazily = refetchSlackConnectStatusLazily;
function slackConnectStatusHandler(callback, tryCountUntilFound) {
    return __awaiter(this, void 0, void 0, function () {
        var serverIsOnline, oauth;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, HttpClient_1.serverIsAvailable()];
                case 1:
                    serverIsOnline = _a.sent();
                    return [4 /*yield*/, getSlackOauth(serverIsOnline)];
                case 2:
                    oauth = _a.sent();
                    if (!oauth) {
                        // try again if the count is not zero
                        if (tryCountUntilFound > 0) {
                            tryCountUntilFound -= 1;
                            refetchSlackConnectStatusLazily(callback, tryCountUntilFound);
                        }
                    }
                    else {
                        vscode_1.window.showInformationMessage("Successfully connected to Slack");
                        if (callback) {
                            callback();
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function sendHeartbeat(reason, serverIsOnline) {
    return __awaiter(this, void 0, void 0, function () {
        var jwt, heartbeat, _a, api;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    jwt = Util_1.getItem("jwt");
                    if (!(serverIsOnline && jwt)) return [3 /*break*/, 2];
                    _a = {
                        pluginId: Util_1.getPluginId(),
                        os: Util_1.getOs(),
                        start: Util_1.nowInSecs(),
                        version: Util_1.getVersion()
                    };
                    return [4 /*yield*/, Util_1.getHostname()];
                case 1:
                    heartbeat = (_a.hostname = _b.sent(),
                        _a.session_ctime = Util_1.getSessionFileCreateTime(),
                        _a.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone,
                        _a.trigger_annotation = reason,
                        _a.editor_token = Util_1.getWorkspaceName(),
                        _a);
                    api = "/data/heartbeat";
                    HttpClient_1.softwarePost(api, heartbeat, jwt).then(function (resp) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (!HttpClient_1.isResponseOk(resp)) {
                                Util_1.logIt("unable to send heartbeat ping");
                            }
                            return [2 /*return*/];
                        });
                    }); });
                    _b.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
exports.sendHeartbeat = sendHeartbeat;
function handleKpmClickedEvent() {
    return __awaiter(this, void 0, void 0, function () {
        var serverIsOnline, loggedIn, webUrl, jwt, encodedJwt;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, HttpClient_1.serverIsAvailable()];
                case 1:
                    serverIsOnline = _a.sent();
                    return [4 /*yield*/, isLoggedIn()];
                case 2:
                    loggedIn = _a.sent();
                    return [4 /*yield*/, MenuManager_1.buildWebDashboardUrl()];
                case 3:
                    webUrl = _a.sent();
                    if (!!loggedIn) return [3 /*break*/, 5];
                    return [4 /*yield*/, Util_1.buildLoginUrl(serverIsOnline)];
                case 4:
                    webUrl = _a.sent();
                    refetchUserStatusLazily();
                    return [3 /*break*/, 6];
                case 5:
                    jwt = Util_1.getItem("jwt");
                    encodedJwt = encodeURIComponent(jwt);
                    webUrl = webUrl + "?token=" + encodedJwt;
                    _a.label = 6;
                case 6:
                    Util_1.launchWebUrl(webUrl);
                    return [2 /*return*/];
            }
        });
    });
}
exports.handleKpmClickedEvent = handleKpmClickedEvent;
function writeCommitSummaryData() {
    return __awaiter(this, void 0, void 0, function () {
        var filePath, serverIsOnline, result, content;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    filePath = Util_1.getCommitSummaryFile();
                    return [4 /*yield*/, HttpClient_1.serverIsAvailable()];
                case 1:
                    serverIsOnline = _a.sent();
                    if (!serverIsOnline) return [3 /*break*/, 3];
                    return [4 /*yield*/, HttpClient_1.softwareGet("/dashboard/commits", Util_1.getItem("jwt"))["catch"](function (err) {
                            return null;
                        })];
                case 2:
                    result = _a.sent();
                    if (HttpClient_1.isResponseOk(result) && result.data) {
                        content = result.data;
                        console.log("COMMITS");
                        console.log(content);
                        fs.writeFileSync(filePath, content, function (err) {
                            if (err) {
                                Util_1.logIt("Error writing to the weekly commit summary content file: " + err.message);
                            }
                        });
                    }
                    _a.label = 3;
                case 3:
                    if (!fs.existsSync(filePath)) {
                        // just create an empty file
                        fs.writeFileSync(filePath, "WEEKLY COMMIT SUMMARY", function (err) {
                            if (err) {
                                Util_1.logIt("Error writing to the weekly commit summary content file: " + err.message);
                            }
                        });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.writeCommitSummaryData = writeCommitSummaryData;
function writeDailyReportDashboard(type, projectIds) {
    if (type === void 0) { type = "yesterday"; }
    if (projectIds === void 0) { projectIds = []; }
    return __awaiter(this, void 0, void 0, function () {
        var dashboardContent, file;
        return __generator(this, function (_a) {
            dashboardContent = "";
            file = Util_1.getDailyReportSummaryFile();
            fs.writeFileSync(file, dashboardContent, function (err) {
                if (err) {
                    Util_1.logIt("Error writing to the daily report content file: " + err.message);
                }
            });
            return [2 /*return*/];
        });
    });
}
exports.writeDailyReportDashboard = writeDailyReportDashboard;
function writeProjectCommitDashboardByStartEnd(start, end, projectIds) {
    return __awaiter(this, void 0, void 0, function () {
        var qryStr, api, result, _a, rangeStart, rangeEnd;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    qryStr = "?start=" + start + "&end=" + end + "&projectIds=" + projectIds.join(",");
                    api = "/projects/codeSummary" + qryStr;
                    return [4 /*yield*/, HttpClient_1.softwareGet(api, Util_1.getItem("jwt"))];
                case 1:
                    result = _b.sent();
                    _a = createStartEndRangeByTimestamps(start, end), rangeStart = _a.rangeStart, rangeEnd = _a.rangeEnd;
                    return [4 /*yield*/, writeProjectCommitDashboard(result, rangeStart, rangeEnd)];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.writeProjectCommitDashboardByStartEnd = writeProjectCommitDashboardByStartEnd;
function writeProjectCommitDashboardByRangeType(type, projectIds) {
    if (type === void 0) { type = "lastWeek"; }
    return __awaiter(this, void 0, void 0, function () {
        var qryStr, api, result, _a, rangeStart, rangeEnd;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    qryStr = "?timeRange=" + type + "&projectIds=" + projectIds.join(",");
                    api = "/projects/codeSummary" + qryStr;
                    return [4 /*yield*/, HttpClient_1.softwareGet(api, Util_1.getItem("jwt"))];
                case 1:
                    result = _b.sent();
                    _a = createStartEndRangeByType(type), rangeStart = _a.rangeStart, rangeEnd = _a.rangeEnd;
                    return [4 /*yield*/, writeProjectCommitDashboard(result, rangeStart, rangeEnd)];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.writeProjectCommitDashboardByRangeType = writeProjectCommitDashboardByRangeType;
function writeProjectCommitDashboard(apiResult, rangeStart, rangeEnd) {
    return __awaiter(this, void 0, void 0, function () {
        var dashboardContent, codeCommitData, formattedDate, file;
        return __generator(this, function (_a) {
            dashboardContent = "";
            // [{projectId, name, identifier, commits, files_changed, insertions, deletions, hours,
            //   keystrokes, characters_added, characters_deleted, lines_added, lines_removed},...]
            if (HttpClient_1.isResponseOk(apiResult)) {
                codeCommitData = apiResult.data;
                formattedDate = moment().format("ddd, MMM Do h:mma");
                dashboardContent = "CODE TIME PROJECT SUMMARY     (Last updated on " + formattedDate + ")";
                dashboardContent += "\n\n";
                if (codeCommitData && codeCommitData.length) {
                    // filter out null project names
                    codeCommitData = codeCommitData.filter(function (n) { return n.name; });
                    codeCommitData.forEach(function (el) {
                        dashboardContent += Util_1.getDashboardRow(el.name, rangeStart + " to " + rangeEnd, true);
                        // hours
                        var hours = Util_1.humanizeMinutes(el.session_seconds / 60);
                        dashboardContent += Util_1.getDashboardRow("Code time", hours);
                        // keystrokes
                        var keystrokes = el.keystrokes
                            ? Util_1.formatNumber(el.keystrokes)
                            : Util_1.formatNumber(0);
                        dashboardContent += Util_1.getDashboardRow("Keystrokes", keystrokes);
                        // commits
                        var commits = el.commits ? Util_1.formatNumber(el.commits) : Util_1.formatNumber(0);
                        dashboardContent += Util_1.getDashboardRow("Commits", commits);
                        // files_changed
                        var files_changed = el.files_changed
                            ? Util_1.formatNumber(el.files_changed)
                            : Util_1.formatNumber(0);
                        dashboardContent += Util_1.getDashboardRow("Files changed", files_changed);
                        // insertions
                        var insertions = el.insertions
                            ? Util_1.formatNumber(el.insertions)
                            : Util_1.formatNumber(0);
                        dashboardContent += Util_1.getDashboardRow("Insertions", insertions);
                        // deletions
                        var deletions = el.deletions
                            ? Util_1.formatNumber(el.deletions)
                            : Util_1.formatNumber(0);
                        dashboardContent += Util_1.getDashboardRow("Deletions", deletions);
                        dashboardContent += Util_1.getDashboardBottomBorder();
                    });
                }
                else {
                    dashboardContent += "No data available";
                }
                dashboardContent += "\n";
            }
            file = Util_1.getProjectCodeSummaryFile();
            fs.writeFileSync(file, dashboardContent, function (err) {
                if (err) {
                    Util_1.logIt("Error writing to the code time summary content file: " + err.message);
                }
            });
            return [2 /*return*/];
        });
    });
}
exports.writeProjectCommitDashboard = writeProjectCommitDashboard;
function writeProjectContributorCommitDashboardFromGitLogs(identifier) {
    return __awaiter(this, void 0, void 0, function () {
        var activeRootPath, userTodaysChangeStatsP, userYesterdaysChangeStatsP, userWeeksChangeStatsP, contributorsTodaysChangeStatsP, contributorsYesterdaysChangeStatsP, contributorsWeeksChangeStatsP, dashboardContent, now, formattedDate, projectDate, summary, _a, startDate, _b, _c, file;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    activeRootPath = Util_1.findFirstActiveDirectoryOrWorkspaceDirectory();
                    userTodaysChangeStatsP = GitUtil_1.getTodaysCommits(activeRootPath);
                    userYesterdaysChangeStatsP = GitUtil_1.getYesterdaysCommits(activeRootPath);
                    userWeeksChangeStatsP = GitUtil_1.getThisWeeksCommits(activeRootPath);
                    contributorsTodaysChangeStatsP = GitUtil_1.getTodaysCommits(activeRootPath, false);
                    contributorsYesterdaysChangeStatsP = GitUtil_1.getYesterdaysCommits(activeRootPath, false);
                    contributorsWeeksChangeStatsP = GitUtil_1.getThisWeeksCommits(activeRootPath, false);
                    dashboardContent = "";
                    now = moment().unix();
                    formattedDate = moment.unix(now).format("ddd, MMM Do h:mma");
                    dashboardContent = Util_1.getTableHeader("PROJECT SUMMARY", " (Last updated on " + formattedDate + ")");
                    dashboardContent += "\n\n";
                    dashboardContent += "Project: " + identifier;
                    dashboardContent += "\n\n";
                    projectDate = moment.unix(now).format("MMM Do, YYYY");
                    dashboardContent += Util_1.getRightAlignedTableHeader("Today (" + projectDate + ")");
                    dashboardContent += Util_1.getColumnHeaders(["Metric", "You", "All Contributors"]);
                    _a = {};
                    return [4 /*yield*/, userTodaysChangeStatsP];
                case 1:
                    _a.activity = _d.sent();
                    return [4 /*yield*/, contributorsTodaysChangeStatsP];
                case 2:
                    summary = (_a.contributorActivity = _d.sent(),
                        _a);
                    dashboardContent += getRowNumberData(summary, "Commits", "commitCount");
                    // files changed
                    dashboardContent += getRowNumberData(summary, "Files changed", "fileCount");
                    // insertions
                    dashboardContent += getRowNumberData(summary, "Insertions", "insertions");
                    // deletions
                    dashboardContent += getRowNumberData(summary, "Deletions", "deletions");
                    dashboardContent += "\n";
                    // YESTERDAY
                    projectDate = moment.unix(now).format("MMM Do, YYYY");
                    startDate = moment
                        .unix(now)
                        .subtract(1, "day")
                        .startOf("day")
                        .format("MMM Do, YYYY");
                    dashboardContent += Util_1.getRightAlignedTableHeader("Yesterday (" + startDate + ")");
                    dashboardContent += Util_1.getColumnHeaders(["Metric", "You", "All Contributors"]);
                    _b = {};
                    return [4 /*yield*/, userYesterdaysChangeStatsP];
                case 3:
                    _b.activity = _d.sent();
                    return [4 /*yield*/, contributorsYesterdaysChangeStatsP];
                case 4:
                    summary = (_b.contributorActivity = _d.sent(),
                        _b);
                    dashboardContent += getRowNumberData(summary, "Commits", "commitCount");
                    // files changed
                    dashboardContent += getRowNumberData(summary, "Files changed", "fileCount");
                    // insertions
                    dashboardContent += getRowNumberData(summary, "Insertions", "insertions");
                    // deletions
                    dashboardContent += getRowNumberData(summary, "Deletions", "deletions");
                    dashboardContent += "\n";
                    // THIS WEEK
                    projectDate = moment.unix(now).format("MMM Do, YYYY");
                    startDate = moment.unix(now).startOf("week").format("MMM Do, YYYY");
                    dashboardContent += Util_1.getRightAlignedTableHeader("This week (" + startDate + " to " + projectDate + ")");
                    dashboardContent += Util_1.getColumnHeaders(["Metric", "You", "All Contributors"]);
                    _c = {};
                    return [4 /*yield*/, userWeeksChangeStatsP];
                case 5:
                    _c.activity = _d.sent();
                    return [4 /*yield*/, contributorsWeeksChangeStatsP];
                case 6:
                    summary = (_c.contributorActivity = _d.sent(),
                        _c);
                    dashboardContent += getRowNumberData(summary, "Commits", "commitCount");
                    // files changed
                    dashboardContent += getRowNumberData(summary, "Files changed", "fileCount");
                    // insertions
                    dashboardContent += getRowNumberData(summary, "Insertions", "insertions");
                    // deletions
                    dashboardContent += getRowNumberData(summary, "Deletions", "deletions");
                    dashboardContent += "\n";
                    file = Util_1.getProjectContributorCodeSummaryFile();
                    fs.writeFileSync(file, dashboardContent, function (err) {
                        if (err) {
                            Util_1.logIt("Error writing to the code time summary content file: " + err.message);
                        }
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports.writeProjectContributorCommitDashboardFromGitLogs = writeProjectContributorCommitDashboardFromGitLogs;
function writeProjectContributorCommitDashboard(identifier) {
    return __awaiter(this, void 0, void 0, function () {
        var qryStr, api, result, dashboardContent, data, now, formattedDate, i, summary, projectDate, startDate, startDate, file;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    qryStr = "?identifier=" + encodeURIComponent(identifier);
                    api = "/projects/contributorSummary" + qryStr;
                    return [4 /*yield*/, HttpClient_1.softwareGet(api, Util_1.getItem("jwt"))];
                case 1:
                    result = _a.sent();
                    dashboardContent = "";
                    // [{timestamp, activity, contributorActivity},...]
                    // the activity and contributorActivity will have the following structure
                    // [{projectId, name, identifier, commits, files_changed, insertions, deletions, hours,
                    //   keystrokes, characters_added, characters_deleted, lines_added, lines_removed},...]
                    if (HttpClient_1.isResponseOk(result)) {
                        data = result.data;
                        now = moment().unix();
                        formattedDate = moment.unix(now).format("ddd, MMM Do h:mma");
                        dashboardContent = Util_1.getTableHeader("PROJECT SUMMARY", " (Last updated on " + formattedDate + ")");
                        dashboardContent += "\n\n";
                        dashboardContent += "Project: " + identifier;
                        dashboardContent += "\n\n";
                        for (i = 0; i < data.length; i++) {
                            summary = data[i];
                            projectDate = moment.unix(now).format("MMM Do, YYYY");
                            if (i === 0) {
                                projectDate = "Today (" + projectDate + ")";
                            }
                            else if (i === 1) {
                                startDate = moment.unix(now).startOf("week").format("MMM Do, YYYY");
                                projectDate = "This week (" + startDate + " to " + projectDate + ")";
                            }
                            else {
                                startDate = moment
                                    .unix(now)
                                    .startOf("month")
                                    .format("MMM Do, YYYY");
                                projectDate = "This month (" + startDate + " to " + projectDate + ")";
                            }
                            dashboardContent += Util_1.getRightAlignedTableHeader(projectDate);
                            dashboardContent += Util_1.getColumnHeaders([
                                "Metric",
                                "You",
                                "All Contributors",
                            ]);
                            // show the metrics now
                            // const userHours = summary.activity.session_seconds
                            //     ? humanizeMinutes(summary.activity.session_seconds / 60)
                            //     : humanizeMinutes(0);
                            // const contribHours = summary.contributorActivity.session_seconds
                            //     ? humanizeMinutes(
                            //           summary.contributorActivity.session_seconds / 60
                            //       )
                            //     : humanizeMinutes(0);
                            // dashboardContent += getRowLabels([
                            //     "Code time",
                            //     userHours,
                            //     contribHours
                            // ]);
                            // commits
                            dashboardContent += getRowNumberData(summary, "Commits", "commits");
                            // files changed
                            dashboardContent += getRowNumberData(summary, "Files changed", "files_changed");
                            // insertions
                            dashboardContent += getRowNumberData(summary, "Insertions", "insertions");
                            // deletions
                            dashboardContent += getRowNumberData(summary, "Deletions", "deletions");
                            dashboardContent += "\n";
                        }
                        dashboardContent += "\n";
                    }
                    file = Util_1.getProjectContributorCodeSummaryFile();
                    fs.writeFileSync(file, dashboardContent, function (err) {
                        if (err) {
                            Util_1.logIt("Error writing to the code time summary content file: " + err.message);
                        }
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports.writeProjectContributorCommitDashboard = writeProjectContributorCommitDashboard;
function getRowNumberData(summary, title, attribute) {
    // files changed
    var userFilesChanged = summary.activity[attribute]
        ? Util_1.formatNumber(summary.activity[attribute])
        : Util_1.formatNumber(0);
    var contribFilesChanged = summary.contributorActivity[attribute]
        ? Util_1.formatNumber(summary.contributorActivity[attribute])
        : Util_1.formatNumber(0);
    return Util_1.getRowLabels([title, userFilesChanged, contribFilesChanged]);
}
// start and end should be local_start and local_end
function createStartEndRangeByTimestamps(start, end) {
    return {
        rangeStart: moment.unix(start).utc().format("MMM Do, YYYY"),
        rangeEnd: moment.unix(end).utc().format("MMM Do, YYYY")
    };
}
function createStartEndRangeByType(type) {
    if (type === void 0) { type = "lastWeek"; }
    // default to "lastWeek"
    var startOf = moment().startOf("week").subtract(1, "week");
    var endOf = moment().startOf("week").subtract(1, "week").endOf("week");
    if (type === "yesterday") {
        startOf = moment().subtract(1, "day").startOf("day");
        endOf = moment().subtract(1, "day").endOf("day");
    }
    else if (type === "currentWeek") {
        startOf = moment().startOf("week");
        endOf = moment();
    }
    else if (type === "lastMonth") {
        startOf = moment().subtract(1, "month").startOf("month");
        endOf = moment().subtract(1, "month").endOf("month");
    }
    return {
        rangeStart: startOf.format("MMM Do, YYYY"),
        rangeEnd: endOf.format("MMM Do, YYYY")
    };
}
function writeCodeTimeMetricsDashboard() {
    return __awaiter(this, void 0, void 0, function () {
        var summaryInfoFile, serverIsOnline, showGitMetrics, api, result, content, dashboardContent, formattedDate, todayStr, codeTimeSummary, sessionSummary, averageTimeStr, codeTimeToday, activeCodeTimeToday, liveshareTimeStr, summaryContent, dashboardFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    summaryInfoFile = Util_1.getSummaryInfoFile();
                    return [4 /*yield*/, HttpClient_1.serverIsAvailable()];
                case 1:
                    serverIsOnline = _a.sent();
                    if (!serverIsOnline) return [3 /*break*/, 3];
                    showGitMetrics = vscode_1.workspace.getConfiguration().get("showGitMetrics");
                    api = "/dashboard?showMusic=false&showGit=" + showGitMetrics + "&showRank=false&linux=" + Util_1.isLinux() + "&showToday=false";
                    return [4 /*yield*/, HttpClient_1.softwareGet(api, Util_1.getItem("jwt"))];
                case 2:
                    result = _a.sent();
                    if (HttpClient_1.isResponseOk(result)) {
                        content = result.data;
                        console.log("Write Code Time Metrics");
                        console.log(content);
                        fs.writeFileSync(summaryInfoFile, content, function (err) {
                            if (err) {
                                Util_1.logIt("Error writing to the code time summary content file: " + err.message);
                            }
                        });
                    }
                    _a.label = 3;
                case 3:
                    dashboardContent = "";
                    formattedDate = moment().format("ddd, MMM Do h:mma");
                    dashboardContent = "CODE TIME          (Last updated on " + formattedDate + ")";
                    dashboardContent += "\n\n";
                    todayStr = moment().format("ddd, MMM Do");
                    dashboardContent += Util_1.getSectionHeader("Today (" + todayStr + ")");
                    codeTimeSummary = TimeSummaryData_1.getCodeTimeSummary();
                    sessionSummary = SessionSummaryData_1.getSessionSummaryData();
                    if (sessionSummary) {
                        averageTimeStr = Util_1.humanizeMinutes(sessionSummary.averageDailyMinutes);
                        codeTimeToday = Util_1.humanizeMinutes(codeTimeSummary.codeTimeMinutes);
                        activeCodeTimeToday = Util_1.humanizeMinutes(codeTimeSummary.activeCodeTimeMinutes);
                        liveshareTimeStr = null;
                        if (sessionSummary.liveshareMinutes) {
                            liveshareTimeStr = Util_1.humanizeMinutes(sessionSummary.liveshareMinutes);
                        }
                        dashboardContent += Util_1.getDashboardRow("Code time today", codeTimeToday);
                        dashboardContent += Util_1.getDashboardRow("Active code time today", activeCodeTimeToday);
                        dashboardContent += Util_1.getDashboardRow("90-day avg", averageTimeStr);
                        if (liveshareTimeStr) {
                            dashboardContent += Util_1.getDashboardRow("Live Share", liveshareTimeStr);
                        }
                        dashboardContent += "\n";
                    }
                    // get the summary info we just made a call for and add it to the dashboard content
                    if (fs.existsSync(summaryInfoFile)) {
                        summaryContent = fs.readFileSync(summaryInfoFile).toString();
                        // create the dashboard file
                        dashboardContent += summaryContent;
                    }
                    dashboardFile = Util_1.getDashboardFile();
                    fs.writeFileSync(dashboardFile, dashboardContent, function (err) {
                        if (err) {
                            Util_1.logIt("Error writing to the code time dashboard content file: " + err.message);
                        }
                    });
                    return [2 /*return*/];
            }
        });
    });
}
exports.writeCodeTimeMetricsDashboard = writeCodeTimeMetricsDashboard;
