import React from 'react';
import { observer } from 'mobx-react';
import BetterInput from '~/ui/shared-components/BetterInput';
import { chatStore, config, t } from 'peerio-icebear';
import ELEMENTS from '~/whitelabel/helpers/elements';

@observer
class ChatNameEditor extends React.Component {
    acceptNameEdit = val => {
        try {
            if (this.props.purpose) {
                chatStore.activeChat.changePurpose(val);
            } else {
                ELEMENTS.chatEditor.saveNameChanges(val);
            }
        } catch (err) {
            console.error(err);
        }
    };

    render() {
        const chat = chatStore.activeChat;
        if (!chat || !chat.chatHead) return null;

        const hint = this.props.purpose ? 'title_chatPurposeHint' : 'title_chatNameHint';
        const label = this.props.purpose ? 'title_purpose' : 'title_title';
        const value = this.props.purpose ? chat.purpose : ELEMENTS.chatEditor.displayName(chat);
        return (
            <BetterInput
                label={this.props.showLabel ? t(label) : null}
                hint={t(hint)}
                className={this.props.className}
                onFocus={this.props.onFocus}
                onBlur={this.props.onBlur}
                onReject={null}
                onAccept={this.acceptNameEdit}
                onKeyDown={this.props.onKeyDown}
                value={value}
                tabIndex={this.props.tabIndex}
                readOnly={this.props.readOnly}
                multiline={this.props.multiline}
                maxLength={
                    this.props.purpose
                        ? config.chat.maxChatPurposeLength
                        : config.chat.maxChatNameLength
                }
                theme="transparent"
                autoFocus={this.props.autoFocus}
            />
        );
    }
}

export default ChatNameEditor;
