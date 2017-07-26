const React = require('react');
const { observable, when } = require('mobx');
const { observer } = require('mobx-react');
const { chatStore } = require('~/icebear');
const UserPicker = require('~/ui/shared-components/UserPicker');
const { t } = require('peerio-translator');
const { ProgressBar } = require('~/react-toolbox');

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

    handleClose = () => {
        window.router.push('/app/chats');
    };

    render() {
        return (
            <div className="create-new-chat">
                {this.waiting ?
                    <div className="user-picker flex-justify-center"><ProgressBar type="circular" /></div>
                    :
                    <UserPicker title={t('title_chatWith')} onAccept={this.handleAccept} onClose={this.handleClose} />
                }
            </div>
        );
    }
}


module.exports = NewChat;
