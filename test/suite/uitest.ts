import { SideBarView, EditorView, InputBox, CustomTreeSection, ActivityBar, Workbench, Notification, WebDriver, VSBrowser, ViewControl, TextEditor } from 'vscode-extension-tester';
const assert = require('chai').assert;

describe('Cloud 9 UI Tests', () => {
    it('End to End Test', async function () {
        this.timeout(10000);
        this.retries();
        const activityBar = new ActivityBar();
        const control = await activityBar.getViewControl('Cloud9');

        await control.openView();

        //Click sign in on tree view
        const sidebar = new SideBarView();
        const menuInfo = await sidebar.getContent().getSection('Menu') as CustomTreeSection;
        await (await menuInfo.findItem('Sign in / Create Account')).click();

        //Click sign in on notfication
        const signInNotif = (await new Workbench().getNotifications());

        //Get info from nofication
        const message = await signInNotif[0].getMessage();
        assert.equal(message, 'Please sign in or create a new account!');

        //Click sign in and set email to be test@test.com
        await signInNotif[0].takeAction((await signInNotif[0].getActions())[0].getTitle());
        const input = await InputBox.create();
        await input.setText('tester@test.com');
        await input.confirm(); // press enter
        await input.setText('password');
        await input.confirm(); // press enter
        assert.equal((await (await new Workbench().getNotifications())[0].getMessage()) == '', false);

        //View personal stats
        console.log('1');
        await (await menuInfo.findItem('📊 View personal stats')).click();
        console.log('2');
        const personalStats = new TextEditor()
        console.log('3');
        const personalStatsTitle = await personalStats.getTitle();
        console.log('4');
        assert(personalStatsTitle, "personal_statistics.txt");

        //View global leaderboard
        console.log('5');
        await (await menuInfo.findItem('🌐 Leaderboard')).click();
        console.log('6');
        const globalStats = await new EditorView().openEditor('leaderboard.txt');
        console.log('7');
        assert.equal(await globalStats.getTitle() == "", false); // check actual text
        console.log('8');
        //console.log(await globalStats.getText()); */

        //Load up team
        console.log('9');
        const teamInfo = await sidebar.getContent().getSection('Team Info') as CustomTreeSection;
        console.log('10');

    });

    it('End to End Test 2', async function () {
        this.timeout(10000);
        this.retries();
        const activityBar = new ActivityBar();
        const control = await activityBar.getViewControl('Cloud9');

        await control.openView();

        //Click sign in on tree view
        const sidebar = new SideBarView();
        const teamInfo = await sidebar.getContent().getSection('Team Info') as CustomTreeSection;

        //Check that testTeam is the team name
        await (await teamInfo.findItem('Get Team Info')).click();
        console.log('11');
        await (await (await teamInfo.findItem('Get Team Info')).findChildItem("TeamName")).click();
        assert.equal(await (await (await teamInfo.findItem('Get Team Info')).findChildItem("TeamName")) == undefined, false);

        // const teamInfo = await new SideBarView().getContent().getSection('Team Info') as CustomTreeSection;
        // const getTeamInfo = await teamInfo.findItem('Get Team Info');
        // assert.equal(getTeamInfo.getLabel(), 'Get Team Info');
        // await getTeamInfo.click();
        // const teamName = await getTeamInfo.select()[0];
        // const teamId = await getTeamInfo.select()[1];
        // assert.equal(teamName.getLabel(), 'TeamName');
        // assert.equal(teamId.getLabel(), 'teamId');
        // await teamName.click();
        // await teamId.click();
        // assert.equal(teamName.select()[0].getLabel(), 'testTeam');
        // assert.equal(teamId.select()[0].getLabel(), '5wlt5EI8qxP6q5VpV0v2');
    });
});

