const React = require('react');
const { Button, IconMenu, MenuItem } = require('~/react-toolbox');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { fileStore, chatStore, mailStore } = require('~/icebear'); // mailStore?
const MailItem = require('./components/MailItem');
const MailCompose = require('./components/MailCompose');
const MailSent = require('./components/MailSent');
const MailSidebar = require('./components/MailSidebar');

@observer
class Mail extends React.Component {
    @observable sent = true;


    componentWillMount() {
        mailStore.loadAllGhosts();
    }

    handleCompose = e => {
        this.currentGhost = mailStore.createGhost();
        this.sent = false;
    }

    handleSend = data => {
        console.log('send', data);
        this.currentGhost.send(data);
    }

    render() {
        // if (mailStore.ghosts.length === 0 && !mailStore.loading) return (
        //    <div>nothing here, zero screen</div>
        // );
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
                    {mailStore.ghosts.map((m) => {
                        return (<MailItem title={m.subject}
                                  date={m.timestamp}
                                  recipient={m.recipients}
                                  firstLine={m.preview}
                                  active />);
                    })}


                </div>
                { !this.sent ? <MailCompose ghost={this.currentGhost} onSend={this.handleSend} /> : <MailSent /> }
                <MailSidebar />

                <Button icon="add" floating accent onClick={this.handleCompose} />
            </div>
        );
    }


}

module.exports = Mail;
