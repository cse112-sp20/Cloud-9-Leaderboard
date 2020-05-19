"use strict";
exports.__esModule = true;
exports.saveFileChangeInfoToDisk = exports.getFileChangeSummaryAsJson = exports.clearFileChangeInfoSummaryData = exports.getFileChangeSummaryFile = void 0;
var Util_1 = require("../Util");
var CacheManager_1 = require("../cache/CacheManager");
var fs = require("fs");
var cacheMgr = CacheManager_1.CacheManager.getInstance();
function getFileChangeSummaryFile() {
    var file = Util_1.getSoftwareDir();
    if (Util_1.isWindows()) {
        file += "\\fileChangeSummary.json";
    }
    else {
        file += "/fileChangeSummary.json";
    }
    return file;
}
exports.getFileChangeSummaryFile = getFileChangeSummaryFile;
function clearFileChangeInfoSummaryData() {
    saveFileChangeInfoToDisk({});
}
exports.clearFileChangeInfoSummaryData = clearFileChangeInfoSummaryData;
// returns a map of file change info
// {fileName => FileChangeInfo, fileName => FileChangeInfo}
function getFileChangeSummaryAsJson() {
    var fileChangeInfoMap = cacheMgr.get("fileChangeSummary");
    if (!fileChangeInfoMap) {
        var file = getFileChangeSummaryFile();
        fileChangeInfoMap = Util_1.getFileDataAsJson(file);
        if (!fileChangeInfoMap) {
            fileChangeInfoMap = {};
        }
        else {
            cacheMgr.set("fileChangeSummary", fileChangeInfoMap);
        }
    }
    return fileChangeInfoMap;
}
exports.getFileChangeSummaryAsJson = getFileChangeSummaryAsJson;
function saveFileChangeInfoToDisk(fileChangeInfoData) {
    var file = getFileChangeSummaryFile();
    if (fileChangeInfoData) {
        try {
            var content = JSON.stringify(fileChangeInfoData, null, 4);
            fs.writeFileSync(file, content, function (err) {
                if (err)
                    Util_1.logIt("Deployer: Error writing session summary data: " + err.message);
            });
            // update the cache
            if (fileChangeInfoData) {
                cacheMgr.set("fileChangeSummary", fileChangeInfoData);
            }
        }
        catch (e) {
            //
        }
    }
}
exports.saveFileChangeInfoToDisk = saveFileChangeInfoToDisk;
