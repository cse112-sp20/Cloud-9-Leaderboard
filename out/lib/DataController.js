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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendHeartbeat = exports.updatePreferences = exports.initializePreferences = exports.getUser = exports.getAppJwt = exports.getToggleFileEventLoggingState = void 0;
const vscode_1 = require("vscode");
const HttpClient_1 = require("./http/HttpClient");
const Util_1 = require("./Util");
const Constants_1 = require("./Constants");
let toggleFileEventLogging = null;
function getToggleFileEventLoggingState() {
    if (toggleFileEventLogging === null) {
        toggleFileEventLogging = vscode_1.workspace
            .getConfiguration()
            .get("toggleFileEventLogging");
    }
    return toggleFileEventLogging;
}
exports.getToggleFileEventLoggingState = getToggleFileEventLoggingState;
/**
 * get the app jwt
 */
function getAppJwt(serverIsOnline) {
    return __awaiter(this, void 0, void 0, function* () {
        if (serverIsOnline) {
            // get the app jwt
            let resp = yield HttpClient_1.softwareGet(`/data/apptoken?token=${Util_1.nowInSecs()}`, null);
            if (HttpClient_1.isResponseOk(resp)) {
                return resp.data.jwt;
            }
        }
        return null;
    });
}
exports.getAppJwt = getAppJwt;
function getUser(serverIsOnline, jwt) {
    return __awaiter(this, void 0, void 0, function* () {
        if (jwt && serverIsOnline) {
            let api = `/users/me`;
            let resp = yield HttpClient_1.softwareGet(api, jwt);
            if (HttpClient_1.isResponseOk(resp)) {
                if (resp && resp.data && resp.data.data) {
                    const user = resp.data.data;
                    if (user.registered === 1) {
                        // update jwt to what the jwt is for this spotify user
                        Util_1.setItem("name", user.email);
                    }
                    return user;
                }
            }
        }
        return null;
    });
}
exports.getUser = getUser;
function initializePreferences(serverIsOnline) {
    return __awaiter(this, void 0, void 0, function* () {
        let jwt = Util_1.getItem("jwt");
        // use a default if we're unable to get the user or preferences
        let sessionThresholdInSec = Constants_1.DEFAULT_SESSION_THRESHOLD_SECONDS;
        if (jwt && serverIsOnline) {
            let user = yield getUser(serverIsOnline, jwt);
            if (user && user.preferences) {
                // obtain the session threshold in seconds "sessionThresholdInSec"
                sessionThresholdInSec =
                    user.preferences.sessionThresholdInSec ||
                        Constants_1.DEFAULT_SESSION_THRESHOLD_SECONDS;
                let userId = parseInt(user.id, 10);
                let prefs = user.preferences;
                let prefsShowGit = prefs.showGit !== null && prefs.showGit !== undefined
                    ? prefs.showGit
                    : null;
                let prefsShowRank = prefs.showRank !== null && prefs.showRank !== undefined
                    ? prefs.showRank
                    : null;
                if (prefsShowGit === null || prefsShowRank === null) {
                    yield sendPreferencesUpdate(userId, prefs);
                }
                else {
                    if (prefsShowGit !== null) {
                        yield vscode_1.workspace
                            .getConfiguration()
                            .update("showGitMetrics", prefsShowGit, vscode_1.ConfigurationTarget.Global);
                    }
                    if (prefsShowRank !== null) {
                        // await workspace
                        //     .getConfiguration()
                        //     .update(
                        //         "showWeeklyRanking",
                        //         prefsShowRank,
                        //         ConfigurationTarget.Global
                        //     );
                    }
                }
            }
        }
        // update the session threshold in seconds config
        Util_1.setItem("sessionThresholdInSec", sessionThresholdInSec);
    });
}
exports.initializePreferences = initializePreferences;
function sendPreferencesUpdate(userId, userPrefs) {
    return __awaiter(this, void 0, void 0, function* () {
        let api = `/users/${userId}`;
        let showGitMetrics = vscode_1.workspace.getConfiguration().get("showGitMetrics");
        // let showWeeklyRanking = workspace
        //     .getConfiguration()
        //     .get("showWeeklyRanking");
        userPrefs["showGit"] = showGitMetrics;
        // userPrefs["showRank"] = showWeeklyRanking;
        // update the preferences
        // /:id/preferences
        api = `/users/${userId}/preferences`;
        let resp = yield HttpClient_1.softwarePut(api, userPrefs, Util_1.getItem("jwt"));
        if (HttpClient_1.isResponseOk(resp)) {
        }
    });
}
function updatePreferences() {
    return __awaiter(this, void 0, void 0, function* () {
        toggleFileEventLogging = vscode_1.workspace
            .getConfiguration()
            .get("toggleFileEventLogging");
        let showGitMetrics = vscode_1.workspace.getConfiguration().get("showGitMetrics");
        // let showWeeklyRanking = workspace
        //     .getConfiguration()
        //     .get("showWeeklyRanking");
        // get the user's preferences and update them if they don't match what we have
        let jwt = Util_1.getItem("jwt");
        let serverIsOnline = yield HttpClient_1.serverIsAvailable();
        if (jwt && serverIsOnline) {
            let user = yield getUser(serverIsOnline, jwt);
            if (!user) {
                return;
            }
            let api = `/users/${user.id}`;
            let resp = yield HttpClient_1.softwareGet(api, jwt);
            if (HttpClient_1.isResponseOk(resp)) {
                if (resp && resp.data && resp.data.data && resp.data.data.preferences) {
                    let prefs = resp.data.data.preferences;
                    let prefsShowGit = prefs.showGit !== null && prefs.showGit !== undefined
                        ? prefs.showGit
                        : null;
                    let prefsShowRank = prefs.showRank !== null && prefs.showRank !== undefined
                        ? prefs.showRank
                        : null;
                    if (prefsShowGit === null || prefsShowGit !== showGitMetrics) {
                        yield sendPreferencesUpdate(parseInt(user.id, 10), prefs);
                    }
                }
            }
        }
    });
}
exports.updatePreferences = updatePreferences;
function sendHeartbeat(reason, serverIsOnline) {
    return __awaiter(this, void 0, void 0, function* () {
        let jwt = Util_1.getItem("jwt");
        if (serverIsOnline && jwt) {
            let heartbeat = {
                pluginId: Util_1.getPluginId(),
                os: Util_1.getOs(),
                start: Util_1.nowInSecs(),
                version: Util_1.getVersion(),
                hostname: yield Util_1.getHostname(),
                session_ctime: Util_1.getSessionFileCreateTime(),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                trigger_annotation: reason,
                editor_token: Util_1.getWorkspaceName(),
            };
            let api = `/data/heartbeat`;
            HttpClient_1.softwarePost(api, heartbeat, jwt).then((resp) => __awaiter(this, void 0, void 0, function* () {
                if (!HttpClient_1.isResponseOk(resp)) {
                }
            }));
        }
    });
}
exports.sendHeartbeat = sendHeartbeat;
//# sourceMappingURL=DataController.js.map