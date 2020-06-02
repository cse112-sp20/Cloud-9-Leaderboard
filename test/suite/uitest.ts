import { Workbench, Notification, WebDriver, VSBrowser, NotificationType } from 'vscode-extension-tester';
import { expect } from 'chai';

describe('Hello World Example UI Tests', () => {
    let driver: WebDriver;

    before(() => {
        driver = VSBrowser.instance.driver;
    });

    it('Command shows a notification with the correct text', async () => {
        const workbench = new Workbench();
        await workbench.executeCommand('Hello World');
        const notification = await driver.wait(() => { return notificationExists('Hello'); }, 10000) as Notification;

        expect(await notification.getMessage()).equals('Hello World!');
        expect(await notification.getType()).equals(NotificationType.Info);
    });
});

async function notificationExists(text: string): Promise<Notification | undefined> {
    const notifications = await new Workbench().getNotifications();
    for (const notification of notifications) {
        const message = await notification.getMessage();
        if (message.indexOf(text) >= 0) {
            return notification;
        }
    }
}