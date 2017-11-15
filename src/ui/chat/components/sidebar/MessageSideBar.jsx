const React = require('react');
const { reaction } = require('mobx');
const { observer } = require('mobx-react');
const { chatStore, systemMessages, contactStore } = require('~/icebear');
const uiStore = require('~/stores/ui-store');
const { List, ListItem, IconButton } = require('~/react-toolbox');
const Avatar = require('~/ui/shared-components/Avatar');
const T = require('~/ui/shared-components/T');
const { t } = require('peerio-translator');
const { getAttributeInParentChain } = require('~/helpers/dom');

@observer
class MessageSideBar extends React.Component {
    validate = (chat) => {
        if (!uiStore.selectedMessage) return false;
        if (!chat || chat.id !== uiStore.selectedMessage.db.id) {
            this.close();
            return false;
        }
        return true;
    };

    componentWillMount() {
        this.reactionsToDispose = [
            reaction(() => chatStore.activeChat, this.validate)
        ];
    }
    componentWillUnmount() {
        this.reactionsToDispose.forEach(d => d());
    }

    openContact(ev) {
        const username = getAttributeInParentChain(ev.target, 'data-username');
        uiStore.contactDialogUsername = username;
    }
    close() {
        setTimeout(() => {
            uiStore.selectedMessage = null;
        });
    }
    renderMessage(m) {
        if (m.systemData) {
            return <em>{systemMessages.getSystemMessageText(m)}</em>;
        }
        return (<span>
            {m.files && m.files.length
                ? t('title_filesShared', { count: m.files.length })
                : m.text}
        </span>
        );
    }
    renderReceipt = (entry) => {
        return !entry || entry[1].signatureError
            ? null
            : <span data-username={entry[0].username} key={entry[0].username}>
                <ListItem
                    leftActions={[<Avatar key="a" contact={entry[0]} size="small" />]}
                    itemContent={
                        <span className="rt-list-itemContentRoot rt-list-large">
                            <span className="rt-list-itemText rt-list-primary">
                                {entry[0].username}
                            </span>
                            <span className="rt-list-itemText">
                                {entry[0].fullName}
                            </span>
                        </span>
                    }
                    onClick={this.openContact}
                />
            </span>;
    }
    compareReceipts(r1, r2) {
        if (!r1) return 1;
        if (!r2) return -1;
        return r1[0].fullNameAndUsername.localeCompare(r2[0].fullNameAndUsername);
    }
    getReceipts(msg) {
        const entries = chatStore.activeChat.receipts.entries();
        for (let i = 0; i < entries.length; i++) {
            if (+msg.id > entries[i][1].chatPosition) {
                entries[i] = null;
                continue;
            }
            entries[i][0] = contactStore.getContact(entries[i][0]);
        }
        entries.sort(this.compareReceipts);

        return entries.map(this.renderReceipt);
    }
    render() {
        if (!this.validate(chatStore.activeChat)) return null;
        const msg = uiStore.selectedMessage;
        return (
            <div className="message-sidebar">
                <div className="header">
                    <List>
                        <div className="title">
                            <T k="title_messageInfo" tag="div" className="list-header" />
                            <div className="close-button">
                                <IconButton icon="close" onClick={this.close} />
                            </div>
                        </div>
                        <ListItem selectable={false} ripple={false} className="active"
                            leftActions={[<Avatar key="a" contact={msg.sender} size="small" />]}
                            itemContent={
                                <span className="rt-list-itemContentRoot rt-list-large">
                                    <span className="rt-list-itemText rt-list-primary">
                                        {msg.sender.fullName}
                                    </span>
                                    <span className="rt-list-itemText">
                                        {this.renderMessage(msg)}
                                    </span>
                                </span>
                            }

                        />
                    </List>
                </div>
                <T k="title_readBy" tag="div" className="list-header" />

                <List className="receipts">
                    {this.getReceipts(msg)}
                </List>
            </div>
        );
    }
}

module.exports = MessageSideBar;
