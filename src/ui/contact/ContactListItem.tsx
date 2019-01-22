import React from 'react';
import { observer } from 'mobx-react';
import { DropTarget } from 'react-dnd';
import css from 'classnames';

import { Avatar, Button, ListItem } from 'peer-ui';
import { contactStore, t } from 'peerio-icebear';
import { Contact } from 'peerio-icebear/dist/models';

import DragDropTypes from '../files/helpers/dragDropTypes';

interface ContactListItemProps {
    contact: Contact;
    setShareContext: (contact: Contact, files: string[]) => void;
    onStartChat: (contacts: Contact) => void;
    connectDropTarget?: (el: JSX.Element) => JSX.Element;
    isBeingDraggedOver?: boolean;
}

@DropTarget<ContactListItemProps>(
    [DragDropTypes.NATIVEFILE],
    {
        drop(props, monitor) {
            if (monitor.didDrop()) return; // drop was already handled
            props.setShareContext(props.contact, monitor.getItem().files.map(f => f.path));
        }
    },
    (connect, monitor) => ({
        connectDropTarget: connect.dropTarget(),
        isBeingDraggedOver: monitor.isOver({ shallow: true })
    })
)
@observer
export default class ContactListItem extends React.Component<ContactListItemProps> {
    startChat = () => {
        this.props.onStartChat(this.props.contact);
    };

    addContact = () => {
        contactStore.addContact(this.props.contact.username);
    };

    removeContact = () => {
        contactStore.removeContact(this.props.contact.username);
    };

    render() {
        const { contact, isBeingDraggedOver, connectDropTarget } = this.props;
        return connectDropTarget(
            <div className="contact-list-item-wrapper">
                <div
                    className={css('contact-list-item', {
                        'contact-list-item-droppable-hovered': isBeingDraggedOver
                    })}
                >
                    <ListItem
                        leftContent={<Avatar key="a" contact={contact} size="medium" />}
                        legend={contact.username}
                        caption={`${contact.firstName} ${contact.lastName}`}
                        rightContent={
                            <div>
                                {contact.isDeleted ? null : (
                                    <Button
                                        icon="forum"
                                        tooltip={t('title_haveAChat')}
                                        onClick={this.startChat}
                                    />
                                )}
                                {contact.isAdded ? (
                                    <Button
                                        className="gold"
                                        icon="star"
                                        tooltip={t('button_removeFavourite')}
                                        onClick={this.removeContact}
                                    />
                                ) : (
                                    <Button
                                        icon="star_outline"
                                        tooltip={t('button_addFavourite')}
                                        onClick={this.addContact}
                                    />
                                )}
                            </div>
                        }
                        data-test-id={`listItem_${contact.username}`}
                    />
                </div>
            </div>
        );
    }
}
