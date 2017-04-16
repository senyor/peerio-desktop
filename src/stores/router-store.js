// global UI store
const { observable } = require('mobx');

class RouterStore {
    @observable contactDialogUsername;
    @observable currentRoute = window.router.getCurrentLocation().pathname;

    constructor() {
        window.router.listen(this.handleRouteChange);
    }

    handleRouteChange = route => {
        this.currentRoute = route.pathname;
    };

    get ROUTES() {
        return {
            chat: '/app',
            mail: '/app/mail',
            files: 'app/files',
            profile: '/app/settings/profile',
            security: '/app/settings/security',
            prefs: '/app/settings/preferences',
            about: '/app/settings/about'
        };
    }


}

module.exports = new RouterStore();
