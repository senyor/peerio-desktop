const React = require('react');
const { Button, IconButton, Tooltip } = require('~/react-toolbox');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const { Dialog } = require('~/react-toolbox');
const { systemWarnings } = require('~/icebear');
const MailPassphrase = require('./MailPassphrase');

const TooltipIcon = Tooltip()(IconButton); //eslint-disable-line

@observer
class MailSentSidebar extends React.Component {

    @observable revokeDialogActive = false;
    @observable ghostActive = true;


    revokeGhost = () => {
        return this.props.ghost.revoke()
            .then(() => {
                this.hideRevokeDialog();
                systemWarnings.add({
                    content: 'warning_ghostRevoked'
                });
            });
    }

    showRevokeDialog = () => {
        this.revokeDialogActive = true;
    };

    hideRevokeDialog = () => {
        this.revokeDialogActive = false;
    };

    componentDidUpdate() {
        this.ghostActive = !this.props.ghost.expired && !this.props.ghost.revoked;
    }

    copyLink = () => {
        console.log('link copied :D');
    };

    render() {
        const revokeDialogActions = [
            { label: t('button_cancel'), onClick: () => { this.hideRevokeDialog(); } },
            { label: t('button_ghostRevokeAction'), onClick: () => { this.revokeGhost(); } }
        ];
        return (
            <div className="mail-sidebar">
                <MailPassphrase ghost={this.props.ghost} />
                <div className="sent-info">
                    <div className="read-recipt">
                        <div className="dark-label">{t('ghost_url')}</div>
                        <div className="mail-link">
                            <a href={this.props.ghost.url}>{ this.props.ghost.url }</a>
                            <TooltipIcon
                                tooltip={t('copy')}
                                tooltipDelay={500}
                                tooltipPosition="bottom"
                                icon="content_copy"
                                onClick={this.copyLink} />
                        </div>
                    </div>
                    <div className="expire-info flex-col">
                        {(this.ghostActive)
                            ?
                                <div>
                                    <div className="dark-label">{t('title_ghost_expires')}</div>
                                    <div>{this.props.ghost.expiryDate.toLocaleString()}</div>
                                    <Button label={t('revoke')}
                                    onClick={this.showRevokeDialog}
                                    style={{ marginLeft: 'auto', marginTop: '8px' }}
                                    primary />
                                </div>
                           :
                                <div className="dark-label">
                                    {this.props.ghost.revoked ? t('ghost_revoked') : t('ghost_expired')}
                                </div>
                    }
                    </div>
                </div>
                { this.ghostActive ? <Dialog actions={revokeDialogActions}
                                             active={this.revokeDialogActive}
                                             onEscKeyDown={this.handleRevokeDialogToggle}
                                             onOverlayClick={this.handleRevokeDialogToggle}
                                             title={t('title_ghostRevoke')}>
                    <p>{t('dialog_ghostRevokeText')}</p>
                </Dialog> : '' }
            </div>
        );
    }
}

module.exports = MailSentSidebar;
