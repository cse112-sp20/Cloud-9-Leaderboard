"use strict";
//
// PLEASE DO NOT MODIFY / DELETE UNLESS YOU KNOW WHAT YOU ARE DOING
//
// This file is providing the test runner to use when running extension tests.
// By default the test runner in use is Mocha based.
//
// You can provide your own test runner if you want to override it by exporting
// a function run(testRoot: string, clb: (error:Error) => void) that the extension
// host can call to run the tests. The test runner is expected to use console.log
// to report the results back to the caller. When the tests are finished, return
// a possible error to the callback or null if none.
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
//import * as testRunner from "vscode/lib/testrunner";
// // You can directly control Mocha options by uncommenting the following lines
// // See https://github.com/mochajs/mocha/wiki/Using-mocha-programmatically#set-options for more info
// testRunner.configure({
//     ui: "tdd",
//     useColors: true // colored output from test results,
// });
//module.exports = testRunner;
const path = require("path");
const vscode_test_1 = require("vscode-test");
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("hi");
        try {
            // The folder containing the Extension Manifest package.json
            // Passed to `--extensionDevelopmentPath`
            const extensionDevelopmentPath = path.resolve(__dirname, '../');
            // The path to the extension test runner script
            // Passed to --extensionTestsPath
            const extensionTestsPath = path.resolve(__dirname, './index.js');
            // Download VS Code, unzip it and run the integration test
            yield vscode_test_1.runTests({ extensionDevelopmentPath, extensionTestsPath });
        }
        catch (err) {
            console.error(err);
            console.error('Failed to run tests');
            process.exit(1);
        }
    });
}
main();
//# sourceMappingURL=runTest.js.map