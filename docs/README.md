<h1 align="center">
  <br>
  <a href="https://imgur.com/I8N2I8s"><img src="https://i.imgur.com/I8N2I8s.png" title="source: imgur.com" width= "200px"/></a>
  <br>
  Cloud 9 Leaderboard
  <br>
</h1>

<p align="center">
  <a href="#About">About</a> •
  <a href="#Installation">Installation</a> •
  <a href="#Features">Features</a> •
  <a href="#Team">Team</a> •
  <a href="#Documentation and Structure">Documentation and Structure</a> •
  <a href="#Credits">Credits</a>
</p>

## About

Remote work presents many challenges to both teams and individuals. The lack of a stable
working environment with peers often reduces communication between team members, productivity
and motivation. We attempt to address and mitigate some of these common problems for software teams
specifically with our VSCode extension leader-board. In it we use gamification techniques to help connect
and motivate teammates in a fun and engaging way.

Built off the Code Time VSCode extention. Cloud 9 Leaderboard is an extention that tracks personal statitics
of the user based off the different actions performed in VSCode and displays and ranks your own stats versus your
team on a group leaderboard.

## Installation

In order to run this application, you must first open up a terminal and clone the repo:
```
git clone https://github.com/cse112-sp20/Cloud-9-Leaderboard.git
```
Then you must install dependencies
```
npm install
```
Compile the dependencies and the project
```
npm run compile
```

## Features

<img src="https://i.imgur.com/xp9BzSF.png" alt="drawing"/>

### Personal Statistics

- Our extention tracks various statistics for many different types of actions performed within the VSCode editor through the help of Code-Time API.
- Appears as a stylized text file for readability and ease of access
- Tracks:
  - Time spent in the editor
  - Number of keystrokes typed
  - Number of lines added or removed
  - Personal score determined by the above stats

### Team Leaderboard

- Able to join a team leaderboard to track statistics of other members and see how you rank against them
- Similar to the personal statistics, the team leaderboard is stylized as a text file
- Aspects:
  - Displays your ranking compared to others in your team
  - Displays team statistics and team score
  - Anonymous names to keep the scoring friendly and competitive
- Team Leaders are able to create and share a team to be joined
  - Leaders also have the option of managing their team through appointing new leaders or removing members.
  - They can also set personal tasks(ex. Finishing a File) that can give additional points to users.

Badges and Achievements

- Earn special badges that showcase progress on your coding!
- Get achievements that help contribute to your personal score!

## Team

### Co-Leads

#### Justin Sherfrey

#### Leo Ku

### Code Team

#### Tina Hsieh

#### Ethan Yuan

### Build Team

#### Madeline Lee

#### Hou-An Lin

### R&D Team

#### David Alexander

#### Mitchell Zhang

### Testing Team

#### Alexander Garza

#### Daniel Tan

### Wildcard Team

#### Patrick Pajarillaga

<img src="https://upload.wikimedia.org/wikipedia/en/thumb/3/33/Patrick_Star.svg/1200px-Patrick_Star.svg.png" alt="drawing" width="100"/>

<p>Patrick is a 3rd year computer sciences with interests in topics of machine learning and augmented reality. His hobbies include gaming on his PC or going to various concerts scattered around the city.</p>


#### Devin Junanto

#### Jiachen Chen

## Documentation/Structure

## Credits
This application uses the following open source tools and software:

- [Node.js](https://nodejs.org/)
- [Code Time](https://www.software.com/code-time)
- [Firebase](https://firebase.google.com/)
