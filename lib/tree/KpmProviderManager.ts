import {
  KpmItem,
  SessionSummary,
  FileChangeInfo,
  CommitChangeStats,
} from "../model/models";
import { isLoggedIn } from "../DataController";
import {
  humanizeMinutes,
  getWorkspaceFolders,
  getItem,
  isStatusBarTextVisible,
  logIt,
  findFirstActiveDirectoryOrWorkspaceDirectory,
} from "../Util";
import {
  getUncommitedChanges,
  getTodaysCommits,
  getLastCommitId,
  getRepoUrlLink,
} from "../repo/GitUtil";
import {
  WorkspaceFolder,
  TreeItem,
  TreeItemCollapsibleState,
  Command,
  commands,
  TreeView,
} from "vscode";
import { getFileChangeSummaryAsJson } from "../storage/FileChangeInfoSummaryData";
import { getSessionSummaryData } from "../storage/SessionSummaryData";
import { EventManager } from "../managers/EventManager";
import TeamMember from "../model/TeamMember";
import { getRepoContributors, getResourceInfo } from "../repo/KpmRepoManager";
import CodeTimeSummary from "../model/CodeTimeSummary";
import { getCodeTimeSummary } from "../storage/TimeSummaryData";

const numeral = require("numeral");
const moment = require("moment-timezone");
const path = require("path");

// this current path is in the out/lib. We need to find the resource files
// which are in out/resources
const resourcePath: string = path.join(
  __filename,
  "..",
  "..",
  "..",
  "resources"
);

let counter = 0;

export class KpmProviderManager {
  private static instance: KpmProviderManager;

  private _currentKeystrokeStats: SessionSummary = new SessionSummary();

  constructor() {
    //
  }

  static getInstance(): KpmProviderManager {
    if (!KpmProviderManager.instance) {
      KpmProviderManager.instance = new KpmProviderManager();
    }

    return KpmProviderManager.instance;
  }

  public setCurrentKeystrokeStats(keystrokeStats) {
    if (keystrokeStats) {
      // update the current stats
      Object.keys(keystrokeStats.source).forEach((key) => {
        const fileInfo: FileChangeInfo = keystrokeStats.source[key];
        this._currentKeystrokeStats.currentDayKeystrokes = fileInfo.keystrokes;
        this._currentKeystrokeStats.currentDayLinesAdded = fileInfo.linesAdded;
        this._currentKeystrokeStats.currentDayLinesRemoved =
          fileInfo.linesRemoved;
      });
    }
  }

