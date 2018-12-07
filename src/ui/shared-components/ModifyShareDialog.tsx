import React from 'react';
import { observable, computed, action, IObservableArray } from 'mobx';
import { observer } from 'mobx-react';
import css from 'classnames';

import { t } from 'peerio-icebear';
import { Contact, Volume } from 'peerio-icebear/dist/models';
import { Avatar, Dialog, List, ListItem, Button } from 'peer-ui';

import T from '~/ui/shared-components/T';

interface ModifyShareDialogProps {
    contacts: Contact[];
    folder: Volume;
}

@observer
export class ModifyShareDialog extends React.Component<ModifyShareDialogProps> {
    @observable visible = false;
    @observable selection = [] as IObservableArray<Contact>;

    resolve: (() => void) | null = null;

    componentDidMount() {
        this.selection = [] as IObservableArray<Contact>;
    }

    @action.bound
    toggleRemove(contact: Contact) {
        // if contact was not in the array, push it there. If it was - it's now removed
        if (!this.selection.remove(contact)) {
            this.selection.push(contact);
        }
    }

    @computed
    get contacts() {
        return this.props.contacts;
    }

    @action.bound
    show() {
        this.visible = true;
        return new Promise(resolve => {
            this.resolve = resolve;
        });
    }

    @action.bound
    close() {
        this.visible = false;
        this.selection = [] as IObservableArray<Contact>;
        this.resolve();
        this.resolve = null;
    }

    @action.bound
    removeSelectedContacts() {
        this.props.folder.removeParticipants(this.selection);
        this.close();
    }

    render() {
        if (!this.visible) return false;
        const dialogActions = [{ label: t('button_cancel'), onClick: this.close }];
        if (this.selection.length) {
            dialogActions.push({ label: t('button_save'), onClick: this.removeSelectedContacts });
        }
        return (
            <Dialog
                active
                noAnimation
                className="share-with-dialog share-folder modify-shared-with"
                actions={dialogActions}
                onCancel={this.close}
                title={t('title_sharedWith')}
            >
                <div className="share-with-contents">
                    <div className="chat-list-container">
                        <div className="list-dms-container">
                            <div className="p-list-heading">
                                <T k="title_contacts" />
                                &nbsp;({this.contacts.length})
                            </div>
                            <List className="list-chats list-dms">
                                {this.contacts.map(c => {
                                    return (
                                        <ModifyShareListItem
                                            key={c.username}
                                            contact={c}
                                            folder={this.props.folder}
                                            toggleRemove={this.toggleRemove}
                                        />
                                    );
                                })}
                            </List>
                        </div>
                    </div>
                    <div className="receipt-wrapper">
                        <Button
                            icon="person_add"
                            label={t('title_shareWithOthers')}
                            onClick={this.close}
                        />
                    </div>
                </div>
            </Dialog>
        );
    }
}

interface ModifyShareListItemProps {
    contact: Contact;
    folder: Volume;
    toggleRemove: (c: Contact) => void;
}

@observer
export class ModifyShareListItem extends React.Component<ModifyShareListItemProps> {
    @observable isClicked = false;

    @action.bound
    handleRemoveAndUndo() {
        this.isClicked = !this.isClicked;
        this.props.toggleRemove(this.props.contact);
    }

    render() {
        const c = this.props.contact;
        const fileCount = this.props.folder.store.getFilesSharedBy(c.username).length;
        return (
            <ListItem
                className={css('modify-share-list-item', {
                    expanded: this.isClicked
                })}
                leftContent={<Avatar key="a" contact={c} size="small" />}
                rightContent={
                    this.isClicked ? (
                        <Button onClick={this.handleRemoveAndUndo}>{t('button_undo')}</Button>
                    ) : this.props.folder.owner === c.username ? (
                        <T k="title_owner" className="badge" />
                    ) : (
                        <Button icon="remove_circle_outline" onClick={this.handleRemoveAndUndo} />
                    )
                }
            >
                <div>
                    <span className="full-name">{c.fullName}</span>
                    <span className="username">@{c.username}</span>
                    &nbsp;
                    {this.isClicked && <T k="title_removed" className="badge red" />}
                </div>

                {this.isClicked && fileCount ? (
                    <T k="title_unshareUserWarning" tag="div" className="remove-user-warning">
                        {{
                            fileCount,
                            user: c.firstName
                        }}
                    </T>
                ) : null}
            </ListItem>
        );
    }
}
