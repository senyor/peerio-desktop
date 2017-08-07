const React = require('react');
const { observable, when } = require('mobx');
const { observer } = require('mobx-react');
const { chatStore, User } = require('~/icebear');
const UserPicker = require('~/ui/shared-components/UserPicker');
const { t } = require('peerio-translator');
const T = require('~/ui/shared-components/T');
const { ProgressBar, Button, Link } = require('~/react-toolbox');
const config = require('../../config');
const ChannelUpgradeOffer = require('./components/ChannelUpgradeOffer');
const ChannelCreateOffer = require('./components/ChannelCreateOffer');

@observer
class NewChat extends React.Component {
    @observable waiting = false;
    @observable isLimitReached = false;
    handleAccept = (selected) => {
        this.waiting = true;
        const chat = chatStore.startChat(selected);

        when(() => chat.added === true, () => {
            window.router.push('/app/chats');
        });
    };

    handleClose() {
        window.router.push('/app/chats');
    }

    gotoNewChannel() {
        window.router.push('/app/new-channel');
    }

    render() {
        if (this.waiting) {
            return (<div className="create-new-chat">
                <div className="user-picker flex-justify-center"><ProgressBar type="circular" /></div>
            </div>);
        }
        const channelLimit = (User.current && User.current.channelLimit) || config.maxFreeChannels;
        const limitUpgradeOffer = chatStore.channels.length < channelLimit ? <ChannelCreateOffer /> : <ChannelUpgradeOffer />;
        return (
            <div className="create-new-chat">
                <UserPicker
                    limit={config.maxDMParticipants} limitUpgradeOffer={limitUpgradeOffer}
                    title={t('title_chatWith')}
                    onChange={contacts => (this.isLimitReached = contacts.length >= config.maxDMParticipants)}
                    onAccept={this.handleAccept} onClose={this.handleClose} />
                {!this.isLimitReached && <div className="chat-channel-switch">
                    <T k="title_goCreateChannel" />
                    <Button label={t('button_createChannel')} flat primary onClick={this.gotoNewChannel} />
                </div>}
            </div>
        );
    }
}


module.exports = NewChat;
