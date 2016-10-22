const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const updater = require('../updater');
const { t } = require('peerio-translator');
const { Dialog } = require('react-toolbox');

/**
 * Current implementation will show update request dialog only once after app is started
 */
@observer class AutoUpdateDialog extends React.Component {
    @observable dismissed = false;

    dismiss = () => {
        this.dismissed = true;
    };

    componentDidMount() {
        // just to give app some time to render and avoid load spike
        setTimeout(updater.startUpdateMonitoring, 2000);
    }

    actions = [
        { label: t('cancel'), onClick: this.dismiss },
        { label: t('updateDownload'), onClick: updater.quitAndInstall }
    ];

    render() {
        const active = !this.dismissed && updater.state === updater.states.READY_TO_INSTALL;
        return (
            <Dialog actions={this.actions} onEscKeyDown={this.dismiss} onOverlayClick={this.dismiss} active={active}
                title={t('updateAvailable', { releaseName: updater.releaseName })}>

                <p>{t('updateAvailableText', { releaseMessage: updater.releaseName })}</p>
            </Dialog>
        );
    }
}

module.exports = AutoUpdateDialog;
