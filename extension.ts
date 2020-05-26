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

import {authenticateUser} from './src/util/Authentication';

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
  // window.registerTreeDataProvider('exampleView', new TaskProvider());

  //console.log("CLOUD9 ACTIVATED");
  window.showInformationMessage('Cloud9 Activated!');
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

  // sign the user in
  authenticateUser(ctx);
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

  // in 30 seconds
  setTimeout(() => {
    commands.executeCommand('codetime.sendOfflineData');
  }, 1000 * 30);

  // in 2 minutes task
  setTimeout(() => {
    getHistoricalCommits(serverIsOnline);
  }, one_min_millis * 2);

  // in 4 minutes task
  setTimeout(() => {
    sendOfflineEvents();
  }, one_min_millis * 3);

  initializeLiveshare();

  // get the login status
  // {loggedIn: true|false}
  await isLoggedIn();

  const initializedVscodePlugin = getItem('vscode_CtInit');
  if (!initializedVscodePlugin) {
    setItem('vscode_CtInit', true);

    // send a bootstrap kpm payload
    kpmController.buildBootstrapKpmPayload();

    // send a heartbeat that the plugin as been installed
    // (or the user has deleted the session.json and restarted the IDE)
    sendHeartbeat('INSTALLED', serverIsOnline);

    setTimeout(() => {
      commands.executeCommand('codetime.displayTree');
    }, 1200);
  }

  // initialize the day check timer
  SummaryManager.getInstance().updateSessionSummaryFromServer();

  // show the readme if it doesn't exist
  displayReadmeIfNotExists();

  // show the status bar text info
  setTimeout(() => {
    statusBarItem = window.createStatusBarItem(StatusBarAlignment.Right, 10);
    // add the name to the tooltip if we have it
    const name = getItem('name');
    let tooltip = 'Click to see more from Code Time';
    if (name) {
      tooltip = `${tooltip} (${name})`;
    }
    statusBarItem.tooltip = tooltip;
    // statusBarItem.command = "codetime.softwarePaletteMenu";
    statusBarItem.command = 'codetime.displayTree';
    statusBarItem.show();

    // update the status bar
    updateStatusBarWithSummaryData();
  }, 0);
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

  twenty_minute_interval = setInterval(async () => {
    await sendOfflineEvents();
    // this will get the login status if the window is focused
    // and they're currently not a logged in
    if (window.state.focused) {
      const name = getItem('name');
      // but only if checkStatus is true
      if (!name) {
        isLoggedIn();
      }
    }
  }, one_min_millis * 20);

  // every 15 minute tasks
  fifteen_minute_interval = setInterval(async () => {
    commands.executeCommand('codetime.sendOfflineData');
  }, one_min_millis * 15);

  // update liveshare in the offline kpm data if it has been initiated
  liveshare_update_interval = setInterval(async () => {
    if (window.state.focused) {
      updateLiveshareTime();
    }
  }, one_min_millis);
}

function handlePauseMetricsEvent() {
  TELEMETRY_ON = false;
  showStatus('Code Time Paused', 'Enable metrics to resume');
}

function handleEnableMetricsEvent() {
  TELEMETRY_ON = true;
  showStatus('Code Time', null);
}

function updateLiveshareTime() {
  if (_ls) {
    let nowSec = nowInSecs();
    let diffSeconds = nowSec - parseInt(_ls['start'], 10);
    setSessionSummaryLiveshareMinutes(diffSeconds * 60);
  }
}

async function initializeLiveshare() {
  const liveshare = await vsls.getApi();
  if (liveshare) {
    // {access: number, id: string, peerNumber: number, role: number, user: json}
    logIt(`liveshare version - ${liveshare['apiVersion']}`);
    liveshare.onDidChangeSession(async (event) => {
      let nowSec = nowInSecs();
      let offsetSec = getOffsetSeconds();
      let localNow = nowSec - offsetSec;
      if (!_ls) {
        _ls = {
          ...event.session,
        };
        _ls['apiVesion'] = liveshare['apiVersion'];
        _ls['start'] = nowSec;
        _ls['local_start'] = localNow;
        _ls['end'] = 0;

        await manageLiveshareSession(_ls);
      } else if (_ls && (!event || !event['id'])) {
        updateLiveshareTime();
        // close the session on our end
        _ls['end'] = nowSec;
        _ls['local_end'] = localNow;
        await manageLiveshareSession(_ls);
        _ls = null;
      }
    });
  }
}

export class TaskProvider implements TreeDataProvider<TreeTask> {
  onDidChangeTreeData?: Event<TreeTask | null | undefined> | undefined;

  data: TreeTask[];
  constructor(d) {
    console.log(d);

    this.data = [];

    let tempList = [];
    for (let key in d) {
      tempList.push(new TreeTask(key, [new TreeTask(d[key] + '')]));
    }

    this.data = [new TreeTask('DAILY METRICS', tempList)];
  }

  getChildren(task?: TreeTask | undefined): ProviderResult<TreeTask[]> {
    if (task === undefined) {
      return this.data;
    }
    return task.children;
  }

  getTreeItem(task: TreeTask): TreeItem | Thenable<TreeItem> {
    return task;
  }
}
class TreeTask extends TreeItem {
  children: TreeTask[] | undefined;

  constructor(label: string, children?: TreeTask[]) {
    super(
      label,
      children === undefined
        ? TreeItemCollapsibleState.None
        : TreeItemCollapsibleState.Expanded,
    );
    this.children = children;
  }
}

export function testCallback(data, ctx) {
  window.registerTreeDataProvider('exampleView', new TaskProvider(data));
}






export class MenuProvider implements TreeDataProvider<MenuTask> {
  onDidChangeTreeData?: Event<MenuTask | null | undefined> | undefined;

  private view: TreeView<MenuTask>;
  data: MenuTask[];
  constructor() {
    this.data = [new MenuTask('Join team')];
  }

  bindView(menuTreeView: TreeView<MenuTask>): void {
    this.view = menuTreeView;
}




  getChildren(task?: MenuTask | undefined): ProviderResult<MenuTask[]> {
    if (task === undefined) {
      return this.data;
    }
    return task.children;
  }

  getTreeItem(task: MenuTask): TreeItem | Thenable<TreeItem> {
    return task;
  }
}

export class MenuTask extends TreeItem {
  children: MenuTask[] | undefined;

  constructor(label: string, children?: MenuTask[]) {
    super(
      label,
      children === undefined
        ? TreeItemCollapsibleState.None
        : TreeItemCollapsibleState.Expanded,
    );
    this.children = children;
  }
}


export const connectCloud9MenuTreeView = (view: TreeView<MenuTask>) => {
  return Disposable.from(

      view.onDidChangeSelection(async e => {
          if (!e.selection || e.selection.length === 0) {
              return;
          }

          const item: MenuTask = e.selection[0];

          handleMenuChangeSelection(view, item);
      })

  );
};

export const handleMenuChangeSelection = (
  view: TreeView<MenuTask>,
  item: MenuTask
) => {

  console.log('ethan');
  commands.executeCommand('cloud9.joinTeam');


  
};