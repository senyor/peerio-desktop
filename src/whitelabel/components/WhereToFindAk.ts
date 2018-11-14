import config from '~/config';

// eslint-disable-next-line import/no-mutable-exports
let WhereToFindAk = require('~/ui/login/WhereToFindAk').default;
if (config.whiteLabel.name) {
    WhereToFindAk = require('~/ui/login/WhereToFindAk_WL').default;
}

export default WhereToFindAk;
