const React = require('react');
const { autorunAsync, observable } = require('mobx');
const { observer } = require('mobx-react');
const { Avatar, Divider, Menu, MenuHeader, MenuItem } = require('peer-ui');
const { User, contactStore, chatStore, fileStore } = require('peerio-icebear');
const UsageCloud = require('~/ui/shared-components/UsageCloud');
const SignoutDialog = require('~/ui/shared-components/SignoutDialog');
const css = require('classnames');
const { remote } = require('electron');
const notificationFactory = require('~/helpers/notifications');
const appControl = require('~/helpers/app-control');
const AppNavButton = require('./AppNavButton');
const { t } = require('peerio-translator');
const routerStore = require('~/stores/router-store');
const urls = require('~/config').translator.urlMap;
const autologin = require('~/helpers/autologin');
const path = require('path');
const config = require('~/config');

const { app, nativeImage } = remote;


// todo: move this somewhere more appropriate
let dockNotifsStarted = false;
function startDockNotifications() {
    // if (dockNotifsStarted || (!app.setBadgeCount && !app.dock && !app.dock.bounce)) return;
    if (dockNotifsStarted) return;
    dockNotifsStarted = true;
    autorunAsync(() => {
        const unreadItems = chatStore.unreadMessages;
        // mac
        if (app.setBadgeCount && app.dock && app.dock.bounce) {
            if (app.setBadgeCount) app.setBadgeCount(unreadItems);
            if (unreadItems > 0) {
                app.dock.bounce();
            }
        }
    }, 250);
}

let taskbarOverlayStarted = false;
function startTaskbarOverlay() {
    // if (dockNotifsStarted || (!app.setBadgeCount && !app.dock && !app.dock.bounce)) return;
    if (taskbarOverlayStarted) return;
    taskbarOverlayStarted = true;
    autorunAsync(() => {
        const unreadItems = chatStore.unreadMessages;
        // windows
        if (typeof remote.getCurrentWindow().setOverlayIcon === 'function') {
            const overlay = nativeImage.createFromPath(
                path.join(app.getAppPath(), 'build/static/img/taskbar-overlay.png')
            );
            remote.getCurrentWindow().setOverlayIcon(unreadItems ? overlay : null, unreadItems ? 'newmessages' : '');
        }
    }, 250);
}

let desktopNotificationsStarted = false;
function startDesktopNotifications() {
    if (desktopNotificationsStarted) return;
    desktopNotificationsStarted = true;
    chatStore.events.on(chatStore.EVENT_TYPES.messagesReceived,
        notificationFactory.sendMessageNotification);
    chatStore.events.on(chatStore.EVENT_TYPES.invitedToChannel,
        notificationFactory.sendInviteNotification);
    contactStore.events.on(contactStore.EVENT_TYPES.inviteAccepted,
        notificationFactory.sendInviteAcceptedNotification);
}

@observer
class AppNav extends React.Component {
    @observable isConfirmSignOutVisible = false;

    constructor() {
        super();
        ['mail', 'chats', 'files', 'contacts', 'profile', 'security', 'prefs', 'account', 'about', 'help', 'onboarding']
            .forEach(route => {
                this[`to${route[0].toUpperCase()}${route.slice(1)}`] = () => {
                    routerStore.navigateTo(routerStore.ROUTES[route]);
                };
            });
    }

    componentWillMount() {
        // since this component shows new items notifications, we also make it show dock icon notifications
        startDockNotifications();
        startDesktopNotifications();
        startTaskbarOverlay();
    }

    _doSignout = async (untrust) => {
        await autologin.disable();
        await User.current.signout(untrust);
        appControl.relaunch();
    }

    signout = async () => {
        this.isConfirmSignOutVisible = true;
    }

    cancelSignout = () => {
        this.isConfirmSignOutVisible = false;
    }

    toUpgrade() {
        return window.open(urls.upgrade);
    }

