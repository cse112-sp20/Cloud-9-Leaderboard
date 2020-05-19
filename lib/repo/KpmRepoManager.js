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
exports.getHistoricalCommits = exports.postRepoContributors = exports.processRepoUsersForWorkspace = exports.getResourceInfo = exports.getRepoContributorInfo = exports.getRepoContributors = exports.getRepoFileCount = exports.getFileContributorCount = exports.getMyRepoInfo = void 0;
var HttpClient_1 = require("../http/HttpClient");
var Util_1 = require("../Util");
var HttpClient_2 = require("../http/HttpClient");
var GitUtil_1 = require("./GitUtil");
var RepoContributorInfo_1 = require("../model/RepoContributorInfo");
var TeamMember_1 = require("../model/TeamMember");
var CacheManager_1 = require("../cache/CacheManager");
var myRepoInfo = [];
var cacheMgr = CacheManager_1.CacheManager.getInstance();
var cacheTimeoutSeconds = 60 * 10;
function getProjectDir(fileName) {
    if (fileName === void 0) { fileName = null; }
    var workspaceFolders = Util_1.getWorkspaceFolders();
    if (!workspaceFolders || workspaceFolders.length === 0) {
        return null;
    }
    // VSCode allows having multiple workspaces.
    // for now we only support using the 1st project directory
    // in a given set of workspaces if the provided fileName is null.
    if (workspaceFolders && workspaceFolders.length > 0) {
        if (!fileName) {
            return workspaceFolders[0].uri.fsPath;
        }
        for (var i = 0; i < workspaceFolders.length; i++) {
            var dir = workspaceFolders[i].uri.fsPath;
            if (fileName.includes(dir)) {
                return dir;
            }
        }
    }
    return null;
}
function getMyRepoInfo() {
    return __awaiter(this, void 0, void 0, function () {
        var serverAvailable, jwt, resp;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (myRepoInfo.length > 0) {
                        return [2 /*return*/, myRepoInfo];
                    }
                    return [4 /*yield*/, HttpClient_2.serverIsAvailable()];
                case 1:
                    serverAvailable = _a.sent();
                    jwt = Util_1.getItem("jwt");
                    if (!(serverAvailable && jwt)) return [3 /*break*/, 3];
                    return [4 /*yield*/, HttpClient_1.softwareGet("/repo/info", jwt)];
                case 2:
                    resp = _a.sent();
                    if (HttpClient_1.isResponseOk(resp)) {
                        myRepoInfo = resp.data;
                    }
                    _a.label = 3;
                case 3: return [2 /*return*/, myRepoInfo];
            }
        });
    });
}
exports.getMyRepoInfo = getMyRepoInfo;
function getFileContributorCount(fileName) {
    return __awaiter(this, void 0, void 0, function () {
        var fileType, projectDir, cmd, resultList, map, i, name_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    fileType = Util_1.getFileType(fileName);
                    if (fileType === "git") {
                        return [2 /*return*/, 0];
                    }
                    projectDir = getProjectDir(fileName);
                    if (!projectDir || !Util_1.isGitProject(projectDir)) {
                        return [2 /*return*/, 0];
                    }
                    cmd = "git log --pretty=\"%an\" " + fileName;
                    return [4 /*yield*/, GitUtil_1.getCommandResult(cmd, projectDir)];
                case 1:
                    resultList = _a.sent();
                    if (!resultList) {
                        // something went wrong, but don't try to parse a null or undefined str
                        return [2 /*return*/, 0];
                    }
                    if (resultList.length > 0) {
                        map = {};
                        for (i = 0; i < resultList.length; i++) {
                            name_1 = resultList[i];
                            if (!map[name_1]) {
                                map[name_1] = name_1;
                            }
                        }
                        return [2 /*return*/, Object.keys(map).length];
                    }
                    return [2 /*return*/, 0];
            }
        });
    });
}
exports.getFileContributorCount = getFileContributorCount;
function getRepoFileCount(fileName) {
    return __awaiter(this, void 0, void 0, function () {
        var projectDir, cmd, resultList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    projectDir = getProjectDir(fileName);
                    if (!projectDir || !Util_1.isGitProject(projectDir)) {
                        return [2 /*return*/, 0];
                    }
                    cmd = "git ls-files";
                    return [4 /*yield*/, GitUtil_1.getCommandResult(cmd, projectDir)];
                case 1:
                    resultList = _a.sent();
                    if (!resultList) {
                        // something went wrong, but don't try to parse a null or undefined str
                        return [2 /*return*/, 0];
                    }
                    return [2 /*return*/, resultList.length];
            }
        });
    });
}
exports.getRepoFileCount = getRepoFileCount;
function getRepoContributors(fileName, filterOutNonEmails) {
    if (fileName === void 0) { fileName = ""; }
    if (filterOutNonEmails === void 0) { filterOutNonEmails = true; }
    return __awaiter(this, void 0, void 0, function () {
        var noSpacesFileName, cacheId, teamMembers, repoContributorInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!fileName) {
                        fileName = Util_1.findFirstActiveDirectoryOrWorkspaceDirectory();
                    }
                    noSpacesFileName = fileName.replace(/^\s+/g, "");
                    cacheId = "file-repo-contributors-info-" + noSpacesFileName;
                    teamMembers = cacheMgr.get(cacheId);
                    // return from cache if we have it
                    if (teamMembers) {
                        return [2 /*return*/, teamMembers];
                    }
                    teamMembers = [];
                    return [4 /*yield*/, getRepoContributorInfo(fileName, filterOutNonEmails)];
                case 1:
                    repoContributorInfo = _a.sent();
                    if (repoContributorInfo && repoContributorInfo.members) {
                        teamMembers = repoContributorInfo.members;
                        cacheMgr.set(cacheId, teamMembers, cacheTimeoutSeconds);
                    }
                    return [2 /*return*/, teamMembers];
            }
        });
    });
}
exports.getRepoContributors = getRepoContributors;
function getRepoContributorInfo(fileName, filterOutNonEmails) {
    if (filterOutNonEmails === void 0) { filterOutNonEmails = true; }
    return __awaiter(this, void 0, void 0, function () {
        var projectDir, noSpacesProjDir, cacheId, repoContributorInfo, resourceInfo, cmd, resultList, map_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    projectDir = getProjectDir(fileName);
                    if (!projectDir || !Util_1.isGitProject(projectDir)) {
                        return [2 /*return*/, null];
                    }
                    noSpacesProjDir = projectDir.replace(/^\s+/g, "");
                    cacheId = "project-repo-contributor-info-" + noSpacesProjDir;
                    repoContributorInfo = cacheMgr.get(cacheId);
                    // return from cache if we have it
                    if (repoContributorInfo) {
                        return [2 /*return*/, repoContributorInfo];
                    }
                    repoContributorInfo = new RepoContributorInfo_1["default"]();
                    return [4 /*yield*/, getResourceInfo(projectDir)];
                case 1:
                    resourceInfo = _a.sent();
                    if (!(resourceInfo && resourceInfo.identifier)) return [3 /*break*/, 3];
                    repoContributorInfo.identifier = resourceInfo.identifier;
                    repoContributorInfo.tag = resourceInfo.tag;
                    repoContributorInfo.branch = resourceInfo.branch;
                    cmd = "git log --format='%an,%ae' | sort -u";
                    return [4 /*yield*/, GitUtil_1.getCommandResult(cmd, projectDir)];
                case 2:
                    resultList = _a.sent();
                    if (!resultList) {
                        // something went wrong, but don't try to parse a null or undefined str
                        return [2 /*return*/, repoContributorInfo];
                    }
                    map_1 = {};
                    if (resultList && resultList.length > 0) {
                        // count name email
                        resultList.forEach(function (listInfo) {
                            var devInfo = listInfo.split(",");
                            var name = devInfo[0];
                            var email = Util_1.normalizeGithubEmail(devInfo[1], filterOutNonEmails);
                            if (email && !map_1[email]) {
                                var teamMember = new TeamMember_1["default"]();
                                teamMember.name = name;
                                teamMember.email = email;
                                teamMember.identifier = resourceInfo.identifier;
                                repoContributorInfo.members.push(teamMember);
                                map_1[email] = email;
                            }
                        });
                    }
                    repoContributorInfo.count = repoContributorInfo.members.length;
                    _a.label = 3;
                case 3:
                    if (repoContributorInfo && repoContributorInfo.count > 0) {
                        cacheMgr.set(cacheId, repoContributorInfo, cacheTimeoutSeconds);
                    }
                    return [2 /*return*/, repoContributorInfo];
            }
        });
    });
}
exports.getRepoContributorInfo = getRepoContributorInfo;
//
// use "git symbolic-ref --short HEAD" to get the git branch
// use "git config --get remote.origin.url" to get the remote url
function getResourceInfo(projectDir) {
    return __awaiter(this, void 0, void 0, function () {
        var noSpacesProjDir, cacheId, resourceInfo, branch, identifier, email, tag;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!projectDir || !Util_1.isGitProject(projectDir)) {
                        return [2 /*return*/, {}];
                    }
                    noSpacesProjDir = projectDir.replace(/^\s+/g, "");
                    cacheId = "resource-info-" + noSpacesProjDir;
                    resourceInfo = cacheMgr.get(cacheId);
                    // return from cache if we have it
                    if (resourceInfo) {
                        return [2 /*return*/, resourceInfo];
                    }
                    resourceInfo = {};
                    return [4 /*yield*/, Util_1.wrapExecPromise("git symbolic-ref --short HEAD", projectDir)];
                case 1:
                    branch = _a.sent();
                    return [4 /*yield*/, Util_1.wrapExecPromise("git config --get remote.origin.url", projectDir)];
                case 2:
                    identifier = _a.sent();
                    return [4 /*yield*/, Util_1.wrapExecPromise("git config user.email", projectDir)];
                case 3:
                    email = _a.sent();
                    return [4 /*yield*/, Util_1.wrapExecPromise("git describe --all", projectDir)];
                case 4:
                    tag = _a.sent();
                    // both should be valid to return the resource info
                    if (branch && identifier) {
                        resourceInfo = { branch: branch, identifier: identifier, email: email, tag: tag };
                        cacheMgr.set(cacheId, resourceInfo, cacheTimeoutSeconds);
                    }
                    // we don't have git info, return an empty object
                    return [2 /*return*/, resourceInfo];
            }
        });
    });
}
exports.getResourceInfo = getResourceInfo;
function processRepoUsersForWorkspace() {
    return __awaiter(this, void 0, void 0, function () {
        var activeWorkspaceDir;
        return __generator(this, function (_a) {
            activeWorkspaceDir = Util_1.findFirstActiveDirectoryOrWorkspaceDirectory();
            if (activeWorkspaceDir) {
                postRepoContributors(activeWorkspaceDir);
            }
            return [2 /*return*/];
        });
    });
}
exports.processRepoUsersForWorkspace = processRepoUsersForWorkspace;
/**
 * get the git repo users
 */
