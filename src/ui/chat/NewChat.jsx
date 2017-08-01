const React = require('react');
const { observable, when } = require('mobx');
const { observer } = require('mobx-react');
const { chatStore } = require('~/icebear');
const UserPicker = require('~/ui/shared-components/UserPicker');
const { t } = require('peerio-translator');
const T = require('~/ui/shared-components/T');
const { ProgressBar, Button } = require('~/react-toolbox');

@observer
class NewChat extends React.Component {
    @observable waiting = false;
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
        return (
            <div className="create-new-chat">
                <UserPicker title={t('title_chatWith')} onAccept={this.handleAccept} onClose={this.handleClose} />
                <div className="chat-channel-switch">
                    <T k="title_goCreateChannel" />
                    <Button label={t('button_createChannel')} flat primary onClick={this.gotoNewChannel} />
                </div>
            </div>
        );
    }
}


module.exports = NewChat;
