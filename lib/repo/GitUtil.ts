import {wrapExecPromise, isGitProject} from "../Util";

const moment = require("moment-timezone");

const ONE_HOUR_IN_SEC = 60 * 60;
const ONE_DAY_SEC = ONE_HOUR_IN_SEC * 24;
const ONE_WEEK_SEC = ONE_DAY_SEC * 7;

export async function getCommandResult(cmd, projectDir) {
  let result = await wrapExecPromise(cmd, projectDir);
  if (!result) {
    // something went wrong, but don't try to parse a null or undefined str
    return null;
  }
  result = result.trim();
  let resultList = result
    .replace(/\r\n/g, "\r")
    .replace(/\n/g, "\r")
    .replace(/^\s+/g, " ")
    .replace(/</g, "")
    .replace(/>/g, "")
    .split(/\r/);
  return resultList;
}

/**
 * Returns the user's today's start and end in UTC time
 * @param {Object} user
 */
export function getToday() {
  const start = moment().startOf("day").unix();
  const end = start + ONE_DAY_SEC;
  return {start, end};
}

/**
 * Returns the user's yesterday start and end in UTC time
 */
export function getYesterday() {
  const start = moment().subtract(1, "day").startOf("day").unix();
  const end = start + ONE_DAY_SEC;
  return {start, end};
}

/**
 * Returns the user's this week's start and end in UTC time
 */
export function getThisWeek() {
  const start = moment().startOf("week").unix();
  const end = start + ONE_WEEK_SEC;
  return {start, end};
}
