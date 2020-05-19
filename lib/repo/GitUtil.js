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
exports.getThisWeek = exports.getYesterday = exports.getToday = exports.getRepoUrlLink = exports.getRepoConfigUserEmail = exports.getLastCommitId = exports.getSlackReportCommits = exports.getThisWeeksCommits = exports.getYesterdaysCommits = exports.getTodaysCommits = exports.getUncommitedChanges = exports.accumulateStatChanges = exports.getCommandResultString = exports.getCommandResult = void 0;
var models_1 = require("../model/models");
var Util_1 = require("../Util");
var KpmRepoManager_1 = require("./KpmRepoManager");
var CacheManager_1 = require("../cache/CacheManager");
var moment = require("moment-timezone");
var ONE_HOUR_IN_SEC = 60 * 60;
var ONE_DAY_SEC = ONE_HOUR_IN_SEC * 24;
var ONE_WEEK_SEC = ONE_DAY_SEC * 7;
var cacheMgr = CacheManager_1.CacheManager.getInstance();
var cacheTimeoutSeconds = 60 * 10;
function getCommandResult(cmd, projectDir) {
    return __awaiter(this, void 0, void 0, function () {
        var result, resultList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Util_1.wrapExecPromise(cmd, projectDir)];
                case 1:
                    result = _a.sent();
                    if (!result) {
                        // something went wrong, but don't try to parse a null or undefined str
                        return [2 /*return*/, null];
                    }
                    result = result.trim();
                    resultList = result
                        .replace(/\r\n/g, "\r")
                        .replace(/\n/g, "\r")
                        .replace(/^\s+/g, " ")
                        .replace(/</g, "")
                        .replace(/>/g, "")
                        .split(/\r/);
                    return [2 /*return*/, resultList];
            }
        });
    });
}
exports.getCommandResult = getCommandResult;
function getCommandResultString(cmd, projectDir) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Util_1.wrapExecPromise(cmd, projectDir)];
                case 1:
                    result = _a.sent();
                    if (!result) {
                        // something went wrong, but don't try to parse a null or undefined str
                        return [2 /*return*/, null];
                    }
                    result = result.trim();
                    result = result
                        .replace(/\r\n/g, "\r")
                        .replace(/\n/g, "\r")
                        .replace(/^\s+/g, " ");
                    return [2 /*return*/, result];
            }
        });
    });
}
exports.getCommandResultString = getCommandResultString;
/**
 * Looks through all of the lines for
 * files changed, insertions, and deletions and aggregates
 * @param results
 */
