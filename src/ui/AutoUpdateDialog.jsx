const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const { Dialog } = require('~/react-toolbox');

// todo: repeat request to update and restart?
// todo: request again on new version after previous one was dismissed?

/**
 * Current implementation will show update request dialog only once after app is started
 */
@observer
class AutoUpdateDialog extends React.Component {
    @observable dismissed = false;

    dismiss = () => {
        this.dismissed = true;
    };

    isActive() {
        return false;//! this.dismissed && updater.state === updater.states.READY_TO_INSTALL;
    }
    render() {
        // keep this here in case locale changes
        const actions = [
            { label: t('button_cancel'), onClick: this.dismiss },
            { label: t('button_updateDownload'), onClick: this.dismiss }
        ];

        return (
            <Dialog actions={actions} onEscKeyDown={this.dismiss} onOverlayClick={this.dismiss} active={this.isActive()}
                title={t('dialog_updateAvailableTitle')}>
                <p>{t('dialog_updateAvailable')}</p>
            </Dialog>
        );
    }
}

module.exports = AutoUpdateDialog;
