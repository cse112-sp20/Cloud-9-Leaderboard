import {workspace, Disposable, window} from "vscode";
import KeystrokeStats from "../model/KeystrokeStats";
import {UNTITLED, NO_PROJ_NAME, DEFAULT_DURATION_MILLIS} from "../Constants";
import {
  getRootPathForFile,
  isEmptyObj,
  getNowTimes,
  getFileAgeInDays,
  getFileType,
} from "../Util";
import {FileChangeInfo} from "../model/models";
import {storeCurrentPayload} from "./FileManager";
import Project from "../model/Project";

let _keystrokeMap = {};
let _staticInfoMap = {};

export class KpmManager {
  private static instance: KpmManager;

  private _disposable: Disposable;

  private _currentPayloadTimeout;

  constructor() {
    let subscriptions: Disposable[] = [];

    // document listener handlers
    workspace.onDidOpenTextDocument(this._onOpenHandler, this);
    workspace.onDidCloseTextDocument(this._onCloseHandler, this);
    workspace.onDidChangeTextDocument(this._onEventHandler, this);

    this._disposable = Disposable.from(...subscriptions);
  }

  static getInstance(): KpmManager {
    if (!KpmManager.instance) {
      KpmManager.instance = new KpmManager();
    }

    return KpmManager.instance;
  }

  public hasKeystrokeData() {
    return _keystrokeMap &&
      !isEmptyObj(_keystrokeMap) &&
      Object.keys(_keystrokeMap).length
      ? true
      : false;
  }

  public async sendKeystrokeDataIntervalHandler() {
    //
    // Go through all keystroke count objects found in the map and send
    // the ones that have data (data is greater than 1), then clear the map
    //
    if (this.hasKeystrokeData()) {
      let keys = Object.keys(_keystrokeMap);
      // use a normal for loop since we have an await within the loop
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const keystrokeStats = _keystrokeMap[key];

        const hasData = keystrokeStats.hasData();

        if (hasData) {
          // post the payload offline until the batch interval sends it out
          setTimeout(() => keystrokeStats.postData(), 0);
        }
      }
    }

    // clear out the keystroke map
    _keystrokeMap = {};

