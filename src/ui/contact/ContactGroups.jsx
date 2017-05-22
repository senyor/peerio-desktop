const React = require('react');
const { t } = require('peerio-translator');
const { FontIcon, List, ListItem, ListDivider } = require('~/react-toolbox');
const { observer } = require('mobx-react');

@observer
class ContactGroups extends React.Component {
    inviteContact = () => {
        window.router.push('/app/contact-invite');
    };

    render() {
        return (
            // TODO: add more generic class
            <div className="contact-groups">
                <div className="wrapper-button-add-chat" onClick={this.inviteContact}>
                    <FontIcon value="add" />
                    <div>{t('title_inviteAContact')}</div>
                </div>
                <List selectable ripple>
                    <ListItem caption="Your contacts (34)" />
                    <ListItem caption="Invited contacts (3)" />
                    <ListDivider />
                    <ListItem caption="All contacts (56)" />
                </List>
            </div>
        );
    }
}

module.exports = ContactGroups;
