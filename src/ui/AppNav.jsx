const React = require('react');
const { observable, autorunAsync } = require('mobx');
const { observer } = require('mobx-react');
const { IconButton, Tooltip } = require('react-toolbox');
const { User, contactStore, chatStore } = require('~/icebear');
const Avatar = require('~/ui/shared-components/Avatar');
const css = require('classnames');
const app = require('electron').remote.app;
const sounds = require('~/helpers/sounds');
const signout = require('~/helpers/app-control');

const TooltipIcon = Tooltip(IconButton); //eslint-disable-line

const delay = 500;


@observer
class AppNav extends React.Component {

    @observable inMessages = true;


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

    toMessages = () => {
        window.router.push('/app');
        this.inMessages = true;
    };

    toFiles = () => {
        window.router.push('/app/files');
        this.inMessages = false;
    };

    unreadFiles = () => {
        return false;
    };

    toSignout = () => {
        signout.relaunch();
    }
    render() {
        return (
            <div className="app-nav">
                <div className="avatar-wrapper">
                    {/* <IconMenu icon="">
                        <MenuItem value="profile" icon="person" caption="Profile" disabled />
                        <MenuItem value="Settings" icon="settings" caption="Settings" disabled />
                        <MenuDivider />
                        <MenuItem value="signout" icon="power_settings_new" caption="Sign out" onClick={this.toSignout} />
                    </IconMenu> */}
                    <Avatar contact={this.contact} />
                </div>
                <div className="app-menu">
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

                    <div className={css('menu-item', { active: !this.inMessages })} >
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
