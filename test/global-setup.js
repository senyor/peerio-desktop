const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

global.expect = chai.expect;
chai.use(chaiAsPromised);
chai.should();

global.setupTimeout = function(test) {
    // in future we can have different
    test.timeout(10000);
};