function accumulateStatChanges(results) {
    var stats = new models_1.CommitChangeStats();
    if (results) {
        for (var i = 0; i < results.length; i++) {
            var line = results[i].trim();
            // look for the line with "insertion" and "deletion"
            if (line.includes("changed") &&
                (line.includes("insertion") || line.includes("deletion"))) {
                // split by space, then the number before the keyword is our value
                var parts = line.split(" ");
                // the very first element is the number of files changed
                var fileCount = parseInt(parts[0], 10);
                stats.fileCount += fileCount;
                stats.commitCount += 1;
                for (var x = 1; x < parts.length; x++) {
                    var part = parts[x];
                    if (part.includes("insertion")) {
                        var insertions = parseInt(parts[x - 1], 10);
                        if (insertions) {
                            stats.insertions += insertions;
                        }
                    }
                    else if (part.includes("deletion")) {
                        var deletions = parseInt(parts[x - 1], 10);
                        if (deletions) {
                            stats.deletions += deletions;
                        }
                    }
                }
            }
        }
    }
    return stats;
}
exports.accumulateStatChanges = accumulateStatChanges;
function getChangeStats(projectDir, cmd) {
    return __awaiter(this, void 0, void 0, function () {
        var changeStats, resultList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    changeStats = new models_1.CommitChangeStats();
                    if (!projectDir || !Util_1.isGitProject(projectDir)) {
                        return [2 /*return*/, changeStats];
                    }
                    return [4 /*yield*/, getCommandResult(cmd, projectDir)];
                case 1:
                    resultList = _a.sent();
                    if (!resultList) {
                        // something went wrong, but don't try to parse a null or undefined str
                        return [2 /*return*/, changeStats];
                    }
                    // just look for the line with "insertions" and "deletions"
                    changeStats = accumulateStatChanges(resultList);
                    return [2 /*return*/, changeStats];
            }
        });
    });
}
function getUncommitedChanges(projectDir) {
    return __awaiter(this, void 0, void 0, function () {
        var noSpacesProjDir, cacheId, commitChanges, cmd;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!projectDir || !Util_1.isGitProject(projectDir)) {
                        new models_1.CommitChangeStats();
                    }
                    noSpacesProjDir = projectDir.replace(/^\s+/g, "");
                    cacheId = "uncommitted-changes-" + noSpacesProjDir;
                    commitChanges = cacheMgr.get(cacheId);
                    // return from cache if we have it
                    if (commitChanges) {
                        return [2 /*return*/, commitChanges];
                    }
                    cmd = "git diff --stat";
                    return [4 /*yield*/, getChangeStats(projectDir, cmd)];
                case 1:
                    commitChanges = _a.sent();
                    if (commitChanges) {
                        cacheMgr.set(cacheId, commitChanges, cacheTimeoutSeconds);
                    }
                    return [2 /*return*/, commitChanges];
            }
        });
    });
}
exports.getUncommitedChanges = getUncommitedChanges;
function getTodaysCommits(projectDir, useAuthor) {
    if (useAuthor === void 0) { useAuthor = true; }
    return __awaiter(this, void 0, void 0, function () {
        var noSpacesProjDir, cacheId, commitChanges, _a, start, end;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!projectDir || !Util_1.isGitProject(projectDir)) {
                        new models_1.CommitChangeStats();
                    }
                    noSpacesProjDir = projectDir.replace(/^\s+/g, "");
                    cacheId = "todays-commits-" + noSpacesProjDir;
                    commitChanges = cacheMgr.get(cacheId);
                    // return from cache if we have it
                    if (commitChanges) {
                        return [2 /*return*/, commitChanges];
                    }
                    _a = getToday(), start = _a.start, end = _a.end;
                    return [4 /*yield*/, getCommitsInUtcRange(projectDir, start, end, useAuthor)];
                case 1:
                    commitChanges = _b.sent();
                    if (commitChanges) {
                        cacheMgr.set(cacheId, commitChanges, cacheTimeoutSeconds);
                    }
                    return [2 /*return*/, commitChanges];
            }
        });
    });
}
exports.getTodaysCommits = getTodaysCommits;
function getYesterdaysCommits(projectDir, useAuthor) {
    if (useAuthor === void 0) { useAuthor = true; }
    return __awaiter(this, void 0, void 0, function () {
        var noSpacesProjDir, cacheId, commitChanges, _a, start, end;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!projectDir || !Util_1.isGitProject(projectDir)) {
                        new models_1.CommitChangeStats();
                    }
                    noSpacesProjDir = projectDir.replace(/^\s+/g, "");
                    cacheId = "yesterdays-commits-" + noSpacesProjDir;
                    commitChanges = cacheMgr.get(cacheId);
                    // return from cache if we have it
                    if (commitChanges) {
                        return [2 /*return*/, commitChanges];
                    }
                    _a = getYesterday(), start = _a.start, end = _a.end;
                    return [4 /*yield*/, getCommitsInUtcRange(projectDir, start, end, useAuthor)];
                case 1:
                    commitChanges = _b.sent();
                    if (commitChanges) {
                        cacheMgr.set(cacheId, commitChanges, cacheTimeoutSeconds);
                    }
                    return [2 /*return*/, commitChanges];
            }
        });
    });
}
exports.getYesterdaysCommits = getYesterdaysCommits;
function getThisWeeksCommits(projectDir, useAuthor) {
    if (useAuthor === void 0) { useAuthor = true; }
    return __awaiter(this, void 0, void 0, function () {
        var noSpacesProjDir, cacheId, commitChanges, _a, start, end;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!projectDir || !Util_1.isGitProject(projectDir)) {
                        new models_1.CommitChangeStats();
                    }
                    noSpacesProjDir = projectDir.replace(/^\s+/g, "");
                    cacheId = "this-weeks-commits-" + noSpacesProjDir;
                    commitChanges = cacheMgr.get(cacheId);
                    // return from cache if we have it
                    if (commitChanges) {
                        return [2 /*return*/, commitChanges];
                    }
                    _a = getThisWeek(), start = _a.start, end = _a.end;
                    return [4 /*yield*/, getCommitsInUtcRange(projectDir, start, end, useAuthor)];
                case 1:
                    commitChanges = _b.sent();
                    if (commitChanges) {
                        cacheMgr.set(cacheId, commitChanges, cacheTimeoutSeconds);
                    }
                    return [2 /*return*/, commitChanges];
            }
        });
    });
}
exports.getThisWeeksCommits = getThisWeeksCommits;
function getCommitsInUtcRange(projectDir, start, end, useAuthor) {
    if (useAuthor === void 0) { useAuthor = true; }
    return __awaiter(this, void 0, void 0, function () {
        var noSpacesProjDir, cacheId, commitChanges, resourceInfo, authorOption, cmd;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!projectDir || !Util_1.isGitProject(projectDir)) {
                        new models_1.CommitChangeStats();
                    }
                    noSpacesProjDir = projectDir.replace(/^\s+/g, "");
                    cacheId = "commits-in-range-" + noSpacesProjDir;
                    commitChanges = cacheMgr.get(cacheId);
                    // return from cache if we have it
                    if (commitChanges) {
                        return [2 /*return*/, commitChanges];
                    }
                    return [4 /*yield*/, KpmRepoManager_1.getResourceInfo(projectDir)];
                case 1:
                    resourceInfo = _a.sent();
                    authorOption = useAuthor && resourceInfo && resourceInfo.email
                        ? " --author=" + resourceInfo.email
                        : "";
                    cmd = "git log --stat --pretty=\"COMMIT:%H,%ct,%cI,%s\" --since=" + start + " --until=" + end + authorOption;
                    return [4 /*yield*/, getChangeStats(projectDir, cmd)];
                case 2:
                    commitChanges = _a.sent();
                    if (commitChanges) {
                        cacheMgr.set(cacheId, commitChanges, cacheTimeoutSeconds);
                    }
                    return [2 /*return*/, commitChanges];
            }
        });
    });
}
function getSlackReportCommits(projectDir) {
    return __awaiter(this, void 0, void 0, function () {
        var startEnd, resourceInfo, authorOption, cmd, resultList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!projectDir || !Util_1.isGitProject(projectDir)) {
                        return [2 /*return*/, []];
                    }
                    startEnd = getThisWeek();
                    return [4 /*yield*/, KpmRepoManager_1.getResourceInfo(projectDir)];
                case 1:
                    resourceInfo = _a.sent();
                    if (!resourceInfo || !resourceInfo.email) {
                        return [2 /*return*/, []];
                    }
                    authorOption = " --author=" + resourceInfo.email;
                    cmd = "git log --pretty=\"%s\" --since=" + startEnd.start + " --until=" + startEnd.end + authorOption;
                    return [4 /*yield*/, getCommandResult(cmd, projectDir)];
                case 2:
                    resultList = _a.sent();
                    return [2 /*return*/, resultList];
            }
        });
    });
}
exports.getSlackReportCommits = getSlackReportCommits;
function getLastCommitId(projectDir, email) {
    return __awaiter(this, void 0, void 0, function () {
        var noSpacesProjDir, cacheId, lastCommitIdInfo, authorOption, cmd, list, parts;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!projectDir || !Util_1.isGitProject(projectDir)) {
                        return [2 /*return*/, {}];
                    }
                    noSpacesProjDir = projectDir.replace(/^\s+/g, "");
                    cacheId = "last-commit-id-" + noSpacesProjDir;
                    lastCommitIdInfo = cacheMgr.get(cacheId);
                    // return from cache if we have it
                    if (lastCommitIdInfo) {
                        return [2 /*return*/, lastCommitIdInfo];
                    }
                    lastCommitIdInfo = {};
                    authorOption = email ? " --author=" + email : "";
                    cmd = "git log --pretty=\"%H,%s\"" + authorOption + " --max-count=1";
                    return [4 /*yield*/, getCommandResult(cmd, projectDir)];
                case 1:
                    list = _a.sent();
                    if (list && list.length) {
                        parts = list[0].split(",");
                        if (parts && parts.length === 2) {
                            lastCommitIdInfo = {
                                commitId: parts[0],
                                comment: parts[1]
                            };
                            // cache it
                            cacheMgr.set(cacheId, lastCommitIdInfo, cacheTimeoutSeconds);
                        }
                    }
                    return [2 /*return*/, lastCommitIdInfo];
            }
        });
    });
}
exports.getLastCommitId = getLastCommitId;
function getRepoConfigUserEmail(projectDir) {
    return __awaiter(this, void 0, void 0, function () {
        var cmd;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!projectDir || !Util_1.isGitProject(projectDir)) {
                        return [2 /*return*/, ""];
                    }
                    cmd = "git config user.email";
                    return [4 /*yield*/, getCommandResultString(cmd, projectDir)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.getRepoConfigUserEmail = getRepoConfigUserEmail;
function getRepoUrlLink(projectDir) {
    return __awaiter(this, void 0, void 0, function () {
        var noSpacesProjDir, cacheId, repoUrlLink, cmd;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!projectDir || !Util_1.isGitProject(projectDir)) {
                        return [2 /*return*/, ""];
                    }
                    noSpacesProjDir = projectDir.replace(/^\s+/g, "");
                    cacheId = "repo-link-url-" + noSpacesProjDir;
                    repoUrlLink = cacheMgr.get(cacheId);
                    // return from cache if we have it
                    if (repoUrlLink) {
                        return [2 /*return*/, repoUrlLink];
                    }
                    cmd = "git config --get remote.origin.url";
                    return [4 /*yield*/, getCommandResultString(cmd, projectDir)];
                case 1:
                    repoUrlLink = _a.sent();
                    if (repoUrlLink && repoUrlLink.endsWith(".git")) {
                        repoUrlLink = repoUrlLink.substring(0, repoUrlLink.lastIndexOf(".git"));
                    }
                    if (repoUrlLink) {
                        // cache it
                        cacheMgr.set(cacheId, repoUrlLink, cacheTimeoutSeconds);
                    }
                    return [2 /*return*/, repoUrlLink];
            }
        });
    });
}
exports.getRepoUrlLink = getRepoUrlLink;
/**
 * Returns the user's today's start and end in UTC time
 * @param {Object} user
 */
function getToday() {
    var start = moment().startOf("day").unix();
    var end = start + ONE_DAY_SEC;
    return { start: start, end: end };
}
exports.getToday = getToday;
/**
 * Returns the user's yesterday start and end in UTC time
 */
function getYesterday() {
    var start = moment().subtract(1, "day").startOf("day").unix();
    var end = start + ONE_DAY_SEC;
    return { start: start, end: end };
}
exports.getYesterday = getYesterday;
/**
 * Returns the user's this week's start and end in UTC time
 */
function getThisWeek() {
    var start = moment().startOf("week").unix();
    var end = start + ONE_WEEK_SEC;
    return { start: start, end: end };
}
exports.getThisWeek = getThisWeek;
