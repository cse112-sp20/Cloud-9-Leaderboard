# cloud9 README

This is the README for "cloud9", an extension building on top of open source of
code time extension which aim to track developers productivity.

# Developer guide

### Things to remember:

- **Never create a branch off of `dev`!** <br/> **Never merge `dev` into any
  branch!**
  - `dev` contains many changes that, in nearly all cases, do not belong on any
    other branch.
- Create small and specific branches.
- Constantly pull your branch's base branch to stay up to date with other
  people's changes.
  - You can do this by:
    1. Checking out your branch's base branch: <br/>
       `git checkout [your branch's base branch]`
    2. Pulling any new changes from the remote: <br/> `git pull`
    3. Returning to your branch (checkout your branch again): <br/>
       `git checkout [your branch]`
    4. Merging your branch's base branch _into_ your branch: <br/>
       `git merge [your branch's base branch]`
- Test your code on the `dev` branch before creating a pull request to merge
  your code into your branch's base branch.
  - `dev` will constantly be pulling from `master`, so testing your code on
    `dev` should prevent bugs from getting on `master`.
  - Once you have tested your code on the `dev` branch, create a pull request
    (PR) to merge your branch into its base branch.
    - Who and how many people you send it to should depend on the significance
      of your code.
    - Write a short (1-4 sentences) description of your PR.
    - You can send your PRs to other people through Slack.

---

### Branches:

- What is a branch in git?
  - A branch is _like_ a copy of the repository from a specific moment in time
    (a specific commit).
  - Learn more: https://git-scm.com/book/en/v1/Git-Branching-What-a-Branch-Is
- What is the purpose of a branch?
  - Branches make collaboration organized and simple. By using branches,
    multiple people can work independently on related code.
  - Branches allow us to easily keep track of changes that we make.
- When should I create a branch?
  - Create a branch for any change that you want to make.
  - Create branches that will have a short lifespan that are used for a single
    particular feature or specific focus.
    - Small and specific branches are much easier to maintain, easier to merge,
      and easier to review.
    - Learn more:
      https://git-scm.com/book/en/v2/Git-Branching-Branching-Workflows
      - Read the "Topic Branches" section.

### Development workflow and branch lifecycle:

1. You want to make a change to the codebase.
2. Decide which branch you want to contribute to. This branch is going to be the
   base branch of the branch that you are about to create.
   - The base branch is the branch that you want to create your branch off of.
   - The base branch is the branch that you will later merge (or create a PR to
     merge) your branch into.
   - If the code you are writing is only dependent on the code in `master`, then
     `master` is your base branch. Otherwise, if the code you are writing is
     dependent on code that is not in `master`, then your branch's base branch
     is going to be the branch that contains the code that your branch depends
     on.
   - `dev` should never be your base branch. `dev` contains many changes that,
     in nearly all cases, do not belong on any other branch.
3. Create a new branch off of the base branch.
4. Make changes to your branch.
5. Finish making changes to your branch.
6. If possible, merge your branch into `dev` and ensure that everything works.
   - You do not need to create a PR to do this.
   - If you run into merge conflicts, _carefully_ resolve them. If you are
     unsure how to resolve them, ask someone else for help. Do not resolve merge
     conflicts if you do not understand how to resolve merge conflicts or if you
     do not understand the code that you are deleting.
7. Merge your branch into your branch's base branch.
   - Depending on what your branch's base branch is, you may or may not need to
     create a PR to merge your branch into its base branch.
     - If you want to merge your branch into `master`, you must create a PR to
       do this.
   - Make sure that you merge your branch _into_ its base branch:
     - Merge \<your branch> into \<your branch's base branch> <br/> Merge \<your
       branch> → \<your branch's base branch>
8. Your branch has served its purpose and it has been merged into another
   branch. Your branch should not be used anymore.
   - To enforce this, after branches are merged, they are deleted from the
     remote repository.

---

### Git commands:

