const React = require('react');
const { Button, IconMenu, MenuItem } = require('~/react-toolbox');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { mailStore } = require('~/icebear');
const MailItem = require('./components/MailItem');
const MailCompose = require('./components/MailCompose');
const MailSent = require('./components/MailSent');
const ZeroMail = require('./components/ZeroMail');

@observer
class Mail extends React.Component {
    @observable sent = true;

    componentWillMount() {
        mailStore.loadAllGhosts();
    }

    handleCompose = () => {
        const newGhost = mailStore.createGhost();
        this.sent = false;
    };

    handleSend = data => {
        mailStore.selectedGhost.send(data);
    };

    handleAttach = files => {
        mailStore.selectedGhost.attachFiles(files);
    };

    renderRight() {
        console.log('selected', mailStore.selectedId);
        if (mailStore.selectedGhost.sent) {
            return (
                <MailSent ghost={mailStore.selectedGhost} />
            );
        }
        return (
            <MailCompose
                ghost={mailStore.selectedGhost}
                onSend={this.handleSend}
                onFileShare={this.handleAttach}
            />
        );
    }

    render() {
        return (
            <div className="mail">
                <div className="mail-list-wrapper">
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
                    <div className="mail-list">
                        {mailStore.ghosts.map((m) => {
                            return (<MailItem key={m.ghostId}
                                              ghostId={m.ghostId}
                                              subject={m.subject}
                                              date={m.date.fromNow(true)}
                                              recipient={m.recipients}
                                              firstLine={m.preview}
                                              active={false} />
                            );
                        })}
                    </div>
                </div>
                {mailStore.ghosts.length === 0 && !mailStore.loading ? <ZeroMail /> : null }
                {mailStore.selectedId && !mailStore.loading ? this.renderRight() : null }

                <Button icon="add" floating accent onClick={this.handleCompose} />
            </div>
        );
    }


}

module.exports = Mail;