function postRepoContributors(fileName) {
    return __awaiter(this, void 0, void 0, function () {
        var repoContributorInfo;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getRepoContributorInfo(fileName)];
                case 1:
                    repoContributorInfo = _a.sent();
                    if (repoContributorInfo) {
                        // send this to the backend
                        HttpClient_1.softwarePost("/repo/contributors", repoContributorInfo, Util_1.getItem("jwt"));
                    }
                    return [2 /*return*/];
            }
        });
    });
}
exports.postRepoContributors = postRepoContributors;
/**
 * get the last git commit from the app server
 */
function getLastCommit() {
    return __awaiter(this, void 0, void 0, function () {
        var projectDir, resourceInfo, commit, identifier, tag, branch, encodedIdentifier, encodedTag, encodedBranch;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    projectDir = getProjectDir();
                    if (!projectDir || !Util_1.isGitProject(projectDir)) {
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, getResourceInfo(projectDir)];
                case 1:
                    resourceInfo = _a.sent();
                    commit = null;
                    if (!(resourceInfo && resourceInfo.identifier)) return [3 /*break*/, 3];
                    identifier = resourceInfo.identifier;
                    tag = resourceInfo.tag;
                    branch = resourceInfo.branch;
                    encodedIdentifier = encodeURIComponent(identifier);
                    encodedTag = encodeURIComponent(tag);
                    encodedBranch = encodeURIComponent(branch);
                    return [4 /*yield*/, HttpClient_1.softwareGet("/commits/latest?identifier=" + encodedIdentifier + "&tag=" + encodedTag + "&branch=" + encodedBranch, Util_1.getItem("jwt")).then(function (resp) {
                            if (HttpClient_1.isResponseOk(resp)) {
                                // will get a single commit object back with the following attributes
                                // commitId, message, changes, email, timestamp
                                var commit_1 = resp.data && resp.data.commit ? resp.data.commit : null;
                                return commit_1;
                            }
                        })];
                case 2:
                    // call the app
                    commit = _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/, commit];
            }
        });
    });
}
/**
 * get the historical git commits
 */
