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
        setTimeout(() => { uiStore.selectedMessage = null; });
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
    renderReceipt(r) {
        const c = contactStore.getContact(r.username);
        return r.receipt.signatureError
            ? null
            : <span data-username={c.username} key={c.username}>
                <ListItem
                    leftActions={[<Avatar key="a" contact={c} size="small" />]}
                    itemContent={
                        <span className="rt-list-itemContentRoot rt-list-large">
                            <span className="rt-list-itemText rt-list-primary">
                                {c.username}
                            </span>
                            <span className="rt-list-itemText">
                                {c.fullName}
                            </span>
                        </span>
                    }
                    onClick={this.openContact}
                />
            </span>;
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
                    {msg.receipts && msg.receipts.map(r => this.renderReceipt(r))}
                </List>
            </div>
        );
    }
}

module.exports = MessageSideBar;