  async getOptionsTreeParents(): Promise<KpmItem[]> {
    counter++;
    const space = counter % 2 === 0 ? "" : " ";
    const treeItems: KpmItem[] = [];
    const loggedIn: boolean = await isLoggedIn();

    if (!loggedIn) {
      const signupWithGoogle = `Sign up with Google${space}`;
      const googleSignupButton: KpmItem = this.getActionButton(
        signupWithGoogle,
        "",
        "codetime.googleLogin",
        "icons8-google.svg"
      );
      // treeItems.push(googleSignupButton);

      const signupWithGithub = `Sign up with GitHub${space}`;
      const githubSignupButton: KpmItem = this.getActionButton(
        signupWithGithub,
        "",
        "codetime.githubLogin",
        "icons8-github.svg"
      );
      treeItems.push(githubSignupButton);

      const signupWithEmail = `Sign up with email${space}`;
      const softwareSignupButton: KpmItem = this.getActionButton(
        signupWithEmail,
        "",
        "codetime.codeTimeLogin",
        "envelope.svg"
      );
      treeItems.push(softwareSignupButton);

      const dividerButton: KpmItem = this.getActionButton(
        "",
        "",
        "",
        "blue-line-96.png"
      );
      treeItems.push(dividerButton);
    } else {
      const connectedToInfo = this.getAuthTypeIconAndLabel();
      if (connectedToInfo) {
        const connectedToButton: KpmItem = this.getActionButton(
          connectedToInfo.label,
          connectedToInfo.tooltip,
          null,
          connectedToInfo.icon
        );
        treeItems.push(connectedToButton);
      }

      // show the web dashboard button
      treeItems.push(this.getWebViewDashboardButton());
    }

    // toggle status bar button
    let toggleStatusBarTextLabel = "Hide status bar metrics";
    let toggleStatusBarIcon = "visible.svg";
    if (!isStatusBarTextVisible()) {
      toggleStatusBarTextLabel = "Show status bar metrics";
    }

    const toggleStatusBarButton: KpmItem = this.getActionButton(
      toggleStatusBarTextLabel,
      "Toggle the Code Time status bar metrics text",
      "codetime.toggleStatusBar",
      toggleStatusBarIcon
    );
    treeItems.push(toggleStatusBarButton);

    // readme button
    const learnMoreLabel = `Learn more${space}`;
    const readmeButton: KpmItem = this.getActionButton(
      learnMoreLabel,
      "View the Code Time Readme to learn more",
      "codetime.displayReadme",
      "readme.svg"
    );
    treeItems.push(readmeButton);

    const feedbackButton: KpmItem = this.getActionButton(
      "Submit feedback",
      "Send us an email at cody@software.com",
      "codetime.sendFeedback",
      "message.svg"
    );
    treeItems.push(feedbackButton);

    // const submitReportButton: KpmItem = this.getActionButton(
    //     "Generate slack report",
    //     "",
    //     "codetime.generateSlackReport",
    //     "slack.svg"
    // );
    // treeItems.push(submitReportButton);

    const reportDividerButton: KpmItem = this.getActionButton(
      "",
      "",
      "",
      "blue-line-96.png"
    );
    treeItems.push(reportDividerButton);

    // codetime metrics editor dashboard
    treeItems.push(this.getCodeTimeDashboardButton());

    // generate codetime commit project data
    const commitSummitLabel = `View project summary${space}`;
    const generateProjectSummaryButton: KpmItem = this.getActionButton(
      commitSummitLabel,
      "",
      "codetime.generateProjectSummary",
      "folder.svg"
    );
    treeItems.push(generateProjectSummaryButton);

    // const addProjectNoteLabel: string = `Add a note${space}`;
    // const addProjectNoteButton: KpmItem = this.getActionButton(
    //     addProjectNoteLabel,
    //     "",
    //     "codetime.addProjectNote",
    //     "message.svg"
    // );
    // treeItems.push(addProjectNoteButton);

    return treeItems;
  }

  async getDailyMetricsTreeParents(): Promise<KpmItem[]> {
    const treeItems: KpmItem[] = [];

    const kpmTreeParents: KpmItem[] = await this.getKpmTreeParents();
    treeItems.push(...kpmTreeParents);
    const commitTreeParents: KpmItem[] = await this.getCommitTreeParents();
    treeItems.push(...commitTreeParents);

    return treeItems;
  }

  async getKpmTreeParents(): Promise<KpmItem[]> {
    const treeItems: KpmItem[] = [];
    const sessionSummaryData: SessionSummary = getSessionSummaryData();

    // get the session summary data
    const currentKeystrokesItems: KpmItem[] = this.getSessionSummaryItems(
      sessionSummaryData
    );

    // show the metrics per line
    treeItems.push(...currentKeystrokesItems);

    // show the files changed metric
    const fileChangeInfoMap = getFileChangeSummaryAsJson();
    const filesChanged = fileChangeInfoMap
      ? Object.keys(fileChangeInfoMap).length
      : 0;
    if (filesChanged > 0) {
      treeItems.push(
        this.buildTreeMetricItem(
          "Files changed",
          "Files changed today",
          `Today: ${filesChanged}`
        )
      );

      // get the file change info
      if (filesChanged) {
        // turn this into an array
        const fileChangeInfos = Object.keys(fileChangeInfoMap).map((key) => {
          return fileChangeInfoMap[key];
        });

        // Highest KPM
        const highKpmParent = this.buildHighestKpmFileItem(fileChangeInfos);
        if (highKpmParent) {
          treeItems.push(highKpmParent);
        }

        // Most Edited File
        const mostEditedFileItem: KpmItem = this.buildMostEditedFileItem(
          fileChangeInfos
        );
        if (mostEditedFileItem) {
          treeItems.push(mostEditedFileItem);
        }

        // Longest Code Time
        const longestCodeTimeParent = this.buildLongestFileCodeTime(
          fileChangeInfos
        );
        if (longestCodeTimeParent) {
          treeItems.push(longestCodeTimeParent);
        }
      }
    }

    return treeItems;
  }

