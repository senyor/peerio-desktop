const React = require('react');
const { Button, IconButton } = require('~/react-toolbox');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const { Dialog } = require('~/react-toolbox');

@observer
class MailSidebar extends React.Component {

    @observable revokeDialogActive = false;

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

    copyPassphrase = () => {

        // TODO
    };

    render() {
        return (
            <div className="mail-sidebar">
                <div>
                    <div className="dark-label">{t('ghost_passphrase')}</div>
                    <div className="passphrase">
                        { this.props.ghost.passphrase }
                        <IconButton icon="content_copy" onClick={this.copyPassphrase} />
                    </div>
                </div>
                { !this.props.ghost.sent ?
                    <p>{t('ghost_expiryNotice')}</p>
                    : <div className="sent-info">
                        <div className="read-recipt">
                            <div className="dark-label">{t('ghost_url')}</div>
                            <div><a href={this.props.ghost.url}>{ this.props.ghost.url }</a></div>
                        </div>
                        <div className="expire-info flex-col">
                            <div className="dark-label">{t('ghost_expires')}</div>
                            <div>{this.props.ghost.expiryDate.toLocaleString()}</div>
                            { !this.props.ghost.expired && !this.props.ghost.revoked ?
                                <Button label={t('revoke')}
                                    onClick={this.showRevokeDialog}
                                    style={{ marginLeft: 'auto', marginTop: '8px' }}
                                    primary /> : t('ghost_expired') }
                        </div>
                    </div>
                }
                { this.props.ghost.sent && !this.props.ghost.expired ? this.renderRevokeDialog() : '' }
            </div>
        );
    }
}

module.exports = MailSidebar;
