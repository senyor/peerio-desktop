import config from '~/config';

// eslint-disable-next-line import/no-mutable-exports
let PoweredBySettings = require('~/ui/login/PoweredBy').default;
if (config.whiteLabel.name) {
    PoweredBySettings = require('~/ui/settings/components/PoweredBy_WL').default;
}

export default PoweredBySettings;
