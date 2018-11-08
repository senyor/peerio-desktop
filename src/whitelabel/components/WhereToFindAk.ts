import config from '~/config';

// this will not mutate
// eslint-disable-next-line import/no-mutable-exports
let WhereToFindAk = require('~/ui/login/WhereToFindAk');

if (config.whiteLabel.name) {
    WhereToFindAk = require('~/ui/login/WhereToFindAk_WL');
}

export default WhereToFindAk;
