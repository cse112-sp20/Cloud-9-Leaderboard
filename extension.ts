// Copyright (c) 2018 Software. All Rights Reserved.

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {
  window,
  ExtensionContext,
  StatusBarAlignment,
  commands,
  Command,
  TreeDataProvider,
  TreeItemCollapsibleState,
  ProviderResult,
  TreeItem,
  Event,
  EventEmitter,
  TreeView,
  Disposable,
} from 'vscode';
import {retrieveUserDailyMetric} from './src/util/Firestore';
import {
  isLoggedIn,
  sendHeartbeat,
  initializePreferences,
} from './lib/DataController';
import {onboardInit} from './lib/user/OnboardManager';
import {
  showStatus,
  nowInSecs,
  getOffsetSeconds,
  getVersion,
  logIt,
  getPluginName,
  getItem,
  displayReadmeIfNotExists,
  setItem,
  getWorkspaceName,
} from './lib/Util';
import {serverIsAvailable} from './lib/http/HttpClient';
import {getHistoricalCommits} from './lib/repo/KpmRepoManager';
import {manageLiveshareSession} from './lib/LiveshareManager';
import * as vsls from 'vsls/vscode';
import {createCommands} from './lib/command-helper';
import {KpmManager} from './lib/managers/KpmManager';
import {SummaryManager} from './lib/managers/SummaryManager';
import {
  setSessionSummaryLiveshareMinutes,
  updateStatusBarWithSummaryData,
} from './lib/storage/SessionSummaryData';
import {WallClockManager} from './lib/managers/WallClockManager';
import {EventManager} from './lib/managers/EventManager';
import {
  sendOfflineEvents,
  getLastSavedKeystrokesStats,
} from './lib/managers/FileManager';

import {
  storeExtensionContext,
  authenticateUser,
} from './src/util/Authentication';

let TELEMETRY_ON = true;
let statusBarItem = null;
let _ls = null;

let fifteen_minute_interval = null;
let twenty_minute_interval = null;
let thirty_minute_interval = null;
let hourly_interval = null;
let liveshare_update_interval = null;

const one_min_millis = 1000 * 60;
const thirty_min_millis = one_min_millis * 30;
const one_hour_millis = one_min_millis * 60;

//
// Add the keystroke controller to the ext ctx, which
// will then listen for text document changes.
//
const kpmController: KpmManager = KpmManager.getInstance();

export function isTelemetryOn() {
  return TELEMETRY_ON;
}

export function getStatusBarItem() {
  return statusBarItem;
}

export function deactivate(ctx: ExtensionContext) {
  // store the deactivate event
  EventManager.getInstance().createCodeTimeEvent(
    'resource',
    'unload',
    'EditorDeactivate',
  );

  if (_ls && _ls.id) {
    // the IDE is closing, send this off
    let nowSec = nowInSecs();
    let offsetSec = getOffsetSeconds();
    let localNow = nowSec - offsetSec;
    // close the session on our end
    _ls['end'] = nowSec;
    _ls['local_end'] = localNow;
    manageLiveshareSession(_ls);
    _ls = null;
  }

  // dispose the new day timer
  SummaryManager.getInstance().dispose();

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

//export var extensionContext;

export async function activate(ctx: ExtensionContext) {
  window.showInformationMessage('Cloud9 Activated!');
  console.log('Cloud9 activated');
  //store ref to extension context
  storeExtensionContext(ctx);

  // add the code time commands
  ctx.subscriptions.push(createCommands(kpmController));

  const workspace_name = getWorkspaceName();

  const eventName = `onboard-${workspace_name}`;

  // onboard the user as anonymous if it's being installed
  if (window.state.focused) {
    EventManager.getInstance().createCodeTimeEvent(
      'focused_onboard',
      eventName,
      'onboarding',
    );
    onboardInit(ctx, intializePlugin /*successFunction*/);
  } else {
    // 10 to 15 second delay
    const secondDelay = getRandomArbitrary(10, 15);
    const nonFocusedEventType = `nonfocused_onboard-${secondDelay}`;
    // initialize in 5 seconds if this is the secondary window
    setTimeout(() => {
      EventManager.getInstance().createCodeTimeEvent(
        nonFocusedEventType,
        eventName,
        'onboarding',
      );
      onboardInit(ctx, intializePlugin /*successFunction*/);
    }, 1000 * secondDelay);
  }

  console.log('BEfore calling authenticateUser');

  // sign the user in

  authenticateUser();
  //await retrieveUserDailyMetric(testCallback, ctx);
}

function getRandomArbitrary(min, max) {
  max = max + 0.1;
  return parseInt(Math.random() * (max - min) + min, 10);
}

export async function intializePlugin(
  ctx: ExtensionContext,
  createdAnonUser: boolean,
) {
  logIt(`Loaded ${getPluginName()} v${getVersion()}`);

  // store the activate event
  EventManager.getInstance().createCodeTimeEvent(
    'resource',
    'load',
    'EditorActivate',
  );

  // initialize the wall clock timer
  WallClockManager.getInstance();

  // load the last payload into memory
  getLastSavedKeystrokesStats();

  const serverIsOnline = await serverIsAvailable();

  // get the user preferences whether it's music time or code time
  // this will also fetch the user and update loggedInCacheState if it's found
  await initializePreferences(serverIsOnline);

  // add the interval jobs
  initializeIntervalJobs();




  


  const initializedVscodePlugin = getItem('vscode_CtInit');
  if (!initializedVscodePlugin) {
    setItem('vscode_CtInit', true);

    // send a bootstrap kpm payload
    kpmController.buildBootstrapKpmPayload();

    // send a heartbeat that the plugin as been installed
    // (or the user has deleted the session.json and restarted the IDE)
    sendHeartbeat('INSTALLED', serverIsOnline);

  }

  // initialize the day check timer
  SummaryManager.getInstance().updateSessionSummaryFromServer();



}

// add the interval jobs
function initializeIntervalJobs() {
  hourly_interval = setInterval(async () => {
    const isonline = await serverIsAvailable();
    sendHeartbeat('HOURLY', isonline);
  }, one_hour_millis);

  thirty_minute_interval = setInterval(async () => {
    const isonline = await serverIsAvailable();
    await getHistoricalCommits(isonline);
  }, thirty_min_millis);





}

