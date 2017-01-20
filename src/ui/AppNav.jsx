const React = require('react');
const { observable, autorunAsync } = require('mobx');
const { observer } = require('mobx-react');
const { IconButton, Tooltip, IconMenu, MenuItem, MenuDivider } = require('~/react-toolbox');
const { User, contactStore, chatStore } = require('~/icebear');
const Avatar = require('~/ui/shared-components/Avatar');
const css = require('classnames');
const app = require('electron').remote.app;
const sounds = require('~/helpers/sounds');
const appControl = require('~/helpers/app-control');

const TooltipIcon = Tooltip(IconButton); //eslint-disable-line

const delay = 500;


@observer
class AppNav extends React.Component {

    @observable inMessages = true;
    @observable inFiles = false;

    componentWillMount() {
        this.contact = contactStore.getContact(User.current.username);
        autorunAsync(() => {
            app.setBadgeCount(chatStore.unreadMessages);
            if (chatStore.unreadMessages > 0) {
                app.dock.bounce();
            }
        }, 250);

        chatStore.events.on(chatStore.EVENT_TYPES.messagesReceived, () => {
            sounds.received.play();
        });
    }

    toMail = () => {
        window.router.push('/app/mail');
        this.inMail = true;
        this.inMessages = false;
        this.inFiles = false;
    }

    // todo: terrible idea(inMessages), do this based on router hooks
    toMessages = () => {
        window.router.push('/app');
        this.inMail = false;
        this.inMessages = true;
        this.inFiles = false;
    };

    toFiles = () => {
        window.router.push('/app/files');
        this.inMail = false;
        this.inMessages = false;
        this.inFiles = true;
    };

    toProfile = () => {
        window.router.push('/app/settings/profile');
        this.inMail = false;
        this.inMessages = false;
        this.inFiles = false;
    }

    toSecurity = () => {
        window.router.push('/app/settings/security');
        this.inMail = false;
        this.inMessages = false;
        this.inFiles = false;
    }

    toPrefs = () => {
        window.router.push('/app/settings/preferences');
        this.inMail = false;
        this.inMessages = false;
        this.inFiles = false;
    }

    unreadFiles = () => {
        return false;
    };

    signout = () => {
        appControl.relaunch();
    };

    render() {
        return (
            <div className="app-nav">
                <div className="avatar-wrapper">
                    <IconMenu icon="">
                        <MenuItem value="profile"
                                  icon="person"
                                  caption="Profile"
                                  onClick={this.toProfile}
                                  style={{ minWidth: '250px' }} />
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
                    <div className={css('menu-item', { active: this.inMail })}>
                        <TooltipIcon
                            tooltip="Mail"
                            tooltipDelay={delay}
                            tooltipPosition="right"
                            icon="mail"
                            onClick={this.toMail} />
                        {/* TODO div is probably unnecessary. move to wrapping div? */}
                        <div className={chatStore.unreadMessages > 0 ? 'look-at-me' : ''} />
                    </div>

                    <div className={css('menu-item', { active: this.inMessages })}>
                        <TooltipIcon
                            tooltip="Chats"
                            tooltipDelay={delay}
                            tooltipPosition="right"
                            icon="forum"
                            onClick={this.toMessages} />
                        {/* TODO div is probably unnecessary. move to wrapping div? */}
                        <div className={chatStore.unreadMessages > 0 ? 'look-at-me' : ''} />
                    </div>

                    <div className={css('menu-item', { active: this.inFiles })} >
                        <TooltipIcon
                            tooltip="Files"
                            tooltipDelay={delay}
                            tooltipPosition="right"
                            icon="folder"
                            onClick={this.toFiles} />
                        <div className={this.unreadFiles ? '' : ''} />
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = AppNav;
