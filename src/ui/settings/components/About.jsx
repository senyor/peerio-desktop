const React = require('react');
const { observable, when } = require('mobx');
const { observer } = require('mobx-react');
const { Button, Dialog, TooltipIconButton } = require('~/react-toolbox');
const { t } = require('peerio-translator');
const T = require('../../shared-components/T');
const version = require('electron').remote.app.getVersion();
const Terms = require('~/ui/shared-components/Terms');
const urls = require('~/config').translator.urlMap;
const { contactStore, chatStore } = require('~/icebear');
const config = require('~/config');
const { clipboard } = require('electron').remote;

@observer
class About extends React.Component {
    @observable termsDialogOpen = false;

    hideTermsDialog = () => {
        this.termsDialogOpen = false;
    };

    showTermsDialog = () => {
        this.termsDialogOpen = true;
    };

    feedback = () => {
        console.log('feedback', config.contacts.feedbackUser);
        const feedback = contactStore.getContact(config.contacts.feedbackUser);
        when(() => !feedback.loading, () => {
            chatStore.startChat([feedback]);
            window.router.push('/app');
        });
    }

    support = () => {
        const support = contactStore.getContact(config.contacts.supportUser);
        when(() => !support.loading, () => {
            chatStore.startChat([support]);
            window.router.push('/app');
        });
    }

    copyLogs = () => {
        clipboard.writeText(console.history.toString());
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
                    <div className="title">{t('title_help')}</div>
                    <div className="flex-row flex-align-center">
                        <T k="title_helpText" />
                        <TooltipIconButton icon="live_help" href={urls.helpCenter} tooltip={t('button_HC')} primary />
                    </div>
                    <div className="flex-row flex-align-center">
                        <T k="title_supportIntro" />
                        <TooltipIconButton icon="chat" onClick={this.support} primary tooltip={t('button_supportChat')} />
                        <TooltipIconButton icon="email" href={urls.contactSupport} tooltip={t('button_supportEmail')} primary />
                    </div>
                    <div className="flex-row flex-align-center">
                        <T k="title_logsIntro" />
                        <TooltipIconButton icon="content_copy" onClick={this.copyLogs}
                            tooltip={t('button_copyLogs')} primary />
                        <TooltipIconButton icon="email" tooltip={t('button_emailLogs')} primary
                            href={`mailto:${config.contacts.supportEmail}?subject=Logs&body=${console.history.toString()}`} />
                    </div>
                    <div className="flex-row flex-align-center">
                        <T k="title_feedbackIntro" />
                        <TooltipIconButton icon="chat" onClick={this.feedback} primary tooltip={t('button_feedbackChat')} />
                    </div>
                </section>
                <section>
                    &copy; 2017 Peerio Technologies, Inc. All rights reserved.
                    <br /><br />
                    {t('title_appName')} <Button onClick={this.showTermsDialog} label={t('button_terms')} />
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
