import { SideBarView, EditorView, InputBox, CustomTreeSection, ActivityBar, Workbench, Notification, WebDriver, VSBrowser, ViewControl, TextEditor } from 'vscode-extension-tester';
const assert = require('chai').assert;

describe('Hello World Example UI Tests', () => {

    it('Create a Team', async () => {
        const activityBar = new ActivityBar();
        const control = await activityBar.getViewControl('Cloud9');

        await control.openView();

        //Click sign in on tree view
        const menuInfo =  await new SideBarView().getContent().getSection('Menu') as CustomTreeSection;
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
    

        console.log('5');
        await (await menuInfo.findItem('🌐 Leaderboard')).click();
        console.log('6');
        const globalStats = await new EditorView().openEditor('leaderboard.txt');        
        console.log('7');
        assert(await globalStats.getTitle() == "", false);
        console.log('8');
        //console.log(await globalStats.getText()); 

        //const teamInfo = await new SideBarView().getContent().getSection('Team Info') as CustomTreeSection;
        //Clicking an item in a
        //await (await teamInfo.findItem('🛡 Create your Team')).click();
        // /await section.findItem('🛡 Create your Team')
    });
});

