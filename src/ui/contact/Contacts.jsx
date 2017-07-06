const React = require('react');
const { t } = require('peerio-translator');
const { FontIcon, List, ListItem, ListDivider } = require('~/react-toolbox');
const { action } = require('mobx');
const { observer } = require('mobx-react');
const routerStore = require('~/stores/router-store');
const { contactStore } = require('~/icebear');
const css = require('classnames');

@observer
class Contacts extends React.Component {
    @action toAddNew() {
        routerStore.navigateTo(routerStore.ROUTES.newContact);
    }

    @action toAdded() {
        contactStore.uiViewFilter = 'added';
        routerStore.navigateTo(routerStore.ROUTES.contacts);
    }
    @action toInvited() {
        routerStore.navigateTo(routerStore.ROUTES.invitedContacts);
    }

    @action toAll() {
        contactStore.uiViewFilter = 'all';
        routerStore.navigateTo(routerStore.ROUTES.contacts);
    }

    render() {
        const isAddedActive = routerStore.currentRoute === routerStore.ROUTES.contacts
            && contactStore.uiViewFilter === 'added';
        const isAllActive = routerStore.currentRoute === routerStore.ROUTES.contacts
            && contactStore.uiViewFilter === 'all';
        const isInvitedActive = routerStore.currentRoute === routerStore.ROUTES.invitedContacts;
        return (
            <div className="contacts">
                <div className="feature-navigation-list">
                    <div className="feature-action" onClick={this.toAddNew}>
                        <FontIcon value="add" />
                        <div>{t('button_addAContact')}</div>
                    </div>
                    <List selectable ripple className="list">
                        <ListItem leftIcon="star"
                            caption={`${t('title_favoriteContacts')} (${contactStore.addedContacts.length})`}
                            className={css({ active: isAddedActive })}
                            onClick={this.toAdded} />
                        <ListItem leftIcon="people"
                            caption={`${t('title_allContacts')} (${contactStore.contacts.length})`}
                            className={css({ active: isAllActive })}
                            onClick={this.toAll} />
                        <ListDivider />
                        <ListItem leftIcon="person_add"
                            caption={`${t('title_invitedContacts')} (${contactStore.invitedContacts.length})`}
                            className={css({ active: isInvitedActive })}
                            onClick={this.toInvited} />
                    </List>
                </div>
                {this.props.children}
            </div>
        );
    }
}

module.exports = Contacts;
