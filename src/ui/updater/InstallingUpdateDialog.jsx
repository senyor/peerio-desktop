const React = require('react');
const { Component } = require('react');
const { observer } = require('mobx-react');
const { t } = require('peerio-icebear');
const T = require('~/ui/shared-components/T').default;
const { Dialog, ProgressBar } = require('peer-ui');
const updaterStore = require('~/stores/updater-store');

@observer
class InstallingUpdateDialog extends Component {
    render() {
        return (
            <Dialog
                className="dialog-installing-update"
                active={updaterStore.installing}
                title={t('title_installingUpdate')}
            >
                <ProgressBar className="installing-update-progress" circular />
                <div className="installing-update-message">
                    <T k="title_installingUpdatePleaseWait" />
                    <br />
                    <T k="title_installingUpdateWillRestart" />
                </div>
            </Dialog>
        );
    }
}

module.exports = InstallingUpdateDialog;
