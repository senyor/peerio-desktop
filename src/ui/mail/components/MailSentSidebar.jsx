const React = require('react');
const { Button } = require('~/react-toolbox');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const { Dialog } = require('~/react-toolbox');
const MailPassphrase = require('./MailPassphrase');

@observer
class MailSentSidebar extends React.Component {

    @observable revokeDialogActive = false;
    @observable ghostActive = true;

    revokeDialogActions = [
        { label: t('cancel'), onClick: () => { this.hideRevokeDialog(); } },
        { label: t('ghost_revokeAction'),
            onClick: () => {
                return this.props.ghost.revoke()
                .then(() => this.hideRevokeDialog());
            } }
    ];

    showRevokeDialog = () => {
        this.revokeDialogActive = true;
    };

    hideRevokeDialog = () => {
        this.revokeDialogActive = false;
    };

    renderRevokeDialog() {
        return (
            <Dialog actions={this.revokeDialogActions}
                    active={this.revokeDialogActive}
                    onEscKeyDown={this.handleRevokeDialogToggle}
                    onOverlayClick={this.handleRevokeDialogToggle}
                    title={t('ghost_revokeTitle')}>
                <p>{t('ghost_revokeText')}</p>
            </Dialog>
        );
    }

    componentDidUpdate() {
        this.ghostActive = !this.props.ghost.expired && !this.props.ghost.revoked;
    }

    render() {
        return (
            <div className="mail-sidebar">
                <MailPassphrase ghost={this.props.ghost} />
                <div className="sent-info">
                    <div className="read-recipt">
                        <div className="dark-label">{t('ghost_url')}</div>
                        <div><a href={this.props.ghost.url}>{ this.props.ghost.url }</a></div>
                    </div>
                    <div className="expire-info flex-col">
                        {(this.ghostActive) ?
                            (<div>
                                <div className="dark-label">{t('ghost_expires')}</div>
                                <div>{this.props.ghost.expiryDate.toLocaleString()}</div>
                                <Button label={t('revoke')}
                                    onClick={this.showRevokeDialog}
                                    style={{ marginLeft: 'auto', marginTop: '8px' }}
                                    primary />
                            </div>)
                           : <div className="dark-label">{this.props.ghost.revoked ? t('ghost_revoked') : t('ghost_expired')}</div>
                    }
                    </div>
                </div>
                { this.ghostActive ? this.renderRevokeDialog() : '' }
            </div>
        );
    }
}

module.exports = MailSentSidebar;
