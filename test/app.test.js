const { startApp, closeApp, isDev } = require('./helpers');

console.log(`===== Tests starting in ${isDev ? 'DEVELOPMENT' : 'PRODUCTION'} mode =====`);

describe('application launch', function() {
    setupTimeout(this);

    beforeEach(function() {
        return startApp(this);
    });


    afterEach(() => {
      //  return closeApp(this);
    });

    xit('opens a window', function() {
        return this.app.client.waitUntilWindowLoaded()
          .browserWindow.focus()
          .getWindowCount().should.eventually.equal(isDev ? 4 : 1)
          .browserWindow.isMinimized().should.eventually.be.false
          .browserWindow.isDevToolsOpened().should.eventually.be.false
          .browserWindow.isVisible().should.eventually.be.true
          .browserWindow.isFocused().should.eventually.be.true
          .browserWindow.getBounds().should.eventually.have.property('width').and.be.above(0)
          .browserWindow.getBounds().should.eventually.have.property('height').and.be.above(0);
    });

    it('logins', function() {
        this.app.client.waitUntilWindowLoaded()
            .browserWindow.focus()
            .waitUntilVilisble('.login-button')
            .click('.login-button');
    });
});
