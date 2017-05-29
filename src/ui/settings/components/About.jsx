const React = require('react');
const { observable, when } = require('mobx');
const { observer } = require('mobx-react');
const { Button, Dialog } = require('~/react-toolbox');
const { t } = require('peerio-translator');
const version = require('electron').remote.app.getVersion();
const Terms = require('~/ui/shared-components/Terms');

@observer
class About extends React.Component {
    @observable termsDialogOpen = false;

    hideTermsDialog = () => {
        this.termsDialogOpen = false;
    };

    showTermsDialog = () => {
        this.termsDialogOpen = true;
    };

    render() {
        const termsDialogActions = [
            { label: t('button_ok'), onClick: this.hideTermsDialog }
        ];
        return (
            <div>
                <section className="section-divider">
                    <img alt="" className="logo" src="static/img/logo-blue.png" />
                    <p>
                        {t('title_version')} <strong>{version}</strong>
                    </p>

                </section>
                <section>
                    &copy; 2017 Peerio Technologies, Inc. All rights reserved.
                    <div className="settings-terms">
                        {t('title_appName')} <Button onClick={this.showTermsDialog} label={t('button_terms')} />
                    </div>
                </section>

                <Dialog active={this.termsDialogOpen}
                    actions={termsDialogActions}
                    onOverlayClick={this.hideTermsDialog}
                    onEscKeyDown={this.hideTermsDialog}
                    className="terms">
                    <Terms />
                </Dialog>
            </div>
        );
    }
}

module.exports = About;
