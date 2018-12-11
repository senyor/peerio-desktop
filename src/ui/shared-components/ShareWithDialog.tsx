import React from 'react';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';

import { chatStore, contactStore, User, t } from 'peerio-icebear';
import { Contact, Chat } from 'peerio-icebear/dist/models';
import { Avatar, Dialog, List, ListItem, SearchInput } from 'peer-ui';

import T from '~/ui/shared-components/T';

import { waitForContactLoaded } from '~/helpers/icebear';

type ShareContext = 'sharefiles' | 'sharefolders' | '';

interface ShareWithDialogProps {
    context: ShareContext;
    deactivate: () => void;
    onSelectChannel: (chat: Chat) => void;
    onSelectContact: (contact: Contact) => void;
}

@observer
export default class ShareWithDialog extends React.Component<ShareWithDialogProps> {
    @observable query = '';

    @action.bound
    handleTextChange(newVal: string) {
        this.query = newVal;
    }

    @computed
    get contacts() {
        return contactStore.whitelabel
            .filter(this.query, this.props.context)
            .filter(c => c.username !== User.current.username)
            .sort((c1, c2) => c1.username.localeCompare(c2.username));
    }

    @computed
    get channels() {
        let result = chatStore.channels;
        if (this.query) result = result.filter(c => c.name.startsWith(this.query));
        return result;
    }

    @action.bound
    async onChannelClick(chat: Chat) {
        this.props.deactivate();
        await chatStore.getChatWhenReady(chat.id);
        this.props.onSelectChannel(chat);
    }

    @action.bound
    async onContactClick(contact: Contact) {
        this.props.deactivate();
        await waitForContactLoaded(contact);
        this.props.onSelectContact(contact);
    }

    cancelDialog = () => {
        this.props.deactivate();
    };

    render() {
        const dialogActions = [{ label: t('button_close'), onClick: this.cancelDialog }];

        return (
            <Dialog
                active
                noAnimation
                className="share-with-dialog"
                actions={dialogActions}
                onCancel={this.cancelDialog}
                title={t('title_shareWith')}
            >
                <div className="share-with-contents">
                    <SearchInput
                        placeholder={t('title_enterRoomOrContact')}
                        value={this.query}
                        onChange={this.handleTextChange}
                        noHelperText
                    />
                    <div className="chat-list-container">
                        <div className="list-channels-container">
                            <div className="p-list-heading">
                                <T k="title_channels" />
                                &nbsp;({this.channels.length})
                            </div>
                            <List className="list-chats list-channels" clickable>
                                {this.channels.map(c => (
                                    <ListChannel
                                        key={c.name}
                                        channel={c}
                                        onChannelClick={this.onChannelClick}
                                    />
                                ))}
                            </List>
                        </div>
                        <div className="list-dms-container">
                            <div className="p-list-heading">
                                <T k="title_contacts" />
                                &nbsp;({this.contacts.length})
                            </div>
                            <List className="list-chats list-dms" clickable>
                                {this.contacts.map(c => (
                                    <ListContact
                                        key={c.username}
                                        contact={c}
                                        onContactClick={this.onContactClick}
                                    />
                                ))}
                            </List>
                        </div>
                    </div>
                </div>
            </Dialog>
        );
    }
}

interface ListChannelProps {
    channel: Chat;
    onChannelClick: (c: Chat) => void;
}

class ListChannel extends React.Component<ListChannelProps> {
    onClick = () => {
        this.props.onChannelClick(this.props.channel);
    };

    render() {
        const { channel } = this.props;
        return <ListItem onClick={this.onClick} caption={`# ${channel.name}`} />;
    }
}

interface ListContactProps {
    contact: Contact;
    onContactClick: (c: Contact) => void;
}

class ListContact extends React.Component<ListContactProps> {
    onClick = () => {
        this.props.onContactClick(this.props.contact);
    };

    render() {
        const { contact } = this.props;
        return (
            <ListItem
                leftContent={<Avatar key="a" contact={contact} size="medium" />}
                caption={contact.username}
                legend={contact.fullName}
                onClick={this.onClick}
            />
        );
    }
}
