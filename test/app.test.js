const { startApp, closeApp, isDev } = require('./helpers');

console.log(`===== Tests starting in ${isDev ? 'DEVELOPMENT' : 'PRODUCTION'} mode =====`);

describe('application launch', function() {
    setupTimeout(this);

    beforeEach(function() {
        return startApp(this);
    });


    afterEach(function() {
        return closeApp(this);
    });

    // it('opens a window', function() {
    //     return this.app.client
    //         .browserWindow.focus()
    //         .browserWindow.isMinimized().should.eventually.be.false
    //         .browserWindow.isFocused().should.eventually.be.true
    //         .browserWindow.getBounds().should.eventually.have.property('width').and.be.above(0)
    //         .browserWindow.getBounds().should.eventually.have.property('height').and.be.above(0);
    // });
    //
    //
    // it('login setup', function() {
    //     return this.app.client
    //         .setValue('div.login-form > div.rt-input-input > input', 'anritest5')
    //         .setValue('div.password > div > input', 'icebear')
    //         .waitForEnabled('.login-button')
    //         .click('.login-button')
    //         .waitForVisible('.app-nav');
    // });
    //
    // it('login return', function() {
    //     return this.app.client
    //         .setValue('div.password > div > input', 'icebear')
    //         .waitForEnabled('.login-button')
    //         .click('.login-button')
    //         .waitForVisible('.app-nav');
    // });
    //
    //
    // it('clear saved user', function() {
    //     return this.app.client
    //         .click('.welcome-back-wrapper');
    // });
    //
    // it('logins', function() {
    //     return this.app.client
    //         .setValue('div.login-form > div.rt-input-input > input', 'anritest7')
    //         .setValue('div.password > div > input', 'icebear')
    //         .waitForEnabled('.login-button')
    //         .click('.login-button')
    //         .waitForVisible('.app-nav');
    // });
    it('signup', function() {
        return this.app.client
            .click('a:nth-of-type(2)')
            .waitForVisible('.signup')
            .setValue('div.signup-form > div.flex-col > div:nth-child(2) > input', `t${Date.now()}`)
            .setValue('div.signup-form > div.flex-col > div:nth-child(3) > input', `t${Date.now()}@mailinator.com`)
            .setValue('div.signup-form > div.flex-col > div.input-row > div:nth-child(1) > div > input', 'fname')
            .setValue('div.signup-form > div.flex-col > div.input-row > div:nth-child(2) > div > input', 'lname')
            .waitForEnabled('div.signup-nav > button:nth-child(2)')
            .click('div.signup-nav > button:nth-child(2)')
            .setValue('.signup-form > div.passcode > div:nth-child(2) > input', 'hZEaiGeA6')
            .setValue('.signup-form > div.passcode > div:nth-child(3) > input', 'hZEaiGeA6')
            .waitForEnabled('.signup-nav > button:nth-child(2)')
            .click('.signup-nav > button:nth-child(2)')
            .waitForVisible('.app-nav');
    });
});
