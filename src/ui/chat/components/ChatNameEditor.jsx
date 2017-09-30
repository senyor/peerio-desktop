const React = require('react');
const { observer } = require('mobx-react');
const BetterInput = require('~/ui/shared-components/BetterInput');
const { chatStore, config } = require('~/icebear');
const { t } = require('peerio-translator');

@observer
class ChatNameEditor extends React.Component {
    cancelNameEdit = () => {
        console.log('Cancel name/purpose edit');
    };

    acceptNameEdit = (val) => {
        try {
            if (this.props.purpose) {
                chatStore.activeChat.changePurpose(val);
            } else {
                chatStore.activeChat.rename(val);
            }
        } catch (err) {
            console.error(err);
        }
    };

    setNameInputRef = (ref) => {
        this.nameInput = ref;
    };

    render() {
        const chat = chatStore.activeChat;
        if (!chat || !chat.chatHead) return null;

        const hint = this.props.purpose ? 'title_chatPurposeHint' : 'title_chatNameHint';
        const label = this.props.purpose ? 'title_purpose' : 'title_title';
        const value = this.props.purpose ? chat.chatHead.purpose : chat.chatHead.chatName;
        const displayValue = this.props.purpose ? chat.purpose : chat.name;
        return (
            <BetterInput label={this.props.showLabel ? t(label) : null}
                hint={t(hint)}
                className={this.props.className}
                onFocus={this.onFocus}
                onBlur={this.props.onBlur}
                onReject={this.cancelNameEdit}
                onAccept={this.acceptNameEdit}
                ref={this.setNameInputRef}
                value={value}
                displayValue={displayValue}
                tabIndex={this.props.tabIndex}
                readOnly={this.props.readOnly}
                multiline={this.props.multiline}
                maxLength={this.props.purpose ? config.chat.maxChatPurposeLength : config.chat.maxChatNameLength}
            />

        );
    }
}

module.exports = ChatNameEditor;