| Command                                              | Description                                             |
| ---------------------------------------------------- | ------------------------------------------------------- |
| `git status`                                         | Check status                                            |
| `git add [file-name.txt]`                            | Add a file to the staging area                          |
| `git add -A`                                         | Add all new and changed files to the staging area       |
| `git commit`                                         | Commit changes - must enter message in prompt           |
| `git commit -m "[commit message]"`                   | Commit changes with inline message                      |
| `git rm -r [file-name.txt]`                          | Remove a file (or folder)                               |
| `git branch`                                         | List branches (the asterisk denotes the current branch) |
| `git branch -a`                                      | List all branches (local and remote)                    |
| `git branch [branch name]`                           | Create a new branch                                     |
| `git branch -d [branch name]`                        | Delete a branch                                         |
| `git checkout -b [branch name]`                      | Create a new branch and switch to it                    |
| `git checkout [branch name]`                         | Checkout a branch (local or remote branch)              |
| `git checkout -b [branch name] origin/[branch name]` | Clone a remote branch and switch to it                  |
| `git checkout [branch name]`                         | Switch to a branch                                      |
| `git merge [branch name]`                            | Merge a branch into the active branch                   |
| `git merge [source branch] [target branch]`          | Merge a branch into a target branch                     |
| `git stash`                                          | Stash changes in a dirty working directory              |
| `git push`                                           | Push changes to remote repository                       |
| `git pull`                                           | Update local repository to the newest commit            |
| `git log`                                            | View commit history                                     |
| `git log --summary`                                  | View detailed commit history                            |
| `git diff [source branch] [target branch]`           | Show diff of two branches                               |

## Features

Describe specific features of your extension including screenshots of your
extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project
workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to
> show off your extension! We recommend short, focused animations that are easy
> to follow.

## Requirements

If you have any requirements or dependencies, add a section describing those and
how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the
`contributes.configuration` extension point.

For example:

This extension contributes the following settings:

- `myExtension.enable`: enable/disable this extension
- `myExtension.thing`: set to `blah` to do something

## Known Issues

Calling out known issues can help limit users opening duplicate issues against
your extension.

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Working with Markdown

**Note:** You can author your README using Visual Studio Code. Here are some
useful editor keyboard shortcuts:

- Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux)
- Toggle preview (`Shift+CMD+V` on macOS or `Shift+Ctrl+V` on Windows and Linux)
- Press `Ctrl+Space` (Windows, Linux) or `Cmd+Space` (macOS) to see a list of
  Markdown snippets

### For more information

