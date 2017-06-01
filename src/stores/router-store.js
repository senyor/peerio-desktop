// global UI store
const { observable } = require('mobx');

class RouterStore {
    @observable currentRoute = window.router.getCurrentLocation().pathname;

    constructor() {
        window.router.listen(this.handleRouteChange);
    }

    handleRouteChange = route => {
        this.currentRoute = route.pathname;
    };

    navigateTo(path) {
        if (this.currentRoute === path) return;
        window.router.push(path);
    }

    get ROUTES() {
        return {
            chat: '/app',
            mail: '/app/mail',
            files: 'app/files',
            profile: '/app/settings/profile',
            security: '/app/settings/security',
            prefs: '/app/settings/preferences',
            account: '/app/settings/account',
            about: '/app/settings/about',
            help: '/app/settings/help'
        };
    }


}

module.exports = new RouterStore();
