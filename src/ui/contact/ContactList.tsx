import React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { DropTarget } from 'react-dnd';
import css from 'classnames';

import { Avatar, Dropdown, SearchInput, Button, List, ListItem } from 'peer-ui';
import { contactStore, chatStore, t } from 'peerio-icebear';
import { Contact } from 'peerio-icebear/dist/models';

import routerStore from '~/stores/router-store';
import UploadDialog from '~/ui/shared-components/UploadDialog';
import T from '~/ui/shared-components/T';
import DragDropTypes from '../files/helpers/dragDropTypes';

@observer
export default class ContactList extends React.Component {
    readonly sortOptions = [
        { value: 'firstName', label: t('title_firstName') },
        { value: 'lastName', label: t('title_lastName') },
        { value: 'username', label: t('title_username') }
    ];

    @observable.ref
    shareContext: { contact: Contact; files: string[] } | null = null;

    @action.bound
    setShareContext(contact: Contact, files: string[]) {
        this.shareContext = {
            contact,
            files
        };
    }

    @action.bound
    deactivateUploadDialog() {
        this.shareContext = null;
    }

    componentWillMount() {
        if (contactStore.uiView.length) return;
        this.goToAddContact();
    }

    goToAddContact = () => {
        routerStore.navigateTo(routerStore.ROUTES.newContact);
        contactStore.uiViewSearchQuery = '';
    };

    handleSortChange(val: string) {
        contactStore.uiViewSortBy = val;
    }

    handleSearchQueryChange(val: string) {
        contactStore.uiViewSearchQuery = val;
    }

    render() {
        const textParser = {
            searchString: contactStore.uiViewSearchQuery,
            toAddContact: text => (
                <a className="clickable" onClick={this.goToAddContact}>
                    {text}
                </a>
            )
        };
        return (
            <>
                {this.shareContext ? (
                    <UploadDialog
                        deactivate={this.deactivateUploadDialog}
                        files={this.shareContext.files}
                        initialTargetContact={this.shareContext.contact}
                    />
                ) : null}
                <div className="contacts-view">
                    <div className="toolbar">
                        <SearchInput
                            placeholder={t('title_findAContact')}
                            value={contactStore.uiViewSearchQuery}
                            onChange={this.handleSearchQueryChange}
                        />
                    </div>

                    <div className="list-sort">
                        <Dropdown
                            label={t('title_sort')}
                            options={this.sortOptions}
                            onChange={this.handleSortChange}
                            value={contactStore.uiViewSortBy}
                        />
                    </div>

                    {contactStore.uiView.length ? (
                        <div className="contact-list">
                            {contactStore.uiView.map(section => (
                                <div key={section.letter} className="contact-list-section">
                                    <div className="contact-list-section-marker">
                                        {section.letter}
                                    </div>
                                    <List className="contact-list-section-content" theme="large">
                                        {section.items.map(c => (
                                            <ContactListItem
                                                contact={c}
                                                key={c.username}
                                                setShareContext={this.setShareContext}
                                            />
                                        ))}
                                    </List>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-contact-found">
                            <T k="error_contactNotFound" className="text">
                                {textParser}
                            </T>
                            <img
                                src="./static/img/illustrations/no-results.svg"
                                draggable={false}
                            />
                        </div>
                    )}
                </div>
            </>
        );
    }
}

interface ContactListItemProps {
    contact: Contact;
    setShareContext: (contact: Contact, files: string[]) => void;
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
class ContactListItem extends React.Component<ContactListItemProps> {
    startChat = () => {
        chatStore.startChat([this.props.contact]);
        window.router.push('/app/chats');
    };

    removeContact = () => {
        contactStore.removeContact(this.props.contact.username);
    };

    addContact = () => {
        contactStore.addContact(this.props.contact.username);
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
                    />
                </div>
            </div>
        );
    }
}