  async getCommitTreeParents(): Promise<KpmItem[]> {
    const folders: WorkspaceFolder[] = getWorkspaceFolders();
    const treeItems: KpmItem[] = [];

    // show the git insertions and deletions
    if (folders && folders.length > 0) {
      const openChangesChildren: KpmItem[] = [];
      const committedChangesChildren: KpmItem[] = [];
      for (let i = 0; i < folders.length; i++) {
        const workspaceFolder = folders[i];
        const projectDir = workspaceFolder.uri.fsPath;
        const currentChagesSummary: CommitChangeStats = await getUncommitedChanges(
          projectDir
        );
        // get the folder name from the path
        const name = workspaceFolder.name;

        const openChangesMetrics: KpmItem[] = [];
        openChangesMetrics.push(
          this.buildMetricItem(
            "Insertion(s)",
            currentChagesSummary.insertions,
            "",
            "insertion.svg"
          )
        );
        openChangesMetrics.push(
          this.buildMetricItem(
            "Deletion(s)",
            currentChagesSummary.deletions,
            "",
            "deletion.svg"
          )
        );

        const openChangesFolder: KpmItem = this.buildParentItem(
          name,
          "",
          openChangesMetrics
        );

        openChangesChildren.push(openChangesFolder);

        const todaysChagesSummary: CommitChangeStats = await getTodaysCommits(
          projectDir
        );

        const committedChangesMetrics: KpmItem[] = [];
        committedChangesMetrics.push(
          this.buildMetricItem(
            "Insertion(s)",
            todaysChagesSummary.insertions,
            "Number of total insertions today",
            "insertion.svg"
          )
        );
        committedChangesMetrics.push(
          this.buildMetricItem(
            "Deletion(s)",
            todaysChagesSummary.deletions,
            "Number of total deletions today",
            "deletion.svg"
          )
        );

        committedChangesMetrics.push(
          this.buildMetricItem(
            "Commit(s)",
            todaysChagesSummary.commitCount,
            "Number of total commits today",
            "commit.svg"
          )
        );

        committedChangesMetrics.push(
          this.buildMetricItem(
            "Files changed",
            todaysChagesSummary.fileCount,
            "Number of total files changed today",
            "files.svg"
          )
        );

        const committedChangesFolder: KpmItem = this.buildParentItem(
          name,
          "",
          committedChangesMetrics
        );

        committedChangesChildren.push(committedChangesFolder);
      }

      const openChangesParent: KpmItem = this.buildParentItem(
        "Open changes",
        "Lines added and deleted in this repo that have not yet been committed.",
        openChangesChildren
      );
      treeItems.push(openChangesParent);

      const committedChangesParent: KpmItem = this.buildParentItem(
        "Committed today",
        "",
        committedChangesChildren
      );
      treeItems.push(committedChangesParent);
    }

    return treeItems;
  }

  async getTeamTreeParents(): Promise<KpmItem[]> {
    const treeItems: KpmItem[] = [];

    const activeRootPath = findFirstActiveDirectoryOrWorkspaceDirectory();

    // get team members
    const teamMembers: TeamMember[] = await getRepoContributors(
      activeRootPath,
      false
    );

    const remoteUrl: string = await getRepoUrlLink(activeRootPath);

    if (teamMembers && teamMembers.length) {
      // get the 1st one to get the identifier
      const titleItem: KpmItem = new KpmItem();
      titleItem.label = teamMembers[0].identifier;
      titleItem.icon = "icons8-github.svg";
      titleItem.command = "codetime.generateContributorSummary";
      titleItem.commandArgs = [teamMembers[0].identifier];
      titleItem.tooltip = "Generate contributor commit summary";
      treeItems.push(titleItem);

      for (let i = 0; i < teamMembers.length; i++) {
        const member: TeamMember = teamMembers[i];
        const item: KpmItem = new KpmItem();
        item.label = member.name;
        item.description = member.email;
        item.value = member.identifier;

        // get their last commit
        const lastCommitInfo: any = await getLastCommitId(
          activeRootPath,
          member.email
        );
        if (lastCommitInfo && Object.keys(lastCommitInfo).length) {
          // add this as child
          const commitItem: KpmItem = new KpmItem();
          commitItem.label = lastCommitInfo.comment;
          commitItem.command = "codetime.launchCommitUrl";
          commitItem.commandArgs = [
            `${remoteUrl}/commit/${lastCommitInfo.commitId}`,
          ];
          item.children = [commitItem];
        }

        // check to see if this email is in the registered list
        item.contextValue = "unregistered-member";
        item.icon = "unregistered-user.svg";
        treeItems.push(item);
      }
    }

    return treeItems;
  }

