const React = require('react');
const { Button, IconButton } = require('~/react-toolbox');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const css = require('classnames');
const languageStore = require('~/stores/language-store');
const { PhraseDictionary } = require('~/icebear');
const { t } = require('peerio-translator');
const { Dialog } = require('~/react-toolbox');

@observer
class MailSidebar extends React.Component {

    @observable revokeModalActive = false;

    revokeDialogActions = [
        { label: t('cancel'), onClick: this.handleRevokeDialogToggle },
        { label: t('ghost_revokeAction'), onClick: this.props.ghost.revoke }
    ];

    handleRevokeDialogToggle = () => {
        this.revokeModalActive = !this.revokeModalActive;
    };

    renderRevokeDialog() {
        return (
            <Dialog actions={this.revokeDialogActions}
                    active={this.revokeModalActive}
                    onEscKeyDown={this.handleRevokeDialogToggle}
                    onOverlayClick={this.handleRevokeDialogToggle}
                    title={t('ghost_revokeTitle')}>
                <p>{t('ghost_revokeText')}</p>
            </Dialog>
        );
    }

    render() {
        return (
            <div className="mail-sidebar">
                <p>{t('ghost_passphrase')}</p>
                <div>
                    <div className="dark-label">Passphrase</div>
                    <div className="passphrase">
                        {this.props.ghost.passphrase }
                        <IconButton icon="content_copy" />
                    </div>
                </div>
                { !this.props.ghost.sent ?
                    <p>{t('ghost_expiryNotice')}</p>
                    : <div className="sent-info">
                        <div className="read-recipt">
                            <div className="dark-label">{t('ghost_url')}</div>
                            <div>{this.props.ghost.url}</div>
                        </div>
                        <div className="expire-info flex-col">
                            <div className="dark-label">{t('ghost_expires')}</div>
                            <div>{this.props.ghost.expiryDate.toLocaleString()}</div>
                            { !this.props.ghost.expired ?
                                <Button label={t('revoke')}
                                    onClick={this.handleRevokeDialogToggle}
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
