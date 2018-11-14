import config from '~/config';

// eslint-disable-next-line import/no-mutable-exports
let PoweredByLogin = require('~/ui/login/PoweredBy').default;
if (config.whiteLabel.name) {
    PoweredByLogin = require('~/ui/login/PoweredBy_WL').default;
}

export default PoweredByLogin;
