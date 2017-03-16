const React = require('react');
const { observable } = require('mobx');
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
                        {t('currentVersion')} : <strong>{version}</strong>
                    </p>

                </section>

                <section>
                    <div className="title">{t('support')}</div>
                    <p>
                        {t('description_support')}
                        {/* Other users can find you... */}
                    </p>
                    <div className="flex-row">
                        <Button label={t('button_faq')} flat primary />
                        <Button label={t('button_support')} flat primary />
                    </div>
                </section>
                <section>
                    &copy; 2017 Peerio Technologies , Inc. All rights reserved.
                    <br /><br />
                    Peerio <Button onClick={this.showTermsDialog} label={t('terms')} />
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
