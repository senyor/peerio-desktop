const React = require('react');
const { observable, when } = require('mobx');
const { observer } = require('mobx-react');
const { TooltipIconButton } = require('~/react-toolbox');
const { t } = require('peerio-translator');
const T = require('../../shared-components/T');
const config = require('~/config');
const urls = require('~/config').translator.urlMap;
const { contactStore, chatStore } = require('~/icebear');
const { clipboard } = require('electron').remote;

@observer
class Help extends React.Component {
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
        return (
            <div>
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
                    </div>
                    <div className="flex-row flex-align-center">
                        <T k="title_feedbackIntro" />
                        <TooltipIconButton icon="chat" onClick={this.feedback} primary tooltip={t('button_feedbackChat')} />
                    </div>
                </section>
            </div>
        );
    }
}

module.exports = Help;
