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
exports.getThisWeek = exports.getYesterday = exports.getToday = exports.getCommandResult = void 0;
const Util_1 = require("../Util");
const moment = require("moment-timezone");
const ONE_HOUR_IN_SEC = 60 * 60;
const ONE_DAY_SEC = ONE_HOUR_IN_SEC * 24;
const ONE_WEEK_SEC = ONE_DAY_SEC * 7;
function getCommandResult(cmd, projectDir) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield Util_1.wrapExecPromise(cmd, projectDir);
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
    });
}
exports.getCommandResult = getCommandResult;
/**
 * Returns the user's today's start and end in UTC time
 * @param {Object} user
 */
function getToday() {
    const start = moment().startOf("day").unix();
    const end = start + ONE_DAY_SEC;
    return { start, end };
}
exports.getToday = getToday;
/**
 * Returns the user's yesterday start and end in UTC time
 */
function getYesterday() {
    const start = moment().subtract(1, "day").startOf("day").unix();
    const end = start + ONE_DAY_SEC;
    return { start, end };
}
exports.getYesterday = getYesterday;
/**
 * Returns the user's this week's start and end in UTC time
 */
function getThisWeek() {
    const start = moment().startOf("week").unix();
    const end = start + ONE_WEEK_SEC;
    return { start, end };
}
exports.getThisWeek = getThisWeek;
//# sourceMappingURL=GitUtil.js.map