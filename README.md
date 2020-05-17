<br />

<h1 align="center">
 
  Cloud9
  <br />

</h1>

<br />

<p align="center">Cloud 9 is an open source plugin for tracking developers'
productivity by displaying metric scores on leaderboard. Cloud 9 is build
on top of the open source <a href="https://www.software.com/code-time">Code time</a> vscode extension. 
</p>

<br />

# Developer guide

### Things to remember:

- **Create your own feature branch based off `dev`** (if the code you are writing is only dependent on the code in `dev`)<br/> 
  - And make a pull request for **your branch to be merged into `dev`**.
  - `Master` is not updated until a major version is done, such as MVP done

- Create small and specific branches.
- Constantly pull your branch's base branch (e.g. your branch's base branch might in most cases be `dev`) to stay up to date with other
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
  - `dev` is the main branch that we collectively work on during development phase.
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
   - If the code you are writing is only dependent on the code in `dev`, then
     `dev` is your base branch. Otherwise, if the code you are writing is
     dependent on code that is not in `dev`, then your branch's base branch
     is going to be the branch that contains the code that your branch depends
     on.
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
     - If you want to merge your branch into `dev` (or `master` in the future when MVP is done, etc), you must create a PR to
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
