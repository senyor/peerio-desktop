const React = require('react');
const { observable, computed, action } = require('mobx');
const { observer } = require('mobx-react');
const { contactStore } = require('peerio-icebear');
const { Avatar, Dialog, Input, List, ListItem, MaterialIcon, Button } = require('~/peer-ui');
const T = require('~/ui/shared-components/T');
const { t } = require('peerio-translator');
const { getContactByEvent } = require('~/helpers/icebear-dom');
const ModifyShareDialog = require('./ModifyShareDialog');

/**
 * onSelectContact
 * onSelectChannel
 */
@observer
class ShareWithMultipleDialog extends React.Component {
    @observable query = '';
    @observable visible = false;
    selectedUsers = observable.map();

    @action.bound handleTextChange(newVal) {
        this.query = newVal;
    }

    @computed get contacts() {
        return contactStore.filter(this.query, null, true).filter(c => !c.isDeleted)
            .sort((c1, c2) => c1.username.localeCompare(c2.username));
    }

    @action.bound async onContactClick(ev) {
        const contact = await getContactByEvent(ev);
        this.selectedUsers.set(contact.username, contact);
    }

    renderContact = (c) => {
        return (
            <div data-username={c.username} key={c.username}>
                <ListItem
                    leftContent={<Avatar key="a" contact={c} size="small" />}
                    onClick={this.onContactClick}>
                    <span className="full-name">{c.fullName}</span>
                    <span className="username">@{c.username}</span>
                </ListItem>
            </div>
        );
    }

    @action.bound show() {
        this.selectedUsers.clear();
        this.visible = true;
        return new Promise(resolve => { this.resolve = resolve; });
    }

    @action.bound close() {
        this.visible = false;
        this.resolve(null);
        this.resolve = null;
    }

    @action.bound share() {
        this.visible = false;
        this.resolve(this.selectedUsers.values());
        this.resolve = null;
    }

    get sharedWithBlock() {
        return this.selectedUsers.keys().map(username => (
            <Avatar
                key={username}
                username={username}
                size="tiny"
                clickable
                tooltip
            />
        ));
    }

    @action.bound modifySharedWith() {
        this.modifyShareDialog.show();
    }

    setModifyShareDialogRef = (ref) => { this.modifyShareDialog = ref; };

    render() {
        if (!this.visible) return false;
        const dialogActions = [
            { label: t('button_cancel'), onClick: this.close },
            { label: t('button_share'), onClick: this.share }
        ];

        return (
            <div>
                <ModifyShareDialog ref={this.setModifyShareDialogRef} contacts={this.selectedUsers.values()} />
                <Dialog active noAnimation
                    className="share-with-dialog share-folder"
                    actions={dialogActions}
                    onCancel={this.close}
                    title={t('title_shareWith')}>
                    <div className="share-with-contents">
                        <div className="user-search">
                            <MaterialIcon icon="search" />
                            <div className="chip-wrapper">
                                <Input
                                    placeholder={t('title_userSearch')}
                                    value={this.query} onChange={this.handleTextChange}
                                    onKeyDown={this.handleKeyDown} />
                            </div>
                        </div>
                        <div className="chat-list-container">
                            <div className="list-dms-container">
                                <div className="p-list-heading">
                                    <T k="title_contacts" />
                                    &nbsp;({this.contacts.length})
                                </div>
                                <List className="list-chats list-dms" clickable>
                                    {this.contacts.map(this.renderContact)}
                                </List>
                            </div>
                        </div>
                        {!!this.selectedUsers.keys().length &&
                            <div className="receipt-wrapper">
                                <Button label={t('title_viewSharedWith')} onClick={this.modifySharedWith} />
                                {this.sharedWithBlock}
                            </div>}
                    </div>
                </Dialog>
            </div>
        );
    }
}

module.exports = ShareWithMultipleDialog;