  getCodyConnectButton(): KpmItem {
    const item: KpmItem = this.getActionButton(
      "See advanced metrics",
      `To see your coding data in Code Time, please log in to your account`,
      "codetime.codeTimeLogin",
      "paw.svg",
      "TreeViewLogin"
    );
    return item;
  }

  getWebViewDashboardButton(): KpmItem {
    const name = getItem("name");
    const loggedInMsg = name ? ` Connected as ${name}` : "";
    const item: KpmItem = this.getActionButton(
      "See advanced metrics",
      `See rich data visualizations in the web app.${loggedInMsg}`,
      "codetime.softwareKpmDashboard",
      "paw.svg",
      "TreeViewLaunchWebDashboard"
    );
    return item;
  }

  getCodeTimeDashboardButton(): KpmItem {
    const item: KpmItem = this.getActionButton(
      "View summary",
      "View your latest coding metrics right here in your editor",
      "codetime.codeTimeMetrics",
      "dashboard.svg",
      "TreeViewLaunchDashboard"
    );
    return item;
  }

  getAuthTypeIconAndLabel() {
    const authType = getItem("authType");
    const name = getItem("name");
    let tooltip = name ? `Connected as ${name}` : "";
    if (authType === "software") {
      return {
        icon: "envelope.svg",
        label: "Connected using email",
        tooltip,
      };
    } else if (authType === "google") {
      return {
        icon: "icons8-google.svg",
        label: "Connected using Google",
        tooltip,
      };
    } else if (authType === "github") {
      return {
        icon: "icons8-github.svg",
        label: "Connected using GitHub",
        tooltip,
      };
    }
    return null;
  }

  getActionButton(
    label,
    tooltip,
    command,
    icon = null,
    eventDescription: string = null
  ): KpmItem {
    const item: KpmItem = new KpmItem();
    item.tooltip = tooltip;
    item.label = label;
    item.id = label;
    item.command = command;
    item.icon = icon;
    item.contextValue = "action_button";
    item.eventDescription = eventDescription;
    return item;
  }

