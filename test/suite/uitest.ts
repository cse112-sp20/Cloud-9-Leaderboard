import { ActivityBar, Workbench, Notification, WebDriver, VSBrowser, ViewControl } from 'vscode-extension-tester';
import { expect } from 'chai';

describe('Hello World Example UI Tests', () => {
    let driver: WebDriver;

    before(() => {
        driver = VSBrowser.instance.driver;
    });

    it('Command shows a notification with the correct text', async () => {
        const activityBar = new ActivityBar();
        const control = await activityBar.getViewControl('Cloud9');

        const view = await control.openView();
    });
});

