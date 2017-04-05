const React = require('react');
const { observable, autorunAsync } = require('mobx');
const { observer } = require('mobx-react');
const { IconButton, IconMenu, MenuItem, MenuDivider, Tooltip } = require('~/react-toolbox');
const { User, contactStore, chatStore, fileStore, mailStore } = require('~/icebear');
const Avatar = require('~/ui/shared-components/Avatar');
const css = require('classnames');
const app = require('electron').remote.app;
const sounds = require('~/helpers/sounds');
const appControl = require('~/helpers/app-control');
const AppNavButton = require('./AppNavButton');
const { t } = require('peerio-translator');

const TooltipIcon = Tooltip()(IconButton); //eslint-disable-line

const ROUTES = {
    chat: '/app',
    mail: '/app/mail',
    files: 'app/files',
    profile: '/app/settings/profile',
    security: '/app/settings/security',
    prefs: '/app/settings/preferences',
    about: '/app/settings/about'
};

// todo: move this somewhere more appropriate
let dockNotifsStarted = false;
function startDockNotifications() {
    if (dockNotifsStarted || (!app.setBadgeCount && !app.dock && !app.dock.bounce)) return;
    dockNotifsStarted = true;
    autorunAsync(() => {
        const unreadItems = chatStore.unreadMessages + fileStore.unreadFiles;
        if (app.setBadgeCount) app.setBadgeCount(unreadItems);
        if (app.dock && app.dock.bounce && chatStore.unreadMessages > 0) {
            app.dock.bounce();
        }
    }, 250);
}

// todo: move this somewhere more appropriate
let soundNotificationsStarted = false;
function startSoundNotifications() {
    if (soundNotificationsStarted) return;
    soundNotificationsStarted = true;
    chatStore.events.on(chatStore.EVENT_TYPES.messagesReceived, () => {
        sounds.received.play();
    });
}

// todo: Paul, move this to stylesheets
const menuItemStyle = { minWidth: '250px' };

// todo: it will be useful to extract route tracking system to use it it other components
@observer
class AppNav extends React.Component {

    @observable currentRoute = window.router.getCurrentLocation().pathname;

    componentWillMount() {
        // since this component shows new items notifications, we also make it show dock icon notifications
        startDockNotifications();
        startSoundNotifications();
        this.disposeRouterListener = window.router.listen(this.handleRouteChange);
    }

    componentWillUnmount() {
        if (this.disposeRouterListener) this.disposeRouterListener();
    }

    handleRouteChange = route => {
        this.currentRoute = route.pathname;
    };

    toMail() {
        window.router.push(ROUTES.mail);
    }

    toChat() {
        window.router.push(ROUTES.chat);
    }

    toFiles() {
        window.router.push(ROUTES.files);
    }

    toProfile() {
        window.router.push(ROUTES.profile);
    }

    toSecurity() {
        window.router.push(ROUTES.security);
    }

    toPrefs() {
        window.router.push(ROUTES.prefs);
    }

    toAbout() {
        window.router.push(ROUTES.about);
    }

    signout() {
        appControl.relaunch();
    }

    render() {
        const contact = contactStore.getContact(User.current.username);
        const primaryAddressConfirmed = User.current.primaryAddressConfirmed;

        return (
            <div className="app-nav">
                <div className="avatar-menu-wrapper">
                    <div className={css({ 'avatar-notify': !primaryAddressConfirmed })} />
                    <IconMenu icon="">
                        <MenuItem value="profile" icon="person" caption={t('title_settingsProfile')}
                            onClick={this.toProfile} style={menuItemStyle}
                            className={css({ 'avatar-notify': !primaryAddressConfirmed })} />
                        <MenuItem value="security" icon="security" caption={t('title_settingsSecurity')}
                            onClick={this.toSecurity} style={menuItemStyle} />
                        {/* <MenuItem value="preferences" icon="settings" caption={t('title_settingsPreferences')}
                                  onClick={this.toPrefs} style={menuItemStyle} />*/}
                        <MenuItem value="about" icon="info" caption="About"
                            onClick={this.toAbout} style={menuItemStyle} />
                        <MenuDivider />
                        <MenuItem value="signout" icon="power_settings_new" caption={t('button_logout')}
                            onClick={this.signout} />
                    </IconMenu>
                    <Avatar contact={contact} />
                </div>
                <div className="app-menu">


                    <AppNavButton tooltip={t('title_chats')} icon="forum" active={this.currentRoute === ROUTES.chat}
                        showBadge={chatStore.unreadMessages > 0} badge={chatStore.unreadMessages}
                        onClick={this.toChat} />

                    <AppNavButton tooltip={t('title_files')} icon="folder" active={this.currentRoute === ROUTES.files}
                        showBadge={fileStore.unreadFiles > 0} badge={fileStore.unreadFiles}
                        onClick={this.toFiles} />

                    <div className="usage">
                        <TooltipIcon
                            tooltip={`${User.current.fileQuotaUsedFmt} / ${User.current.fileQuotaTotalFmt}`}
                            tooltipPosition="right"
                            icon="data_usage" />
                        <div>{User.current.fileQuotaUsedPercent}</div>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = AppNav;
