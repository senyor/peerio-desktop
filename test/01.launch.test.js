const { startApp, closeApp, isDev } = require('./helpers');

console.log(`===== Tests starting in ${isDev ? 'DEVELOPMENT' : 'PRODUCTION'} mode =====`);

describe('application launch', function() {
    setupTimeout(this);
    beforeEach(() => startApp(this));
    afterEach(() => closeApp(this));

    it('opens a window', () => {
        return this.app.client
            .browserWindow.focus()
            .browserWindow.isMinimized().should.eventually.be.false
            .browserWindow.isFocused().should.eventually.be.true
            .browserWindow.getBounds().should.eventually.have.property('width').and.be.above(0)
            .browserWindow.getBounds().should.eventually.have.property('height').and.be.above(0);
    });

    it('has a default language & dictionary', () => {
        return this.app.client.execute(() => {
            return require('./stores/language-store').language; // eslint-disable-line no-undef
        })
         .then((v) => {
             expect(v.value).to.equal('en');
             return this.app.client.execute(() => {
                 return ice.PhraseDictionary.current.locale; // eslint-disable-line no-undef
             });
         })
         .then((v) => {
             expect(v.value).to.equal('en');
             return this.app.client.execute(() => {
                 return ice.PhraseDictionary.current.dict; // eslint-disable-line no-undef
             });
         })
          .then((v) => {
              expect(v.value).length.to.be.above(10000);
          });
    });
});
