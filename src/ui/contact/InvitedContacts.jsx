const React = require('react');
const { observable, computed } = require('mobx');
const { observer } = require('mobx-react');
const { FontIcon, Input, List, ListItem, TooltipIconButton, Dropdown } = require('~/react-toolbox');
const Avatar = require('~/ui/shared-components/Avatar');
const { contactStore } = require('~/icebear');
const { t } = require('peerio-translator');
const moment = require('moment');
const { getAttributeInParentChain } = require('~/helpers/dom');

@observer
class InvitedContacts extends React.Component {
    removeInvite(ev) {
        const email = getAttributeInParentChain(ev.target, 'data-id');
        // constctStore.removeInvite(email);
        console.error('Removie invite not implemented yet');
    }
    resendInvite(ev) {
        const email = getAttributeInParentChain(ev.target, 'data-id');
        contactStore.invite(email);
    }
    contactActions(c) {
        return (
            <div data-id={c.email}>
                <TooltipIconButton icon="email" tooltip={t('button_resendInvite')} tooltipPosition="left" onClick={this.resendInvite} />
                <TooltipIconButton icon="delete" tooltip={t('button_delete')} tooltipPosition="left" onClick={this.removeInvite} />
            </div>
        );
    }

    render() {
        return (
            <div className="contacts-view">
                <div className="toolbar" />

                <div className="list-sort" />

                <div className="contact-list">
                    <List className="contact-list-section-content">
                        {contactStore.invitedContacts.map(c =>
                            (<ListItem ripple={false} key={c.email}
                            leftIcon={<div className="avatar-invited material-icons">person</div>}
                                caption={c.email}
                                legend={`${t('title_invited')} ${moment(c.added).fromNow()}`}
                                rightIcon={this.contactActions(c)}
                            />)
                            )}
                    </List>
                </div>
            </div>

        );
    }
}

module.exports = InvitedContacts;