- [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**

<br />

<h1 align="center">
  <img src="https://swdc-vscode.s3-us-west-1.amazonaws.com/software-paw.png" width="30px" />
  Code Time
  <br />
  &nbsp
</h1>

<br />

<p align="center"><a href="https://www.software.com/code-time">Code Time</a> is an open source plugin for automatic programming metrics and time tracking. 
</p>

<br />

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=softwaredotcom.swdc-vscode">
    <img alt="Marketplace" src="https://vsmarketplacebadge.apphb.com/version-short/softwaredotcom.swdc-vscode.svg"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=softwaredotcom.swdc-vscode">
    <img alt="Installs" src="https://vsmarketplacebadge.apphb.com/installs-short/softwaredotcom.swdc-vscode.svg"></a>
  <a href="https://marketplace.visualstudio.com/items?itemName=softwaredotcom.swdc-vscode">
    <img alt="Rating" src="https://vsmarketplacebadge.apphb.com/rating-short/softwaredotcom.swdc-vscode.svg"></a>
  <a href="https://aka.ms/vsls">
    <img alt="Live Share enabled" src="https://aka.ms/vsls-badge"></a>
</p>

<br />

<p align="center" style="margin: 0 0">
  <img src="https://swdc-vscode.s3-us-west-1.amazonaws.com/code-time-features.png" alt="Code Time features" />
</p>

## Getting started

**1. Create your web account**

<p align="center" style="margin: 0 10%">
  <img src="https://swdc-vscode.s3-us-west-1.amazonaws.com/login-prompt.png" alt="Code Time for VS Code login prompt" />
</p>

The Code Time web app has data visualizations and settings you can customize,
such as your work hours and rates per project for advanced time tracking. You
can also connect Google Calendar to visualize your Code Time vs. meetings in a
single calendar.

You can connect multiple code editors on multiple devices using the same email
account.

**2. Track your progress during the day**

<p align="center" style="margin: 0 10%">
  <img src="https://swdc-vscode.s3-us-west-1.amazonaws.com/status-bar.png" alt="Code Time for VS Code status bar" />
</p>

Your status bar shows you in real-time how many hours and minutes you code each
day. A rocket will appear if your active code time exceeds your daily average on
this day of the week.

**3. Check out your coding activity**

To see an overview of your coding activity and project metrics, open the **Code
Time panel** by clicking on the Code Time icon in your side bar.

<p align="center" style="margin: 0 10%">
  <img src="https://swdc-vscode.s3-us-west-1.amazonaws.com/side-bar.png" alt="Code Time for VS Code side bar" />
</p>

In your **Daily Metrics**, your _code time_ is the total time you have spent in
your editor today. Your _active code time_ is the total time you have been
typing in your editor today. Each metric shows how you compare today to your
average and the global average. Each average is calculated by day of week over
the last 90 days (e.g. a Friday average is an average of all previous Fridays).

You can also see your top files today by KPM (keystrokes per minute),
keystrokes, and code time.

If you have a Git repository open, **Contributors** provides a breakdown of
contributors to the current open project and their latest commits.

**4. Generate your Code Time summary**

At the end of your first day, open Code Time in your side bar and click _View
summary_ to open your dashboard in a new editor tab. Your dashboard summarizes
your coding data—such as your code time by project, lines of code, and
keystrokes per minute—today, yesterday, last week, and over the last 90 days.

<p align="center" style="margin: 0 10%">
  <img src="https://swdc-vscode.s3-us-west-1.amazonaws.com/editor-dashboard.png" alt="Code Time for VS Code dashboard" />
</p>

## Web app data visualizations

Click "See advanced metrics" in the Code Time side bar or visit
[app.software.com](https://app.software.com/) to see more data visualizations.
Here are a few examples of what you will see in your feed after your first week.

**Code Time heatmap**

Code Time measures your coding activity per hour and summarizes your data in a
weekly and 90-day average heatmap. Protect your best times on your heatmap from
meetings and interrupts to help boost your productivity.

<p align="center" style="margin: 0 10%">
  <img src="https://swdc-vscode.s3-us-west-1.amazonaws.com/weekly-heatmap.png" alt="Code Time for VS Code heatmap" />
</p>

**Project-based reports**

See how much time you spend per project per week. Code Time also lets you set a
rate per project and export your data to a CSV.

<p align="center" style="margin: 0 10%">
  <img src="https://swdc-vscode.s3-us-west-1.amazonaws.com/top-projects.png" alt="Code Time for VS Code top projects" />
</p>

**Work-life balance**

How much do you code after hours and weekends? Code Time helps you see your
breakdown at work vs. outside work so you can find ways to improve your
work-life balance.

<p align="center" style="margin: 0 10%">
  <img src="https://swdc-vscode.s3-us-west-1.amazonaws.com/work-life-balance.png" alt="Code Time for VS Code work life balance" />
</p>

**Commit velocity**

Code Time integrates with Git, so you can see your speed, frequency, and top
files across your commits.

<p align="center" style="margin: 0 10%">
  <img src="https://swdc-vscode.s3-us-west-1.amazonaws.com/commit-velocity.png" alt="Code Time for VS Code commit velocity" />
</p>

## It’s safe, secure, and free

**We never access your code:** We do not process, send, or store your
proprietary code. We only provide metrics about programming, and we make it easy
to see the data we collect.

**Your data is private:** We will never share your individually identifiable
data with your boss. In the future, we will roll up data into groups and teams
but we will keep your data anonymized.

**Free for you, forever:** We provide 90 days of data history for free, forever.
In the future, we will provide premium plans for advanced features and
historical data access.

Code Time also collects basic usage metrics to help us make informed decisions
about our roadmap.

## Get in touch

Enjoying Code Time? Let us know how it’s going by tweeting or following us at
[@software_hq](https://twitter.com/software_hq).

We recently released a new beta plugin, Music Time for VS Code, which helps you
find your most productive songs for coding. You can learn more
[here](https://www.software.com/music-time).

Have any questions? Please email us at
[support@software.com](mailto:support@software.com) and we’ll get back to you as
soon as we can.
