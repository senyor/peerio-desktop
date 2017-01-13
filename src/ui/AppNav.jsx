const React = require('react');
const { observable, autorunAsync } = require('mobx');
const { observer } = require('mobx-react');
const { IconButton, Tooltip, IconMenu, MenuItem, MenuDivider, Dialog } = require('~/react-toolbox');
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
    @observable passphraseVisible = false;

    hidePassphrase = () => { this.passphraseVisible = false; };
    passphraseDialogActions = [
        { label: 'Ok', onClick: this.hidePassphrase }
    ];
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

    // todo: terrible idea(inMessages), do this based on router hooks
    toMessages = () => {
        window.router.push('/app');
        this.inMessages = true;
    };

    toFiles = () => {
        window.router.push('/app/files');
        this.inMessages = false;
    };

    toSettings = () => {
        window.router.push('/app/settings');
    }

    unreadFiles = () => {
        return false;
    };

    signout = () => {
        appControl.relaunch();
    };

    showPassphrase= () => {
        this.passphraseVisible = true;
    };

    render() {
        return (
            <div className="app-nav">
                <div className="avatar-wrapper">
                    <IconMenu icon="">
                        <MenuItem value="settings" icon="lock" caption="Settings"
                                onClick={this.toSettings} />
                        <MenuItem value="passphrase" icon="lock" caption="Show passphrase"
                                  onClick={this.showPassphrase} />
                        <MenuDivider />
                        <MenuItem value="signout" icon="power_settings_new" caption="Sign out"
                                  onClick={this.signout} />
                    </IconMenu>
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
                <Dialog active={this.passphraseVisible} actions={this.passphraseDialogActions}
                        onOverlayClick={this.hidePassphrase} onEscKeyDown={this.hidePassphrase}>
                    <div className="passphrase-display">{User.current.passphrase}</div>
                </Dialog>
            </div>
        );
    }
}

module.exports = AppNav;
