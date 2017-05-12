const React = require('react');
const L = require('l.js');
const { observer } = require('mobx-react');
const BetterInput = require('~/ui/shared-components/BetterInput');
const { chatStore } = require('~/icebear');
const { t } = require('peerio-translator');

@observer
class ChatNameEditor extends React.Component {
    cancelNameEdit = () => {
        L.info('Cancel name edit');
    };

    acceptNameEdit = (val) => {
        L.info('new chat name:', val);
        chatStore.activeChat.rename(val);
    };

    setNameInputRef = (ref) => {
        this.nameInput = ref;
    };

    render() {
        return (
            <BetterInput label={this.props.showLabel ? t('title_title') : null}
                hint={t('title_chatNameHint')}
                className={this.props.className}
                onBlur={this.props.onBlur}
                onReject={this.cancelNameEdit}
                onAccept={this.acceptNameEdit}
                ref={this.setNameInputRef}
                value={chatStore.activeChat ? chatStore.activeChat._chatName : ''}
                tabIndex={this.props.tabIndex} />
        );
    }
}

module.exports = ChatNameEditor;
