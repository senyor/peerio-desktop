const React = require('react');
const { autorunAsync, observable } = require('mobx');
const { observer } = require('mobx-react');
const { IconMenu, MenuItem, MenuDivider, TooltipIconButton, Dialog } = require('~/react-toolbox');
const { User, contactStore, chatStore, fileStore } = require('~/icebear');
const Avatar = require('~/ui/shared-components/Avatar');
const css = require('classnames');
const remote = require('electron').remote;
const notificationFactory = require('~/helpers/notifications');
const appControl = require('~/helpers/app-control');
const AppNavButton = require('./AppNavButton');
const { t } = require('peerio-translator');
const routerStore = require('~/stores/router-store');
const urls = require('~/config').translator.urlMap;
const autologin = require('~/helpers/autologin');
const path = require('path');

const { app, nativeImage } = remote;


// todo: move this somewhere more appropriate
let dockNotifsStarted = false;
function startDockNotifications() {
    // if (dockNotifsStarted || (!app.setBadgeCount && !app.dock && !app.dock.bounce)) return;
    if (dockNotifsStarted) return;
    dockNotifsStarted = true;
    autorunAsync(() => {
        const unreadItems = chatStore.unreadMessages + fileStore.unreadFiles;
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
        const unreadItems = chatStore.unreadMessages + fileStore.unreadFiles;
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
    chatStore.events.on(chatStore.EVENT_TYPES.messagesReceived, notificationFactory.send);
}

@observer
class AppNav extends React.Component {
    @observable isConfirmSignOutVisible = false;

    constructor() {
        super();
        ['mail', 'chats', 'files', 'contacts', 'profile', 'security', 'prefs', 'account', 'about', 'help']
            .forEach(route => {
                this[`to${route[0].toUpperCase()}${route.slice(1)}`] = function() {
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

    _doSignout = async() => {
        await autologin.disable();
        appControl.relaunch();
    }

    signout = async() => {
        if (!User.current.autologinEnabled) {
            this._doSignout();
            return;
        }
        this.isConfirmSignOutVisible = true;
    }

    get signOutDialog() {
        const hide = () => { this.isConfirmSignOutVisible = false; };
        const actions = [
            { label: t('button_cancel'), onClick: hide },
            { label: t('button_logout'), onClick: this._doSignout }
        ];
        return (
            <Dialog actions={actions} active={this.isConfirmSignOutVisible}
                onEscKeyDown={hide} onOverlayClick={hide}
                title={t('button_logout')}>{t('title_signOutConfirmKeys')}</Dialog>
        );
    }

    toUpgrade() {
        return window.open(urls.upgrade);
    }

    render() {
        const contact = contactStore.getContact(User.current.username);
        const primaryAddressConfirmed = User.current.primaryAddressConfirmed;
        const cloudFillPercent = 22 + (79 - 22) * (User.current.fileQuotaUsedPercent / 100);
        return (
            <div className="app-nav">
                <div className="avatar-menu-wrapper">
                    <div className={css({ 'avatar-notify': !primaryAddressConfirmed })} />
                    <IconMenu icon="">
                        <MenuItem value="profile" icon="person" caption={t('title_settingsProfile')}
                            onClick={this.toProfile}
                            className={css({ 'avatar-notify': !primaryAddressConfirmed })} />
                        <MenuItem value="security" icon="security" caption={t('title_settingsSecurity')}
                            onClick={this.toSecurity} />
                        <MenuItem value="preferences" icon="settings" caption={t('title_settingsPreferences')}
                            onClick={this.toPrefs} />
                        <MenuItem value="account" icon="account_circle" caption={t('title_settingsAccount')}
                            onClick={this.toAccount} />
                        <MenuItem value="about" icon="info" caption="About"
                            onClick={this.toAbout} />
                        <MenuItem value="help" icon="help" caption="Help"
                            onClick={this.toHelp} />
                        <MenuDivider />
                        <MenuItem value="upgrade" icon="open_in_browser" caption={t('button_upgrade')}
                            onClick={this.toUpgrade} />
                        <MenuDivider />
                        <MenuItem value="signout" icon="power_settings_new" caption={t('button_logout')}
                            onClick={this.signout} />
                    </IconMenu>
                    <Avatar contact={contact} size="medium" />
                </div>
                <div className="app-menu">
                    <AppNavButton tooltip={t('title_chats')} icon="forum"
                        active={routerStore.currentRoute.startsWith(routerStore.ROUTES.chats)}
                        showBadge={chatStore.unreadMessages > 0} badge={chatStore.unreadMessages}
                        onClick={this.toChats} />

                    <AppNavButton tooltip={t('title_files')} icon="folder"
                        active={routerStore.currentRoute.startsWith(routerStore.ROUTES.files)}
                        showBadge={fileStore.unreadFiles > 0} badge={fileStore.unreadFiles}
                        onClick={this.toFiles} />

                    <AppNavButton tooltip={t('title_contacts')} icon="people"
                        active={routerStore.currentRoute.startsWith(routerStore.ROUTES.contacts)}
                        onClick={this.toContacts} />

                    <div className="usage">
                        <TooltipIconButton style={{
                            position: 'absolute',
                            clipPath: `polygon(0 0, ${cloudFillPercent}% 0, ${cloudFillPercent}% 100%, 0% 100%)`
                        }} icon="cloud" />
                        <TooltipIconButton
                            tooltip={`${User.current.fileQuotaUsedFmt} / ${User.current.fileQuotaTotalFmt}`}
                            tooltipPosition="right"
                            icon="cloud_queue" />
                        <div>{User.current.fileQuotaUsedPercent}%</div>
                    </div>
                </div>
                {this.signOutDialog}
            </div>
        );
    }
}

module.exports = AppNav;
