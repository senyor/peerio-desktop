const React = require('react');
const { observable, computed } = require('mobx');
const { observer } = require('mobx-react');
const { FontIcon, Input, List, ListItem, TooltipIconButton, Dropdown } = require('~/react-toolbox');
const Avatar = require('~/ui/shared-components/Avatar');
const { contactStore, chatStore } = require('~/icebear');
const { t } = require('peerio-translator');
const { getAttributeInParentChain } = require('~/helpers/dom');

@observer
class ContactList extends React.Component {

    sortOptions = [
        { value: 'firstName', label: t('title_firstName') },
        { value: 'lastName', label: t('title_lastName') },
        { value: 'username', label: t('title_username') }
    ];

    startChat(ev) {
        const username = getAttributeInParentChain(ev.target, 'data-id');
        chatStore.startChat([contactStore.getContact(username)]);
        window.router.push('/app');
    }

    removeContact(ev) {
        const username = getAttributeInParentChain(ev.target, 'data-id');
        contactStore.removeContact(username);
    }

    addContact(ev) {
        const username = getAttributeInParentChain(ev.target, 'data-id');
        contactStore.addContact(username);
    }

    contactActions(c) {
        return (<div data-id={c.username}>
            <TooltipIconButton icon="forum" tooltip={t('title_haveAChat')} onClick={this.startChat} />
            {c.isAdded
                ? <TooltipIconButton icon="delete" tooltip={t('button_delete')} onClick={this.removeContact} />
                : <TooltipIconButton icon="person_add" tooltip={t('button_addToYourContacts')} onClick={this.addContact} />}
        </div>
        );
    }

    handleSortChange(val) {
        contactStore.uiViewSortBy = val;
    }
    handleSearchQueryChange(val) {
        contactStore.uiViewSearchQuery = val;
    }

    render() {
        return (
            <div className="contacts-view">
                <div className="toolbar">
                    <FontIcon value="search" />
                    <Input placeholder={t('title_findInYourContacts')} value={contactStore.uiViewSearchQuery}
                        onChange={this.handleSearchQueryChange} />
                </div>

                <div className="list-sort">
                    Sort by:
                    <Dropdown className="sort-filter"
                        source={this.sortOptions}
                        onChange={this.handleSortChange}
                        value={contactStore.uiViewSortBy} />
                </div>

                <div className="contact-list">
                    {contactStore.uiView.map(section =>
                        (
                            <div key={section.letter} className="contact-list-section">
                                <div className="contact-list-section-marker">
                                    {section.letter}
                                </div>
                                <List className="contact-list-section-content">
                                    {section.items.map(c =>
                                        (
                                            <ListItem key={c.username} ripple={false}
                                                leftActions={[<Avatar key="a" contact={c} size="medium" />]}
                                                caption={c.username}
                                                legend={`${c.firstName} ${c.lastName}`}
                                                rightIcon={this.contactActions(c)}
                                            />
                                        )
                                    )}
                                </List>
                            </div>
                        )
                    )}
                </div>
            </div>

        );
    }
}

module.exports = ContactList;