    // clear out the static info map
    _staticInfoMap = {};
  }

  /**
   * File Close Handler
   * @param event
   */
  private async _onCloseHandler(event) {
    if (!event || !window.state.focused) {
      return;
    }
    const filename = this.getFileName(event);
    if (!this.isTrueEventFile(event, filename)) {
      return;
    }
    const staticInfo = await this.getStaticEventInfo(event, filename);

    let rootPath = getRootPathForFile(staticInfo.filename);

    if (!rootPath) {
      rootPath = NO_PROJ_NAME;
    }

    await this.initializeKeystrokesCount(staticInfo.filename, rootPath);

    const rootObj = _keystrokeMap[rootPath];
    this.updateStaticValues(rootObj, staticInfo);

    rootObj.source[staticInfo.filename].close += 1;
  }

  /**
   * File Open Handler
   * @param event
   */
  private async _onOpenHandler(event) {
    if (!event || !window.state.focused) {
      return;
    }

    const filename = this.getFileName(event);
    if (!this.isTrueEventFile(event, filename)) {
      return;
    }
    const staticInfo = await this.getStaticEventInfo(event, filename);

    let rootPath = getRootPathForFile(staticInfo.filename);

    if (!rootPath) {
      rootPath = NO_PROJ_NAME;
    }

    await this.initializeKeystrokesCount(staticInfo.filename, rootPath);

    // make sure other files end's are set
    this.endPreviousModifiedFiles(staticInfo.filename, rootPath);

    const rootObj = _keystrokeMap[rootPath];
    this.updateStaticValues(rootObj, staticInfo);

    rootObj.source[staticInfo.filename].open += 1;
  }

  /**
   * File Change Event Handler
   * @param event
   */
  private async _onEventHandler(event) {
    if (!event || !window.state.focused) {
      return;
    }

    const filename = this.getFileName(event);

    // console.log("Event triggered (KpmManager)");
    // console.log(event);

    if (!this.isTrueEventFile(event, filename)) {
      return;
    }
    const staticInfo = await this.getStaticEventInfo(event, filename);

    let rootPath = getRootPathForFile(filename);

    if (!rootPath) {
      rootPath = NO_PROJ_NAME;
    }

    await this.initializeKeystrokesCount(filename, rootPath);

    if (!_keystrokeMap[rootPath].source[filename]) {
      // it's undefined, it wasn't created
      return;
    }

    const rootObj = _keystrokeMap[rootPath];
    const sourceObj: FileChangeInfo = rootObj.source[staticInfo.filename];
    const currLineCount =
      event.document && event.document.lineCount
        ? event.document.lineCount
        : event.lineCount || 0;
    this.updateStaticValues(rootObj, staticInfo);

    // Use the contentChanges to figure out most of the events
    let linesAdded = 0;
    let linesDeleted = 0;
    let hasNonNewLineData = false;
    let textChangeLen = 0;
    let rangeChangeLen = 0;
    let contentText = "";
    let isCharDelete = false;
    if (event.contentChanges && event.contentChanges.length) {
      for (let i = 0; i < event.contentChanges.length; i++) {
        const range = event.contentChanges[i].range;
        rangeChangeLen += event.contentChanges[i].rangeLength || 0;
        contentText = event.contentChanges[i].text;
        const newLineMatches = contentText.match(/[\n\r]/g);
        if (newLineMatches && newLineMatches.length) {
          // it's a new line
          linesAdded = newLineMatches.length;
          if (contentText) {
            textChangeLen += contentText.length;
          }
          contentText = "";
        } else if (contentText.length > 0) {
          // has text changes
          hasNonNewLineData = true;
          textChangeLen += contentText.length;
        } else if (range && !range.isEmpty && !range.isSingleLine) {
          if (range.start && range.start.line && range.end && range.end.line) {
            linesDeleted = Math.abs(range.start.line - range.end.line);
          } else {
            linesDeleted = 1;
          }
        } else if (rangeChangeLen && rangeChangeLen > 0 && contentText === "") {
          isCharDelete = true;
        }
      }
    }

    // check if its a character deletion
    if (textChangeLen === 0 && rangeChangeLen > 0) {
      // since new count is zero, check the range length.
      // if there's range length then it's a deletion
      textChangeLen = event.contentChanges[0].rangeLength / -1;
    }

    if (
      !isCharDelete &&
      textChangeLen === 0 &&
      linesAdded === 0 &&
      linesDeleted === 0
    ) {
      return;
    }

    if (textChangeLen > 8) {
      //
      // it's a copy and paste event
      //
      sourceObj.paste += 1;
    } else if (textChangeLen < 0) {
      sourceObj.delete += 1;
      // update the overall count
    } else if (hasNonNewLineData) {
      // update the data for this fileInfo keys count
      sourceObj.add += 1;
      // update the overall count
    }
    // increment keystrokes by 1
    rootObj.keystrokes += 1;

    // "netkeys" = add - delete
    sourceObj.netkeys = sourceObj.add - sourceObj.delete;
    sourceObj.lines = currLineCount;

    if (linesDeleted > 0) {
      sourceObj.linesRemoved += linesDeleted;
    } else if (linesAdded > 0) {
      sourceObj.linesAdded += linesAdded;
    }

    // console.log("KPM MANAGER ROOTOBJ");
    // console.log(rootObj);

    this.updateLatestPayloadLazily(rootObj);
  }

  private updateLatestPayloadLazily(payload) {
    if (this._currentPayloadTimeout) {
      // cancel the current one
      clearTimeout(this._currentPayloadTimeout);
      this._currentPayloadTimeout = null;
    }
    this._currentPayloadTimeout = setTimeout(() => {
      console.log("Update Lazily Payload");
      console.log(payload);
      this.updateLatestPayload(payload);
    }, 2000);
  }

  private updateLatestPayload(payload) {
    storeCurrentPayload(payload);
  }

  /**
   * Update some of the basic/static attributes
   * @param sourceObj
   * @param staticInfo
   */
  private updateStaticValues(payload, staticInfo) {
    const sourceObj: FileChangeInfo = payload.source[staticInfo.filename];

    // syntax
    if (!sourceObj.syntax) {
      sourceObj.syntax = staticInfo.languageId;
    }
    // fileAgeDays
    if (!sourceObj.fileAgeDays) {
      sourceObj.fileAgeDays = staticInfo.fileAgeDays;
    }

    // length
    sourceObj.length = staticInfo.length;
  }

  private getFileName(event) {
    let filename = "";
    if (event.fileName) {
      filename = event.fileName;
    } else if (event.document && event.document.fileName) {
      filename = event.document.fileName;
    }
    return filename;
  }

  private async getStaticEventInfo(event, filename) {
    let languageId = "";
    let length = 0;
    let lineCount = 0;

    // get the filename, length of the file, and the languageId
    if (event.fileName) {
      if (event.languageId) {
        languageId = event.languageId;
      }
      if (event.getText()) {
        length = event.getText().length;
      }
      if (event.lineCount) {
        lineCount = event.lineCount;
      }
    } else if (event.document && event.document.fileName) {
      if (event.document.languageId) {
        languageId = event.document.languageId;
      }
      if (event.document.getText()) {
        length = event.document.getText().length;
      }

      if (event.document.lineCount) {
        lineCount = event.document.lineCount;
      }
    }

    let staticInfo = _staticInfoMap[filename];

    if (staticInfo) {
      return staticInfo;
    }

    // get the age of this file
    const fileAgeDays = getFileAgeInDays(filename);

    // if the languageId is not assigned, use the file type
    if (!languageId && filename.indexOf(".") !== -1) {
      let fileType = getFileType(filename);
      if (fileType) {
        languageId = fileType;
      }
    }

    staticInfo = {
      filename,
      languageId,
      length,
      fileAgeDays,
      lineCount,
    };

    _staticInfoMap[filename] = staticInfo;

    return staticInfo;
  }


  /**
   * This will return true if it's a true file. we don't
   * want to send events for .git or other event triggers
   * such as extension.js.map events
   */
  private isTrueEventFile(event, filename) {
    if (!filename) {
      return false;
    }
    // if it's the dashboard file or a liveshare tmp file then
    // skip event tracking

    let scheme = "";
    if (event.uri && event.uri.scheme) {
      scheme = event.uri.scheme;
    } else if (
      event.document &&
      event.document.uri &&
      event.document.uri.scheme
    ) {
      scheme = event.document.uri.scheme;
    }

    const isLiveshareTmpFile = filename.match(
      /.*\.code-workspace.*vsliveshare.*tmp-.*/,
    );
    const isInternalFile = filename.match(
      /.*\.software.*(CommitSummary\.txt|CodeTime\.txt|session\.json|ProjectCodeSummary\.txt|data.json)/,
    );

    // other scheme types I know of "vscode-userdata", "git"
    if (scheme !== "file" && scheme !== "untitled") {
      return false;
    } else if (isLiveshareTmpFile || isInternalFile) {
      return false;
    }

    return true;
  }

  public buildBootstrapKpmPayload() {
    let rootPath = UNTITLED;
    let fileName = UNTITLED;
    let name = NO_PROJ_NAME;

    // send the code time bootstrap payload
    let keystrokeStats = new KeystrokeStats({
      // project.directory is used as an object key, must be string
      directory: rootPath,
      name,
      identifier: "",
      resource: {},
    });
    keystrokeStats.keystrokes = 1;
    let nowTimes = getNowTimes();
    const start = nowTimes.now_in_sec - 60;
    const local_start = nowTimes.local_now_in_sec - 60;
    keystrokeStats.start = start;
    keystrokeStats.local_start = local_start;
    const fileInfo = new FileChangeInfo();
    fileInfo.add = 1;
    fileInfo.keystrokes = 1;
    fileInfo.start = start;
    fileInfo.local_start = local_start;
    keystrokeStats.source[fileName] = fileInfo;

    setTimeout(() => keystrokeStats.postData(true /*sendNow*/), 0);
  }

  private endPreviousModifiedFiles(filename, rootPath) {
    let keystrokeStats = _keystrokeMap[rootPath];
    if (keystrokeStats) {
      // close any existing
      const fileKeys = Object.keys(keystrokeStats.source);
      const nowTimes = getNowTimes();
      if (fileKeys.length) {
        // set the end time to now for the other files that don't match this file
        fileKeys.forEach((key) => {
          let sourceObj: FileChangeInfo = keystrokeStats.source[key];
          if (key !== filename && sourceObj.end === 0) {
            sourceObj.end = nowTimes.now_in_sec;
            sourceObj.local_end = nowTimes.local_now_in_sec;
          }
        });
      }
    }
  }

  private async initializeKeystrokesCount(filename, rootPath) {
    // the rootPath (directory) is used as the map key, must be a string
    rootPath = rootPath || NO_PROJ_NAME;
    // if we don't even have a _keystrokeMap then create it and take the
    // path of adding this file with a start time of now
    if (!_keystrokeMap) {
      _keystrokeMap = {};
    }

    const nowTimes = getNowTimes();

    let keystrokeStats = _keystrokeMap[rootPath];

    // create the keystroke count if it doesn't exist
    if (!keystrokeStats) {
      // add keystroke count wrapper
      keystrokeStats = await this.createKeystrokeStats(
        filename,
        rootPath,
        nowTimes,
      );
    }

    // check if we have this file or not
    const hasFile = keystrokeStats.source[filename];

    if (!hasFile) {
      // no file, start anew
      this.addFile(filename, nowTimes, keystrokeStats);
    } else if (parseInt(keystrokeStats.source[filename].end, 10) !== 0) {
      // re-initialize it since we ended it before the minute was up
      keystrokeStats.source[filename].end = 0;
      keystrokeStats.source[filename].local_end = 0;
    }

    _keystrokeMap[rootPath] = keystrokeStats;
  }

  private addFile(filename, nowTimes, keystrokeStats) {
    const fileInfo = new FileChangeInfo();
    fileInfo.start = nowTimes.now_in_sec;
    fileInfo.local_start = nowTimes.local_now_in_sec;
    keystrokeStats.source[filename] = fileInfo;
  }

  private async createKeystrokeStats(filename, rootPath, nowTimes) {
    // start off with an empty project
    const p: Project = new Project();
    const keystrokeStats: KeystrokeStats = new KeystrokeStats(p);

    keystrokeStats.start = nowTimes.now_in_sec;
    keystrokeStats.local_start = nowTimes.local_now_in_sec;
    keystrokeStats.keystrokes = 0;

    // start the minute timer to send the data
    setTimeout(() => {
      this.sendKeystrokeDataIntervalHandler();
    }, DEFAULT_DURATION_MILLIS);

    return keystrokeStats;
  }

  public dispose() {
    this._disposable.dispose();
  }
}