  getSessionSummaryItems(data: SessionSummary): KpmItem[] {
    const items: KpmItem[] = [];
    let values = [];

    // get the editor and session time
    const codeTimeSummary: CodeTimeSummary = getCodeTimeSummary();

    const wallClktimeStr = humanizeMinutes(codeTimeSummary.codeTimeMinutes);
    values.push({ label: `Today: ${wallClktimeStr}`, icon: "rocket.svg" });

    items.push(
      this.buildActivityComparisonNodes(
        "Code time",
        "Code time: total time you have spent in your editor today.",
        values,
        TreeItemCollapsibleState.Expanded
      )
    );

    const dayStr = moment().format("ddd");

    values = [];
    const dayMinutesStr = humanizeMinutes(
      codeTimeSummary.activeCodeTimeMinutes
    );
    values.push({ label: `Today: ${dayMinutesStr}`, icon: "rocket.svg" });
    const avgMin = humanizeMinutes(data.averageDailyMinutes);
    const activityLightningBolt =
      codeTimeSummary.activeCodeTimeMinutes > data.averageDailyMinutes
        ? "bolt.svg"
        : "bolt-grey.svg";
    values.push({
      label: `Your average (${dayStr}): ${avgMin}`,
      icon: activityLightningBolt,
    });
    const globalMinutesStr = humanizeMinutes(data.globalAverageSeconds / 60);
    values.push({
      label: `Global average (${dayStr}): ${globalMinutesStr}`,
      icon: "global-grey.svg",
    });
    items.push(
      this.buildActivityComparisonNodes(
        "Active code time",
        "Active code time: total time you have been typing in your editor today.",
        values,
        TreeItemCollapsibleState.Expanded
      )
    );

    values = [];
    const currLinesAdded =
      this._currentKeystrokeStats.currentDayLinesAdded +
      data.currentDayLinesAdded;
    const linesAdded = numeral(currLinesAdded).format("0 a");
    values.push({ label: `Today: ${linesAdded}`, icon: "rocket.svg" });
    const userLinesAddedAvg = numeral(data.averageLinesAdded).format("0 a");
    const linesAddedLightningBolt =
      data.currentDayLinesAdded > data.averageLinesAdded
        ? "bolt.svg"
        : "bolt-grey.svg";
    values.push({
      label: `Your average (${dayStr}): ${userLinesAddedAvg}`,
      icon: linesAddedLightningBolt,
    });
    const globalLinesAdded = numeral(data.globalAverageLinesAdded).format(
      "0 a"
    );
    values.push({
      label: `Global average (${dayStr}): ${globalLinesAdded}`,
      icon: "global-grey.svg",
    });
    items.push(this.buildActivityComparisonNodes("Lines added", "", values));

    values = [];
    const currLinesRemoved =
      this._currentKeystrokeStats.currentDayLinesRemoved +
      data.currentDayLinesRemoved;
    const linesRemoved = numeral(currLinesRemoved).format("0 a");
    values.push({ label: `Today: ${linesRemoved}`, icon: "rocket.svg" });
    const userLinesRemovedAvg = numeral(data.averageLinesRemoved).format("0 a");
    const linesRemovedLightningBolt =
      data.currentDayLinesRemoved > data.averageLinesRemoved
        ? "bolt.svg"
        : "bolt-grey.svg";
    values.push({
      label: `Your average (${dayStr}): ${userLinesRemovedAvg}`,
      icon: linesRemovedLightningBolt,
    });
    const globalLinesRemoved = numeral(data.globalAverageLinesRemoved).format(
      "0 a"
    );
    values.push({
      label: `Global average (${dayStr}): ${globalLinesRemoved}`,
      icon: "global-grey.svg",
    });
    items.push(this.buildActivityComparisonNodes("Lines removed", "", values));

    values = [];
    const currKeystrokes =
      this._currentKeystrokeStats.currentDayKeystrokes +
      data.currentDayKeystrokes;
    const keystrokes = numeral(currKeystrokes).format("0 a");
    values.push({ label: `Today: ${keystrokes}`, icon: "rocket.svg" });
    const userKeystrokesAvg = numeral(data.averageDailyKeystrokes).format(
      "0 a"
    );
    const keystrokesLightningBolt =
      data.currentDayKeystrokes > data.averageDailyKeystrokes
        ? "bolt.svg"
        : "bolt-grey.svg";
    values.push({
      label: `Your average (${dayStr}): ${userKeystrokesAvg}`,
      icon: keystrokesLightningBolt,
    });
    const globalKeystrokes = numeral(data.globalAverageDailyKeystrokes).format(
      "0 a"
    );
    values.push({
      label: `Global average (${dayStr}): ${globalKeystrokes}`,
      icon: "global-grey.svg",
    });
    items.push(this.buildActivityComparisonNodes("Keystrokes", "", values));

    return items;
  }

  buildMetricItem(label, value, tooltip = "", icon = null) {
    const item: KpmItem = new KpmItem();
    item.label = `${label}: ${value}`;
    item.id = `${label}_metric`;
    item.contextValue = "metric_item";
    item.tooltip = tooltip;
    item.icon = icon;
    return item;
  }

  buildTreeMetricItem(
    label,
    tooltip,
    value,
    icon = null,
    collapsibleState: TreeItemCollapsibleState = null
  ) {
    const childItem = this.buildMessageItem(value);
    const parentItem = this.buildMessageItem(label, tooltip, icon);
    if (collapsibleState) {
      parentItem.initialCollapsibleState = collapsibleState;
    }
    parentItem.children = [childItem];
    return parentItem;
  }

