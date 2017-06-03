const React = require('react');
const { observer } = require('mobx-react');
const { chatStore } = require('~/icebear');
const UserPicker = require('~/ui/shared-components/UserPicker');
const { t } = require('peerio-translator');

@observer
class NewChat extends React.Component {
    handleAccept = (selected) => {
        chatStore.startChat(selected);
        window.router.push('/app');
    };

    handleClose = () => {
        window.router.push('/app');
    };

    render() {
        return (
            <div className="create-new-chat">
                <UserPicker title={t('title_chatWith')} onAccept={this.handleAccept} onClose={this.handleClose} />
            </div>
        );
    }
}


module.exports = NewChat;
