const React = require('react');
const { observable, autorunAsync } = require('mobx');
const { observer } = require('mobx-react');
const { IconButton, Tooltip, IconMenu, MenuItem, MenuDivider } = require('~/react-toolbox');
const { User, contactStore, chatStore, fileStore, mailStore } = require('~/icebear');
const Avatar = require('~/ui/shared-components/Avatar');
const css = require('classnames');
const app = require('electron').remote.app;
const sounds = require('~/helpers/sounds');
const appControl = require('~/helpers/app-control');

const TooltipIcon = Tooltip()(IconButton); //eslint-disable-line

const delay = 500;

const ROUTES = {
    chat: '/app',
    mail: '/app/mail',
    files: 'app/files',
    profile: '/app/settings/profile',
    security: '/app/settings/security',
    prefs: '/app/settings/preferences'
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

// todo: it will be useful to extract route tracking system to use it it other components
@observer
class AppNav extends React.Component {

    @observable currentRoute = window.router.getCurrentLocation().pathname;

    componentWillMount() {
        this.contact = contactStore.getContact(User.current.username);
        this.primaryAddressConfirmed = User.current.primaryAddressConfirmed;
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

    toMessages() {
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

    signout() {
        appControl.relaunch();
    }

    render() {
        return (
            <div className="app-nav">
                <div className="avatar-wrapper">
                    <div className={css({ 'avatar-notify': !this.primaryAddressConfirmed })} />
                    <IconMenu icon="">
                        <MenuItem value="profile"
                                  icon="person"
                                  caption="Profile"
                                  onClick={this.toProfile}
                                  style={{ minWidth: '250px' }}
                                  className={css({ 'avatar-notify': !this.primaryAddressConfirmed })} />
                        <MenuItem value="security"
                                  icon="security"
                                  caption="Security"
                                  onClick={this.toSecurity}
                                  style={{ minWidth: '250px' }} />
                        <MenuItem value="preferences"
                                  icon="settings"
                                  caption="Preferences"
                                  onClick={this.toPrefs}
                                  style={{ minWidth: '250px' }} />

                        <MenuDivider />
                        <MenuItem value="signout" icon="power_settings_new" caption="Sign out"
                                  onClick={this.signout} />
                    </IconMenu>
                    <Avatar contact={this.contact} />
                </div>
                <div className="app-menu">
                    <div className={css('menu-item', { active: this.currentRoute === ROUTES.mail })}>
                        <TooltipIcon
                            tooltip="Mail"
                            tooltipDelay={delay}
                            tooltipPosition="right"
                            icon="mail"
                            onClick={this.toMail} />
                        {/* TODO mailStore? */}
                        <div className={mailStore.unreadMail > 0 ? 'look-at-me' : 'banish'}>
                            {mailStore.unreadMail}
                        </div>
                    </div>

                    <div className={css('menu-item', { active: this.currentRoute === ROUTES.chat })}>
                        <TooltipIcon
                            tooltip="Chats"
                            tooltipDelay={delay}
                            tooltipPosition="right"
                            icon="forum"
                            onClick={this.toMessages} />

                        <div className={chatStore.unreadMessages > 0 ? 'look-at-me' : 'banish'}>
                            {chatStore.unreadMessages}
                        </div>
                    </div>

                    <div className={css('menu-item', { active: this.currentRoute === ROUTES.files })} >
                        <TooltipIcon
                            tooltip="Files"
                            tooltipDelay={delay}
                            tooltipPosition="right"
                            icon="folder"
                            onClick={this.toFiles} />
                        <div className={fileStore.unreadFiles > 0 ? 'look-at-me' : 'banish'}>
                            {fileStore.unreadFiles}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = AppNav;
