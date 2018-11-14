import config from '~/config';

// eslint-disable-next-line import/no-mutable-exports
let Copyright = require('~/ui/settings/components/Copyright').default;
if (config.whiteLabel.name) {
    Copyright = require('~/ui/settings/components/Copyright_WL').default;
}

export default Copyright;
