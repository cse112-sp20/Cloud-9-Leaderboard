import { SideBarView, EditorView, InputBox, CustomTreeSection, ActivityBar, Workbench, Notification, WebDriver, VSBrowser, ViewControl } from 'vscode-extension-tester';
import { expect } from 'chai';
const assert = require('chai').assert;

describe('Hello World Example UI Tests', () => {
    let driver: WebDriver;

    before(() => {
        //driver = VSBrowser.instance.driver;
    });

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
         await (await menuInfo.findItem('📊 View personal stats')).click();
         const editorView = new EditorView();
         const editor = await editorView.openEditor('personal_statistics.txt');
         console.log(await editor.getTitle() + "; " + await editor.getText());
         //assert(await editor.isDisplayed(), true);
         //assert(await editor.getTitle(), "personal_statistics.txt");

        //const teamInfo = await new SideBarView().getContent().getSection('Team Info') as CustomTreeSection;
        //Clicking an item in a
        //await (await teamInfo.findItem('🛡 Create your Team')).click();
        // /await section.findItem('🛡 Create your Team')
    });
});

