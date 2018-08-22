require('@babel/register')({
    extensions: ['.jsx', '.js', '.tsx', '.ts']
});

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

global.expect = chai.expect;
chai.use(chaiAsPromised);
chai.should();
