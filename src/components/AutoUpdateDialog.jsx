const React = require('react');
const updater = require('../update');
const { t } = require('peerio-translator');
const { Dialog } = require('react-toolbox');
const { observer } = require('mobx-react');

@observer class AutoUpdateDialog extends React.Component {
    state = {
        active: true
    };

    handleToggle = () => {
        this.setState({ active: !this.state.active });
    };

    actions = [
        { label: t('cancel'), onClick: this.handleToggle },
        { label: t('updateDownload'), onClick: updater.installFn }
    ];

    render() {
        if (updater.hasUpdateAvailable === true) {
            return (
                <div>
                    <Dialog
                        actions={this.actions}
                        active={this.state.active}
                        onEscKeyDown={this.handleToggle}
                        onOverlayClick={this.handleToggle}
                        title={t('updateAvailable', { releaseName: updater.releaseName })}
                    >
                        <p>{t('updateAvailableText', { releaseMessage: updater.releaseMessage })}</p>
                    </Dialog>
                </div>
            );
        }
        return (<div />);
    }
}

module.exports = AutoUpdateDialog;
