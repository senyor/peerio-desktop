import React from 'react';
import { observable, computed, action, values, keys } from 'mobx';
import { observer } from 'mobx-react';
import css from 'classnames';

import { contactStore, User, t } from 'peerio-icebear';
import { Contact, Volume } from 'peerio-icebear/dist/models';
import { Avatar, Dialog, List, ListItem, MaterialIcon, Button, SearchInput } from 'peer-ui';

import { waitForContactLoaded } from '../../helpers/icebear';
import T from '~/ui/shared-components/T';
import { ModifyShareDialog } from './ModifyShareDialog';

type ShareContext = 'sharefiles' | 'sharefolders' | '';

@observer
export default class ShareWithMultipleDialog extends React.Component {
    /**
     * Reference to the promise resolver for returning the dialog result. When
     * the resolver is set to null, the dialog is hidden.
     */
    @observable.ref
    protected resolver: ((contactsToShareWith: Contact[] | null) => void) | null = null;

    @observable query = '';

    selectedUsers = observable.map<string, Contact>();

    /**
     * Can be present to indicate the item being shared already has an existing
     * share (that is, this will not be null if we're trying to share a folder
     * that's already shared.)
     */
    @observable folderWithExistingShare: Volume | null = null;

    @observable shareContext: ShareContext = '';

    modifyShareDialog = React.createRef<ModifyShareDialog>();

    @action.bound
    handleTextChange(newVal: string) {
        this.query = newVal;
    }

    get existingUsers() {
        return this.folderWithExistingShare ? this.folderWithExistingShare.otherParticipants : [];
    }

    filterExisting = (c: Contact) => {
        return !this.existingUsers.find(u => u.username === c.username);
    };

    @computed
    get contacts() {
        const selectedUsernames = keys(this.selectedUsers);
        let ret = contactStore.whitelabel
            .filter(this.query, this.shareContext)
            .filter(c => !c.isDeleted)
            .filter(c => c.username !== User.current.username)
            .sort((c1, c2) => c1.username.localeCompare(c2.username)) as Contact[];

        if (this.existingUsers && this.existingUsers.length > 0) {
            ret = ret.filter(this.filterExisting);
        }

        selectedUsernames.forEach(username => {
            if (!ret.find(c => c.username === username)) {
                ret.push(this.selectedUsers.get(username));
            }
        });
        return ret;
    }

    @action.bound
    async onContactClick(contact: Contact) {
        await waitForContactLoaded(contact);
        if (this.selectedUsers.has(contact.username)) {
            this.selectedUsers.delete(contact.username);
        } else {
            this.selectedUsers.set(contact.username, contact);
        }
    }

    @action.bound
    show(folderWithExistingShare: Volume, shareContext: ShareContext) {
        this.folderWithExistingShare = folderWithExistingShare;
        this.shareContext = shareContext;
        this.selectedUsers.clear();
        return new Promise<Contact[]>(resolve => {
            this.resolver = resolve;
        });
    }

    @action.bound
    close() {
        if (this.resolver) {
            this.resolver(null);
            this.resolver = null;
        }
        this.shareContext = '';
        this.folderWithExistingShare = null;
        this.query = '';
        this.selectedUsers.clear();
    }

    @action.bound
    share() {
        this.resolver(values(this.selectedUsers) as Contact[]);
        this.close();
    }

    get sharedWithBlock() {
        return this.existingUsers.map(c => (
            <Avatar key={c.username} contact={c} size="tiny" tooltip />
        ));
    }

    @action.bound
    modifySharedWith() {
        this.modifyShareDialog.current.show();
    }

    get usersSelected() {
        return this.selectedUsers.size;
    }

    render() {
        if (!this.resolver) return null;

        const dialogActions = [
            { label: t('button_cancel'), onClick: this.close },
            {
                label: t('button_share'),
                onClick: this.share,
                disabled: !this.usersSelected
            }
        ];
        const item = this.folderWithExistingShare;

        return (
            <div>
                {item && item.isFolder && item.isShared ? (
                    <ModifyShareDialog
                        ref={this.modifyShareDialog}
                        folder={item}
                        contacts={this.existingUsers}
                    />
                ) : null}
                <Dialog
                    active
                    noAnimation
                    className="share-with-dialog share-folder"
                    actions={dialogActions}
                    onCancel={this.close}
                    title={t('title_shareWith')}
                >
                    <div className="share-with-contents">
                        <SearchInput
                            placeholder={t('title_userSearch')}
                            value={this.query}
                            onChange={this.handleTextChange}
                        />
                        <div className="chat-list-container">
                            <div className="list-dms-container">
                                <div className="p-list-heading">
                                    <T k="title_contacts" />
                                    &nbsp;({this.contacts.length})
                                </div>
                                <List className="list-chats list-contacts" clickable>
                                    {this.contacts.map(c => {
                                        const selected = this.selectedUsers.has(c.username);
                                        return (
                                            <ListedContact
                                                key={c.username}
                                                contact={c}
                                                selected={selected}
                                                onContactClick={this.onContactClick}
                                            />
                                        );
                                    })}
                                </List>
                            </div>
                        </div>
                        {item && item.isFolder && item.isShared && this.existingUsers.length ? (
                            <div className="receipt-wrapper">
                                <Button
                                    label={t('title_viewSharedWith')}
                                    onClick={this.modifySharedWith}
                                />
                                {this.sharedWithBlock}
                            </div>
                        ) : null}
                        {item && item.isFolder && !item.isShared && !item.parent.isRoot ? (
                            <div className="move-to-root-notif p-list-heading">
                                <MaterialIcon icon="info" />
                                <T k="title_shareWillMoveToRoot" />
                            </div>
                        ) : null}
                    </div>
                </Dialog>
            </div>
        );
    }
}

interface ListedContactProps {
    contact: Contact;
    selected: boolean;
    onContactClick: (c: Contact) => void;
}

class ListedContact extends React.Component<ListedContactProps> {
    onClick = () => {
        this.props.onContactClick(this.props.contact);
    };

    render() {
        const { contact, selected } = this.props;
        return (
            <ListItem
                className={css({ selected })}
                leftIcon={selected ? 'check_box' : 'check_box_outline_blank'}
                leftContent={<Avatar key="a" contact={contact} size="small" />}
                onClick={this.onClick}
            >
                <span className="full-name">{contact.fullName}</span>
                <span className="username">@{contact.username}</span>
            </ListItem>
        );
    }
}
