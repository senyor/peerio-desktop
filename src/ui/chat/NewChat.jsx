const React = require('react');
const { observable, when } = require('mobx');
const { observer } = require('mobx-react');
const { chatStore, User } = require('~/icebear');
const UserPicker = require('~/ui/shared-components/UserPicker');
const { t } = require('peerio-translator');
const T = require('~/ui/shared-components/T');
const { ProgressBar, Button, Link } = require('~/react-toolbox');
const config = require('../../config');
const ChannelCreateOffer = require('./components/ChannelCreateOffer');

@observer
class NewChat extends React.Component {
    @observable waiting = false;
    @observable picker;

    handleAccept = (selected) => {
        this.waiting = true;
        const chat = chatStore.startChat(selected);
        if (!chat) {
            this.waiting = false;
            return;
        }
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

    setRef = (ref) => {
        this.picker = ref;
    }

    pickerStyle = { height: 'auto', width: '100%' };

    render() {
        if (this.waiting) {
            return (<div className="create-new-chat">
                <div className="user-picker flex-justify-center"><ProgressBar type="circular" /></div>
            </div>);
        }

        return (
            <div className="create-new-chat">
                <div style={this.pickerStyle}>
                    <UserPicker
                        ref={this.setRef}
                        limit={config.chat.maxDMParticipants}
                        title={t('title_chatWith')}
                        onAccept={this.handleAccept} onClose={this.handleClose} />
                </div>
                {
                    this.picker && this.picker.isLimitReached
                        ? <ChannelCreateOffer />
                        : <div className="chat-channel-switch">
                            <T k="title_goCreateChannel" />
                            <Button label={t('button_createChannel')} flat primary onClick={this.gotoNewChannel} />
                        </div>
                }
            </div>
        );
    }
}


module.exports = NewChat;
