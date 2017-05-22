const React = require('react');
const { observable, computed } = require('mobx');
const { observer } = require('mobx-react');
const { FontIcon, Input, List, ListItem, TooltipIconButton } = require('~/react-toolbox');
const ContactGroups = require('./ContactGroups');
const Avatar = require('~/ui/shared-components/Avatar');
const { contactStore } = require('~/icebear');
const { t } = require('peerio-translator');

@observer
class Contacts extends React.Component {
    @observable query = '';
    @computed get options() {
        return contactStore.filter(this.query);
    }

    contactActions() {
        return (<div>
            <TooltipIconButton icon="forum" tooltip={t('title_haveAChat')} />
            <TooltipIconButton icon="delete" tooltip={t('button_delete')} />
        </div>
        );
    }

    render() {
        return (
            <div className="contacts">
                <ContactGroups />
                <div className="contacts-view">
                    <div className="toolbar">
                        <FontIcon value="search" />
                        <Input placeholder="Find a contact" />
                    </div>
                    <div className="list-sort">
                        Sort by: <strong>First name</strong> <FontIcon value="keyboard_arrow_down" />
                    </div>

                    <div className="contact-list">
                        {/* A section per letter. */}
                        <div className="contact-list-section">
                            <div className="contact-list-section-marker">
                              A
                            </div>
                            <List selectable ripple className="contact-list-section-content">
                                {this.options.map(c =>
                                    (<ListItem key={c.username}
                                        leftActions={[<Avatar key="a" contact={c} />]}
                                        caption={c.username}
                                        legend={`${c.firstName} ${c.lastName}`}
                                        rightIcon={
                                          this.contactActions()
                                        } />)
                                )}
                            </List>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = Contacts;
