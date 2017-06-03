const React = require('react');
const { observable, computed } = require('mobx');
const { observer } = require('mobx-react');
const { FontIcon, Input, List, ListItem, TooltipIconButton, Dropdown } = require('~/react-toolbox');
const Avatar = require('~/ui/shared-components/Avatar');
const { contactStore } = require('~/icebear');
const { t } = require('peerio-translator');
const moment = require('moment');

@observer
class InvitedContacts extends React.Component {

    contactActions() {
        return (<div>
            <TooltipIconButton icon="forum" tooltip={t('title_haveAChat')} tooltipPosition="left" />
            {this.added
                ? <TooltipIconButton icon="delete" tooltip={t('button_delete')} tooltipPosition="left" />
                : <TooltipIconButton icon="person_add" tooltip={t('button_addToYourContacts')} tooltipPosition="left" />}
        </div>
        );
    }

    render() {
        return (
            <div className="contacts-view">
                <div className="toolbar" />

                <div className="list-sort" />

                <div className="contact-list">
                    <List selectable ripple className="contact-list-section-content">
                        {contactStore.invitedContacts.map(c =>
                            (<ListItem key={c.email}
                                caption={c.email}
                                legend={moment(c.added).fromNow()}
                                rightIcon={this.contactActions()}
                            />)
                        )}
                    </List>
                </div>
            </div>

        );
    }
}

module.exports = InvitedContacts;
