const React = require('react');
const { Button, IconMenu, MenuItem } = require('~/react-toolbox');
const { observable, action } = require('mobx');
const { observer } = require('mobx-react');
const { mailStore } = require('~/icebear');
const { t } = require('peerio-translator');
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

    constructor() {
        super();
        this.handleCompose = this.handleCompose.bind(this);
        this.handleSend = this.handleSend.bind(this);
        this.handleAttach = this.handleAttach.bind(this);
        this.handleSort = this.handleSort.bind(this);
    }

    @action handleCompose() {
        const newGhost = mailStore.createGhost();
        this.sent = false;
    }

    @action handleSend(data) {
        mailStore.selectedGhost.send(data);
    }

    @action handleAttach(files) {
        mailStore.selectedGhost.attachFiles(files);
    }

    @action handleSort(value) {
        mailStore.sort(value);
    }

    renderRight() {
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
                            {t('title_sort')} <strong>{mailStore.selectedSort}</strong>
                        </div>
                        <IconMenu onSelect={this.handleSort} icon="arrow_drop_down">
                            <MenuItem value="date" caption={t('title_sortDate')} />
                            <MenuItem value="attachment" onSelect={this.sort} caption={t('title_sortAttachments')} />
                            <MenuItem value="recipient" onSelect={this.sort} caption={t('title_sortRecipients')} />
                        </IconMenu>
                    </div>
                    <div className="mail-list">
                        {mailStore.ghosts.map((m) => {
                            return (<MailItem key={m.ghostId}
                                              sent={m.sent}
                                              ghostId={m.ghostId}
                                              subject={m.subject}
                                              date={m.date.fromNow(true)}
                                              recipient={m.recipients}
                                              attachments={m.files.length > 0}
                                              firstLine={m.preview}
                                              alive={!m.expired && !m.revoked}
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
