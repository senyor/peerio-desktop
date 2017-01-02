const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const { Dialog } = require('react-toolbox');
const updater = require('~/updater');

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

    componentDidMount() {
        // just to give app some time to render and avoid load spike
        // also squirrel might crash on windows if start updates too early.
        setTimeout(() => {
            updater.startUpdateMonitoring();
        }, 10000);
    }
    isActive() {
        return !this.dismissed && updater.state === updater.states.READY_TO_INSTALL;
    }
    render() {
        // keep this here in case locale changes
        const actions = [
            { label: t('cancel'), onClick: this.dismiss },
            { label: t('updateDownload'), onClick: updater.quitAndInstall }
        ];

        return (
            <Dialog actions={actions} onEscKeyDown={this.dismiss} onOverlayClick={this.dismiss} active={this.isActive()}
                title={t('updateAvailable', { releaseName: updater.releaseName })}>
                <p>{t('updateAvailableText', { releaseMessage: updater.releaseName })}</p>
            </Dialog>
        );
    }
}

module.exports = AutoUpdateDialog;