function getHistoricalCommits(isonline) {
    return __awaiter(this, void 0, void 0, function () {
        /**
         * We'll get commitId, unixTimestamp, unixDate, commitMessage, authorEmail
         * then we'll gather the files
         * COMMIT:52d0ac19236ac69cae951b2a2a0b4700c0c525db, 1545507646, 2018-12-22T11:40:46-08:00, updated wlb to use local_start, xavluiz@gmail.com
    
            backend/app.js                  | 20 +++++++++-----------
            backend/app/lib/audio.js        |  5 -----
            backend/app/lib/feed_helpers.js | 13 +------------
            backend/app/lib/sessions.js     | 25 +++++++++++++++----------
            4 files changed, 25 insertions(+), 38 deletions(-)
        */
        function sendCommits(commitData) {
            // send this to the backend
            HttpClient_1.softwarePost("/commits", commitData, Util_1.getItem("jwt"));
        }
        var projectDir, resourceInfo, identifier, tag, branch, latestCommit, sinceOption, newTimestamp, cmd, resultList, commits, commit, i, line, commitInfos, commitId, timestamp, date, message, lineInfos, file, metricsLine, metricsInfos, addAndDeletes, len, lastPlusIdx, insertions, deletions, commit_batch_size, batchCommits, i, commitData, commitData;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isonline) {
                        return [2 /*return*/];
                    }
                    projectDir = getProjectDir();
                    if (!projectDir || !Util_1.isGitProject(projectDir)) {
                        return [2 /*return*/, null];
                    }
                    return [4 /*yield*/, getResourceInfo(projectDir)];
                case 1:
                    resourceInfo = _a.sent();
                    if (!(resourceInfo && resourceInfo.identifier)) return [3 /*break*/, 10];
                    identifier = resourceInfo.identifier;
                    tag = resourceInfo.tag;
                    branch = resourceInfo.branch;
                    return [4 /*yield*/, getLastCommit()];
                case 2:
                    latestCommit = _a.sent();
                    sinceOption = "";
                    if (latestCommit) {
                        newTimestamp = parseInt(latestCommit.timestamp, 10) + 1;
                        sinceOption = " --since=" + newTimestamp;
                    }
                    else {
                        sinceOption = " --max-count=100";
                    }
                    cmd = "git log --stat --pretty=\"COMMIT:%H,%ct,%cI,%s\" --author=" + resourceInfo.email + sinceOption;
                    return [4 /*yield*/, GitUtil_1.getCommandResult(cmd, projectDir)];
                case 3:
                    resultList = _a.sent();
                    if (!resultList) {
                        // something went wrong, but don't try to parse a null or undefined str
                        return [2 /*return*/, null];
                    }
                    commits = [];
                    commit = null;
                    for (i = 0; i < resultList.length; i++) {
                        line = resultList[i].trim();
                        if (line && line.length > 0) {
                            if (line.indexOf("COMMIT:") === 0) {
                                line = line.substring("COMMIT:".length);
                                if (commit) {
                                    // add it to the commits
                                    commits.push(commit);
                                }
                                commitInfos = line.split(",");
                                if (commitInfos && commitInfos.length > 3) {
                                    commitId = commitInfos[0].trim();
                                    if (latestCommit &&
                                        commitId === latestCommit.commitId) {
                                        commit = null;
                                        // go to the next one
                                        continue;
                                    }
                                    timestamp = parseInt(commitInfos[1].trim(), 10);
                                    date = commitInfos[2].trim();
                                    message = commitInfos[3].trim();
                                    commit = {
                                        commitId: commitId,
                                        timestamp: timestamp,
                                        date: date,
                                        message: message,
                                        changes: {}
                                    };
                                }
                            }
                            else if (commit && line.indexOf("|") !== -1) {
                                // get the file and changes
                                // i.e. backend/app.js                | 20 +++++++++-----------
                                line = line.replace(/ +/g, " ");
                                lineInfos = line.split("|");
                                if (lineInfos && lineInfos.length > 1) {
                                    file = lineInfos[0].trim();
                                    metricsLine = lineInfos[1].trim();
                                    metricsInfos = metricsLine.split(" ");
                                    if (metricsInfos && metricsInfos.length > 1) {
                                        addAndDeletes = metricsInfos[1].trim();
                                        len = addAndDeletes.length;
                                        lastPlusIdx = addAndDeletes.lastIndexOf("+");
                                        insertions = 0;
                                        deletions = 0;
                                        if (lastPlusIdx !== -1) {
                                            insertions = lastPlusIdx + 1;
                                            deletions = len - insertions;
                                        }
                                        else if (len > 0) {
                                            // all deletions
                                            deletions = len;
                                        }
                                        commit.changes[file] = {
                                            insertions: insertions,
                                            deletions: deletions
                                        };
                                    }
                                }
                            }
                        }
                    }
                    if (commit) {
                        // add it to the commits
                        commits.push(commit);
                    }
                    commit_batch_size = 15;
                    if (!(commits && commits.length > 0)) return [3 /*break*/, 9];
                    batchCommits = [];
                    i = 0;
                    _a.label = 4;
                case 4:
                    if (!(i < commits.length)) return [3 /*break*/, 7];
                    batchCommits.push(commits[i]);
                    if (!(i > 0 && i % commit_batch_size === 0)) return [3 /*break*/, 6];
                    commitData = {
                        commits: batchCommits,
                        identifier: identifier,
                        tag: tag,
                        branch: branch
                    };
                    return [4 /*yield*/, sendCommits(commitData)];
                case 5:
                    _a.sent();
                    batchCommits = [];
                    _a.label = 6;
                case 6:
                    i++;
                    return [3 /*break*/, 4];
                case 7:
                    if (!(batchCommits.length > 0)) return [3 /*break*/, 9];
                    commitData = {
                        commits: batchCommits,
                        identifier: identifier,
                        tag: tag,
                        branch: branch
                    };
                    return [4 /*yield*/, sendCommits(commitData)];
                case 8:
                    _a.sent();
                    batchCommits = [];
                    _a.label = 9;
                case 9:
                    // clear out the repo info in case they've added another one
                    myRepoInfo = [];
                    _a.label = 10;
                case 10: return [2 /*return*/];
            }
        });
    });
}
exports.getHistoricalCommits = getHistoricalCommits;