  buildActivityComparisonNodes(
    label,
    tooltip,
    values,
    collapsibleState: TreeItemCollapsibleState = null
  ) {
    const parent: KpmItem = this.buildMessageItem(label, tooltip);
    if (collapsibleState) {
      parent.initialCollapsibleState = collapsibleState;
    }
    values.forEach((element) => {
      const label = element.label || "";
      const tooltip = element.tooltip || "";
      const icon = element.icon || "";
      const child = this.buildMessageItem(label, tooltip, icon);
      parent.children.push(child);
    });
    return parent;
  }

  buildMessageItem(
    label,
    tooltip = "",
    icon = null,
    command = null,
    commandArgs = null
  ) {
    label = label.toString();
    const item: KpmItem = new KpmItem();
    item.label = label;
    item.tooltip = tooltip;
    item.icon = icon;
    item.command = command;
    item.commandArgs = commandArgs;
    item.id = `${label}_message`;
    item.contextValue = "message_item";
    item.eventDescription = null;
    return item;
  }

  buildTitleItem(label, icon = null) {
    const item: KpmItem = new KpmItem();
    item.label = label;
    item.id = `${label}_title`;
    item.contextValue = "title_item";
    item.icon = icon;
    return item;
  }

  buildParentItem(label: string, tooltip: string, children: KpmItem[]) {
    const item: KpmItem = new KpmItem();
    item.label = label;
    item.tooltip = tooltip;
    item.id = `${label}_title`;
    item.contextValue = "title_item";
    item.children = children;
    item.eventDescription = null;
    return item;
  }

  buildFileItem(fileChangeInfo: FileChangeInfo) {
    const item: KpmItem = new KpmItem();
    item.command = "codetime.openFileInEditor";
    item.commandArgs = [fileChangeInfo.fsPath];
    item.label = fileChangeInfo.name;
    item.tooltip = `Click to open ${fileChangeInfo.fsPath}`;
    item.id = `${fileChangeInfo.name}_file`;
    item.contextValue = "file_item";
    item.icon = "readme.svg";
    return item;
  }

  buildMostEditedFileItem(fileChangeInfos: FileChangeInfo[]): KpmItem {
    if (!fileChangeInfos || fileChangeInfos.length === 0) {
      return null;
    }
    // Most Edited File
    const sortedArray = fileChangeInfos.sort(
      (a: FileChangeInfo, b: FileChangeInfo) => b.keystrokes - a.keystrokes
    );
    const mostEditedChildren: KpmItem[] = [];
    const len = Math.min(3, sortedArray.length);
    for (let i = 0; i < len; i++) {
      const fileName = sortedArray[i].name;
      const keystrokes = sortedArray[i].keystrokes || 0;
      const keystrokesStr = numeral(keystrokes).format("0 a");
      const label = `${fileName} | ${keystrokesStr}`;
      const messageItem = this.buildMessageItem(
        label,
        "",
        null,
        "codetime.openFileInEditor",
        [sortedArray[i].fsPath]
      );
      mostEditedChildren.push(messageItem);
    }
    const mostEditedParent = this.buildParentItem(
      "Top files by keystrokes",
      "",
      mostEditedChildren
    );

    return mostEditedParent;
  }

  buildHighestKpmFileItem(fileChangeInfos: FileChangeInfo[]): KpmItem {
    if (!fileChangeInfos || fileChangeInfos.length === 0) {
      return null;
    }
    // Highest KPM
    const sortedArray = fileChangeInfos.sort(
      (a: FileChangeInfo, b: FileChangeInfo) => b.kpm - a.kpm
    );
    const highKpmChildren: KpmItem[] = [];
    const len = Math.min(3, sortedArray.length);
    for (let i = 0; i < len; i++) {
      const fileName = sortedArray[i].name;
      const kpm = sortedArray[i].kpm || 0;
      const kpmStr = kpm.toFixed(2);
      const label = `${fileName} | ${kpmStr}`;
      const messageItem = this.buildMessageItem(
        label,
        "",
        null,
        "codetime.openFileInEditor",
        [sortedArray[i].fsPath]
      );
      highKpmChildren.push(messageItem);
    }
    const highKpmParent = this.buildParentItem(
      "Top files by KPM",
      "Top files by KPM (keystrokes per minute)",
      highKpmChildren
    );
    return highKpmParent;
  }

