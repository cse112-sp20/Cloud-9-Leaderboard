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
exports.createCommands = void 0;
const vscode_1 = require("vscode");
const DataController_1 = require("./DataController");
const MenuManager_1 = require("./menu/MenuManager");
const Util_1 = require("./Util");
const ProjectCommitManager_1 = require("./menu/ProjectCommitManager");
const ReportManager_1 = require("./menu/ReportManager");
const FileManager_1 = require("./managers/FileManager");
const Leaderboard_1 = require("../src/util/Leaderboard");
const Authentication_1 = require("../src/util/Authentication");
const Team_1 = require("../src/util/Team");
const PersonalStats_1 = require("../src/util/PersonalStats");
function createCommands(kpmController) {
    let cmds = [];
    cmds.push(kpmController);
    // MENU TREE: INIT
    // TEAM TREE: INVITE MEMBER
    cmds.push(vscode_1.commands.registerCommand('codetime.inviteTeamMember', (item) => __awaiter(this, void 0, void 0, function* () {
        // the identifier will be in the value
        const identifier = item.value;
        // email will be the description
        const email = item.description;
        const name = item.label;
        const msg = `Send invitation to ${email}?`;
        const selection = yield vscode_1.window.showInformationMessage(msg, { modal: true }, ...['YES']);
        if (selection && selection === 'YES') {
            DataController_1.sendTeamInvite(identifier, [email]);
        }
    })));
    // SEND OFFLINE DATA
    cmds.push(vscode_1.commands.registerCommand('codetime.sendOfflineData', () => {
        FileManager_1.sendOfflineData();
    }));
    // SHOW ASCII DASHBOARD
    cmds.push(vscode_1.commands.registerCommand('codetime.softwareKpmDashboard', () => {
        DataController_1.handleKpmClickedEvent();
    }));
    // OPEN SPECIFIED FILE IN EDITOR
    cmds.push(vscode_1.commands.registerCommand('codetime.openFileInEditor', (file) => {
        Util_1.openFileInEditor(file);
    }));
    // REFRESH MENU
    cmds.push(vscode_1.commands.registerCommand('codetime.toggleStatusBar', () => {
        Util_1.toggleStatusBar();
        setTimeout(() => {
            vscode_1.commands.executeCommand('codetime.refreshCodetimeMenuTree');
        }, 500);
    }));
    // LAUNCH EMAIL LOGIN
    cmds.push(vscode_1.commands.registerCommand('codetime.codeTimeLogin', () => {
        Util_1.launchLogin('software');
    }));
    // LAUNCH GOOGLE LOGIN
    cmds.push(vscode_1.commands.registerCommand('codetime.googleLogin', () => {
        Util_1.launchLogin('google');
    }));
    // LAUNCH GITHUB LOGIN
    cmds.push(vscode_1.commands.registerCommand('codetime.githubLogin', () => {
        Util_1.launchLogin('github');
    }));
    // DISPLAY README MD
    cmds.push(vscode_1.commands.registerCommand('codetime.displayReadme', () => {
        Util_1.displayReadmeIfNotExists(true /*override*/);
    }));
    // DISPLAY CODE TIME METRICS REPORT
    cmds.push(vscode_1.commands.registerCommand('codetime.codeTimeMetrics', () => {
        MenuManager_1.displayCodeTimeMetricsDashboard();
    }));
    /*
     * CLOUD 9 LEADERBOARD COMMAND
     */
    cmds.push(vscode_1.commands.registerCommand('cloud9.leaderboard', () => {
        Leaderboard_1.displayLeaderboard();
    }));
    // Cloud9: command used to see personal stats by date
    cmds.push(vscode_1.commands.registerCommand('cloud9.personalStats', () => {
        PersonalStats_1.displayPersonalStats();
    }));
    // Cloud9: command used to view private team leaderboard
    cmds.push(vscode_1.commands.registerCommand('cloud9.teamLeaderboard', () => {
        Leaderboard_1.displayTeamLeaderboard();
    }));
    // Cloud9: command used to create a new team
    cmds.push(vscode_1.commands.registerCommand('cloud9.createTeam', () => {
        console.log('Cloud9: CREATE A NEW TEAM');
        Team_1.createAndJoinTeam();
    }));
    // Cloud9: command used to retrieve team code
    cmds.push(vscode_1.commands.registerCommand('cloud9.getTeamInfo', () => {
        console.log('Cloud9: GET TEAM NAME AND ID');
        Team_1.getTeamInfo();
    }));
    //password recovery 
    cmds.push(vscode_1.commands.registerCommand('cloud9.resetPassword', () => {
        console.log('Cloud9: PASSWORD RECOVERY--TO BE IMPLEMENTED');
        //doing nothing rn
    }));
    cmds.push(vscode_1.commands.registerCommand('cloud9.debugClearTeamNameAndId', () => {
        console.log('cloud9: CLEAR CACHED TEAM NAME AND ID');
        Team_1.removeTeamNameAndId();
    }));
    // Cloud9: command used to join a new team
    cmds.push(vscode_1.commands.registerCommand('cloud9.joinTeam', () => {
        console.log('Cloud9: JOIN A TEAM');
        Team_1.joinTeam();
    }));
    // Cloud9: command used to clear the cached id (for debugging and testing only)
    cmds.push(vscode_1.commands.registerCommand('cloud9.debugClearUserId', () => {
        console.log('Cloud9: DEBUG CLEAR CACHED ID');
        Authentication_1.clearCachedUserId();
    }));
    // DISPLAY PROJECT METRICS REPORT
    cmds.push(vscode_1.commands.registerCommand('codetime.generateProjectSummary', () => {
        ProjectCommitManager_1.ProjectCommitManager.getInstance().launchProjectCommitMenuFlow();
    }));
    // DISPLAY REPO COMMIT CONTRIBUTOR REPORT
    cmds.push(vscode_1.commands.registerCommand('codetime.generateContributorSummary', (identifier) => {
        ReportManager_1.displayProjectContributorCommitsDashboard(identifier);
    }));
    // LAUNCH COMMIT URL
    cmds.push(vscode_1.commands.registerCommand('codetime.launchCommitUrl', (commitLink) => {
        Util_1.launchWebUrl(commitLink);
    }));
    // DISPLAY PALETTE MENU
    cmds.push(vscode_1.commands.registerCommand('codetime.softwarePaletteMenu', () => {
        MenuManager_1.showMenuOptions();
    }));
    cmds.push(vscode_1.commands.registerCommand('codetime.viewSoftwareTop40', () => {
        Util_1.launchWebUrl('https://api.software.com/music/top40');
    }));
    cmds.push(vscode_1.commands.registerCommand('codetime.codeTimeStatusToggle', () => {
        Util_1.handleCodeTimeStatusToggle();
    }));
    cmds.push(vscode_1.commands.registerCommand('codetime.sendFeedback', () => {
        Util_1.launchWebUrl('mailto:cody@software.com');
    }));
    cmds.push(vscode_1.workspace.onDidChangeConfiguration((e) => DataController_1.updatePreferences()));
    return vscode_1.Disposable.from(...cmds);
}
exports.createCommands = createCommands;
//# sourceMappingURL=command-helper.js.map