    render() {
        const contact = contactStore.getContact(User.current.username);
        const { currentRoute, ROUTES } = routerStore;
        const { primaryAddressConfirmed } = User.current;

        return (
            <div className="app-nav">
                <div className="avatar-menu-wrapper">
                    <div className={css({ 'avatar-notify': !primaryAddressConfirmed })} />
                    <Menu
                        customButton={<Avatar contact={contact} size="medium" />}
                        position="top-left"
                        theme="wide app-nav-menu"
                    >
                        <MenuHeader
                            leftContent={<Avatar contact={contact} size="medium" onClick={this.toProfile} clickable />}
                            caption={contact.fullName}
                            legend={contact.username}
                        />
                        <Divider />
                        <MenuItem
                            value="profile"
                            customIcon="public-profile"
                            caption={t('title_settingsProfile')}
                            onClick={this.toProfile}
                            className={css(
                                'profile',
                                'custom-icon-hover-container',
                                { 'avatar-notify': !primaryAddressConfirmed }
                            )}
                            selected={currentRoute === ROUTES.profile}
                        />
                        <MenuItem
                            className="security"
                            value="security"
                            icon="security"
                            caption={t('title_settingsSecurity')}
                            onClick={this.toSecurity}
                            selected={currentRoute === ROUTES.security}
                        />
                        <MenuItem
                            className="preferences custom-icon-hover-container"
                            value="preferences"
                            customIcon="preferences"
                            caption={t('title_settingsPreferences')}
                            onClick={this.toPrefs}
                            selected={currentRoute === ROUTES.prefs}
                        />
                        <MenuItem
                            className="account"
                            value="account"
                            icon="account_circle"
                            caption={t('title_settingsAccount')}
                            onClick={this.toAccount}
                            selected={currentRoute === ROUTES.account}
                        />
                        <MenuItem
                            className="about"
                            value="about"
                            icon="info"
                            caption={t('title_About')}
                            onClick={this.toAbout}
                            selected={currentRoute === ROUTES.about}
                        />
                        <MenuItem
                            className="help"
                            value="help"
                            icon="help"
                            caption={t('title_help')}
                            onClick={this.toHelp}
                            selected={currentRoute === ROUTES.help}
                        />
                        {config.disablePayments || User.current.hasActivePlans
                            ? null
                            : <Divider key="appnav-nested-divider" />
                        }
                        {config.disablePayments || User.current.hasActivePlans
                            ? null
                            : <MenuItem key="appnav-nested-menuitem"
                                className="upgrade"
                                value="upgrade"
                                icon="open_in_browser"
                                caption={t('button_upgrade')}
                                onClick={this.toUpgrade}
                            />
                        }
                        <Divider />
                        <MenuItem
                            className="signout"
                            value="signout"
                            icon="power_settings_new"
                            caption={t('button_logout')}
                            onClick={this.signout}
                        />
                    </Menu>
                </div>
                <div className="app-menu">
                    <AppNavButton tooltip={t('title_chats')} icon="forum"
                        active={currentRoute.startsWith(ROUTES.chats) || currentRoute.startsWith(ROUTES.patients)}
                        showBadge={chatStore.badgeCount > 0}
                        badge={chatStore.badgeCount}
                        onClick={this.toChats} />

                    <AppNavButton tooltip={t('title_files')} icon="folder"
                        active={currentRoute.startsWith(ROUTES.files)}
                        showBadge={fileStore.unreadFiles > 0}
                        onClick={this.toFiles} />

                    <AppNavButton tooltip={t('title_contacts')} icon="people"
                        active={currentRoute.startsWith(ROUTES.contacts)}
                        onClick={this.toContacts} />

                    <UsageCloud onClick={this.toOnboarding} />
                </div>
                <SignoutDialog
                    active={this.isConfirmSignOutVisible}
                    onHide={this.cancelSignout}
                    onSignout={this._doSignout}
                />
            </div>
        );
    }
}

module.exports = AppNav;
