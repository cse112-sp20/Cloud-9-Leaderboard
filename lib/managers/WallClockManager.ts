import {getItem, humanizeMinutes, setItem} from "../Util";
import {commands, window} from "vscode";
import {updateStatusBarWithSummaryData} from "../storage/SessionSummaryData";
import {incrementEditorSeconds} from "../storage/TimeSummaryData";
import {KpmManager} from "./KpmManager";

const SECONDS_INTERVAL = 30;
const CLOCK_INTERVAL = 1000 * SECONDS_INTERVAL;

export class WallClockManager {
  private static instance: WallClockManager;

  private _wctime: number = 0;

  private constructor() {
    this.initTimer();
  }

  static getInstance(): WallClockManager {
    if (!WallClockManager.instance) {
      WallClockManager.instance = new WallClockManager();
    }

    return WallClockManager.instance;
  }

  private initTimer() {
    const kpmMgr: KpmManager = KpmManager.getInstance();

    this._wctime = getItem("wctime") || 0;
    setInterval(() => {
      // If the window is focused
      if (window.state.focused || kpmMgr.hasKeystrokeData()) {
        // set the wctime (deprecated, remove one day when all plugins use time data info)
        this._wctime = getItem("wctime") || 0;
        this._wctime += SECONDS_INTERVAL;
        setItem("wctime", this._wctime);

        // update the file info file
        incrementEditorSeconds(SECONDS_INTERVAL);
      }
    }, CLOCK_INTERVAL);
  }

  public getHumanizedWcTime() {
    return humanizeMinutes(this._wctime / 60);
  }

  public getWcTimeInSeconds() {
    return this._wctime;
  }
}
