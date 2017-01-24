const React = require('react');
const { Button, IconMenu, MenuItem } = require('~/react-toolbox');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { fileStore, chatStore, mailStore } = require('~/icebear');
const MailItem = require('./components/MailItem');
const MailCompose = require('./components/MailCompose');
const MailSent = require('./components/MailSent');

@observer
class Mail extends React.Component {
    @observable sent = true;

    componentWillMount() {
        mailStore.loadAllGhosts();
    }

    handleCompose = e => {
        const newGhost = mailStore.createGhost();
        mailStore.selectedId = newGhost.ghostId;
        this.sent = false;
    };

    handleSend = data => {
        mailStore.selectedGhost.send(data);
    };

    renderMiddle() {
        if (mailStore.selectedGhost.sent) {
            return (
                <MailSent ghost={mailStore.selectedGhost} />

            );
        }
        return (

            <MailCompose ghost={mailStore.selectedGhost} onSend={this.handleSend} />

        );
    }

    render() {
        console.log('mailstore', mailStore.ghosts);
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
                        return (<MailItem key={m.ghostId}
                                          ghostId={m.ghostId}
                                          subject={m.subject}
                                          date={m.timestamp}
                                          recipient={m.recipients}
                                          firstLine={m.preview}
                                          active={false} />
                        );
                    })}
                </div>
                {mailStore.selectedId && !mailStore.loading ? this.renderMiddle() : null }
                <Button icon="add" floating accent onClick={this.handleCompose} />
            </div>
        );
    }


}

module.exports = Mail;
