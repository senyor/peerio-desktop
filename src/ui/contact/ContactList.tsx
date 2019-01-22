import React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';

import { Dropdown, SearchInput, List } from 'peer-ui';
import { contactStore, chatStore, t } from 'peerio-icebear';
import { Contact } from 'peerio-icebear/dist/models';

import routerStore from '~/stores/router-store';
import UploadDialog from '~/ui/shared-components/UploadDialog';
import T from '~/ui/shared-components/T';

import ContactListItem from './ContactListItem';

@observer
export default class ContactList extends React.Component {
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

    startChat = (contact: Contact) => {
        chatStore.startChat([contact]);
        routerStore.navigateTo(routerStore.ROUTES.chats);
    };

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
                            testId="input_contactSearch"
                        />
                    </div>

                    <div className="list-sort">
                        <Dropdown
                            label={t('title_sort')}
                            options={[
                                { value: 'firstName', label: t('title_firstName') },
                                { value: 'lastName', label: t('title_lastName') },
                                { value: 'username', label: t('title_username') }
                            ]}
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
                                                onStartChat={this.startChat}
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
