const React = require('react');
const { Button, IconMenu, MenuItem } = require('~/react-toolbox');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { fileStore, chatStore } = require('~/icebear'); // mailStore?
const MailItem = require('./components/MailItem');
const MailCompose = require('./components/MailCompose');
const MailSent = require('./components/MailSent');
const MailSidebar = require('./components/MailSidebar');

@observer
class Mail extends React.Component {
    @observable sent = false;

    render() {
        return (
            <div className="mail">
                <div className="mail-list">
                    <div className="mail-sorting">
                        <div>
                            Sort by <strong>Unread</strong>
                        </div>
                        <IconMenu icon="arrow_drop_down">
                            <MenuItem caption="Attachments" />
                            <MenuItem caption="Date" />
                            <MenuItem caption="Recipient" />
                            <MenuItem caption="Unread" />
                        </IconMenu>
                    </div>
                    <MailItem title="A spookymail for you"
                              date="May 2, 1942"
                              recipient="my@email.com"
                              firstLine="this is creepy or something"
                              active />

                    <MailItem title="A spookymail for you"
                              date="May 2, 1942"
                              recipient="my@email.com"
                              firstLine="this is creepy or something" />
                    <MailItem title="A spookymail for you"
                              date="May 2, 1942"
                              recipient="my@email.com"
                              firstLine="this is creepy or something" />
                </div>
                { !this.sent ? <MailCompose /> : <MailSent /> }
                <MailSidebar />

                <Button icon="add" floating accent />
            </div>
        );
    }


}

module.exports = Mail;