  buildLongestFileCodeTime(fileChangeInfos: FileChangeInfo[]): KpmItem {
    if (!fileChangeInfos || fileChangeInfos.length === 0) {
      return null;
    }
    // Longest Code Time
    const sortedArray = fileChangeInfos.sort(
      (a: FileChangeInfo, b: FileChangeInfo) =>
        b.duration_seconds - a.duration_seconds
    );
    const longestCodeTimeChildren: KpmItem[] = [];
    const len = Math.min(3, sortedArray.length);
    for (let i = 0; i < len; i++) {
      const fileName = sortedArray[i].name;
      const minutes = sortedArray[i].duration_seconds || 0;
      const duration_minutes = minutes > 0 ? minutes / 60 : 0;
      const codeHours = humanizeMinutes(duration_minutes);
      const label = `${fileName} | ${codeHours}`;
      const messageItem = this.buildMessageItem(
        label,
        "",
        null,
        "codetime.openFileInEditor",
        [sortedArray[i].fsPath]
      );
      longestCodeTimeChildren.push(messageItem);
    }
    const longestCodeTimeParent = this.buildParentItem(
      "Top files by code time",
      "",
      longestCodeTimeChildren
    );
    return longestCodeTimeParent;
  }
}

/**
 * The TreeItem contains the "contextValue", which is represented as the "viewItem"
 * from within the package.json when determining if there should be decoracted context
 * based on that value.
 */
export class KpmTreeItem extends TreeItem {
  constructor(
    private readonly treeItem: KpmItem,
    public readonly collapsibleState: TreeItemCollapsibleState,
    public readonly command?: Command
  ) {
    super(treeItem.label, collapsibleState);

    const { lightPath, darkPath } = getTreeItemIcon(treeItem);

    if (treeItem.description) {
      this.description = treeItem.description;
    }

    if (lightPath && darkPath) {
      this.iconPath.light = lightPath;
      this.iconPath.dark = darkPath;
    } else {
      // no matching tag, remove the tree item icon path
      delete this.iconPath;
    }

    this.contextValue = getTreeItemContextValue(treeItem);
  }

  get tooltip(): string {
    if (!this.treeItem) {
      return "";
    }
    if (this.treeItem.tooltip) {
      return this.treeItem.tooltip;
    } else {
      return this.treeItem.label;
    }
  }

  iconPath = {
    light: "",
    dark: "",
  };

  contextValue = "treeItem";
}

function getTreeItemIcon(treeItem: KpmItem): any {
  const iconName = treeItem.icon;
  const lightPath =
    iconName && treeItem.children.length === 0
      ? path.join(resourcePath, "light", iconName)
      : null;
  const darkPath =
    iconName && treeItem.children.length === 0
      ? path.join(resourcePath, "dark", iconName)
      : null;
  return { lightPath, darkPath };
}

function getTreeItemContextValue(treeItem: KpmItem): string {
  if (treeItem.contextValue) {
    return treeItem.contextValue;
  }
  if (treeItem.children.length) {
    return "parent";
  }
  return "child";
}

export const handleKpmChangeSelection = (
  view: TreeView<KpmItem>,
  item: KpmItem
) => {
  if (item.command) {
    const args = item.commandArgs || null;
    if (args) {
      commands.executeCommand(item.command, ...args);
    } else {
      // run the command
      commands.executeCommand(item.command);
    }

    // send event types
    if (item.eventDescription) {
      EventManager.getInstance().createCodeTimeEvent(
        "mouse",
        "click",
        item.eventDescription
      );
    }
  }

  // deselect it
  try {
    // re-select the track without focus
    view.reveal(item, {
      focus: false,
      select: false,
    });
  } catch (err) {
    logIt(`Unable to deselect track: ${err.message}`);
  }
};
