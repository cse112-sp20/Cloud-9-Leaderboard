import {workspace, ConfigurationTarget} from "vscode";

import {
  softwareGet,
  softwarePut,
  isResponseOk,
  softwarePost,
  serverIsAvailable,
} from "./http/HttpClient";
import {
  getItem,
  setItem,
  nowInSecs,
  getSessionFileCreateTime,
  getOs,
  getVersion,
  getHostname,
  getWorkspaceName,
  logIt,
  getPluginId,
} from "./Util";
import {DEFAULT_SESSION_THRESHOLD_SECONDS} from "./Constants";


let toggleFileEventLogging = null;


export function getToggleFileEventLoggingState() {
  if (toggleFileEventLogging === null) {
    toggleFileEventLogging = workspace
      .getConfiguration()
      .get("toggleFileEventLogging");
  }
  return toggleFileEventLogging;
}


/**
 * get the app jwt
 */
export async function getAppJwt(serverIsOnline) {
  if (serverIsOnline) {
    // get the app jwt
    let resp = await softwareGet(`/data/apptoken?token=${nowInSecs()}`, null);
    if (isResponseOk(resp)) {
      return resp.data.jwt;
    }
  }
  return null;
}


export async function getUser(serverIsOnline, jwt) {
  if (jwt && serverIsOnline) {
    let api = `/users/me`;
    let resp = await softwareGet(api, jwt);
    if (isResponseOk(resp)) {
      if (resp && resp.data && resp.data.data) {
        const user = resp.data.data;
        if (user.registered === 1) {
          // update jwt to what the jwt is for this spotify user
          setItem("name", user.email);
        }
        return user;
      }
    }
  }
  return null;
}

export async function initializePreferences(serverIsOnline) {
  let jwt = getItem("jwt");
  // use a default if we're unable to get the user or preferences
  let sessionThresholdInSec = DEFAULT_SESSION_THRESHOLD_SECONDS;

  if (jwt && serverIsOnline) {
    let user = await getUser(serverIsOnline, jwt);
    if (user && user.preferences) {
      // obtain the session threshold in seconds "sessionThresholdInSec"
      sessionThresholdInSec =
        user.preferences.sessionThresholdInSec ||
        DEFAULT_SESSION_THRESHOLD_SECONDS;

      let userId = parseInt(user.id, 10);
      let prefs = user.preferences;
      let prefsShowGit =
        prefs.showGit !== null && prefs.showGit !== undefined
          ? prefs.showGit
          : null;
      let prefsShowRank =
        prefs.showRank !== null && prefs.showRank !== undefined
          ? prefs.showRank
          : null;

      if (prefsShowGit === null || prefsShowRank === null) {
        await sendPreferencesUpdate(userId, prefs);
      } else {
        if (prefsShowGit !== null) {
          await workspace
            .getConfiguration()
            .update("showGitMetrics", prefsShowGit, ConfigurationTarget.Global);
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
  setItem("sessionThresholdInSec", sessionThresholdInSec);
}

async function sendPreferencesUpdate(userId, userPrefs) {
  let api = `/users/${userId}`;

  let showGitMetrics = workspace.getConfiguration().get("showGitMetrics");
  // let showWeeklyRanking = workspace
  //     .getConfiguration()
  //     .get("showWeeklyRanking");
  userPrefs["showGit"] = showGitMetrics;
  // userPrefs["showRank"] = showWeeklyRanking;

  // update the preferences
  // /:id/preferences
  api = `/users/${userId}/preferences`;
  let resp = await softwarePut(api, userPrefs, getItem("jwt"));
  if (isResponseOk(resp)) {
    logIt("update user code time preferences");
  }
}

export async function updatePreferences() {
  toggleFileEventLogging = workspace
    .getConfiguration()
    .get("toggleFileEventLogging");

  let showGitMetrics = workspace.getConfiguration().get("showGitMetrics");
  // let showWeeklyRanking = workspace
  //     .getConfiguration()
  //     .get("showWeeklyRanking");

  // get the user's preferences and update them if they don't match what we have
  let jwt = getItem("jwt");
  let serverIsOnline = await serverIsAvailable();
  if (jwt && serverIsOnline) {
    let user = await getUser(serverIsOnline, jwt);
    if (!user) {
      return;
    }
    let api = `/users/${user.id}`;
    let resp = await softwareGet(api, jwt);
    if (isResponseOk(resp)) {
      if (resp && resp.data && resp.data.data && resp.data.data.preferences) {
        let prefs = resp.data.data.preferences;
        let prefsShowGit =
          prefs.showGit !== null && prefs.showGit !== undefined
            ? prefs.showGit
            : null;
        let prefsShowRank =
          prefs.showRank !== null && prefs.showRank !== undefined
            ? prefs.showRank
            : null;

        if (prefsShowGit === null || prefsShowGit !== showGitMetrics) {
          await sendPreferencesUpdate(parseInt(user.id, 10), prefs);
        }
      }
    }
  }
}




export async function sendHeartbeat(reason, serverIsOnline) {
  let jwt = getItem("jwt");
  if (serverIsOnline && jwt) {
    let heartbeat = {
      pluginId: getPluginId(),
      os: getOs(),
      start: nowInSecs(),
      version: getVersion(),
      hostname: await getHostname(),
      session_ctime: getSessionFileCreateTime(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      trigger_annotation: reason,
      editor_token: getWorkspaceName(),
    };
    let api = `/data/heartbeat`;
    softwarePost(api, heartbeat, jwt).then(async (resp) => {
      if (!isResponseOk(resp)) {
        logIt("unable to send heartbeat ping");
      }
    });
  }
}


