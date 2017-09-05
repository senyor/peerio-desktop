const React = require('react');
const { Component } = require('react');
const { observer } = require('mobx-react');
const { Button } = require('~/react-toolbox');
const { t } = require('peerio-translator');
const T = require('~/ui/shared-components/T');


@observer class Welcome extends Component {
    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.props.returnHandler();
        }
    };

    render() {
        return (
            <div className="flex-col flex-justify-around">
                <div style={{ marginBottom: '32px' }} >
                    <div className="display-2">{t('title_welcomeHeading')}</div>
                    {/* Welcome to Peerio! */}
                    <div className="headline">{t('title_welcomeSubHeading')}</div>
                    {/* Your private and secure collaboration platform */}
                </div>
                <div className="flex-row">
                    <div className="private">
                        <div className="headline">{t('title_welcomePrivate')}</div>
                        {/* Private */}
                        <p>{t('title_welcomePrivateContent')}</p>
                        {/* Peerio’s end-to-end encryption keeps your data safe from breaches. */}
                    </div>
                    <div className="safe">
                        <div className="headline">{t('title_welcomeSafe')}</div>
                        {/* Safe */}
                        <p>{t('title_welcomeSafeContent')}</p>
                        {/* Only you can access your account. Your data is safe and secure 24/7. */}
                    </div>
                    <div className="fast">
                        <div className="headline">{t('title_welcomeFast')}</div>
                        {/* Fast */}
                        <p>{t('title_welcomeFastContent')}</p>
                        {/* So fast, you’ll forget that everything is always encrypted. */}
                    </div>
                </div>
                {/* <Dropdown value={languageStore.language}
                    source={languageStore.translationLangsDataSource} onChange={languageStore.changeLanguage} /> */}
            </div>
        );
    }
}

module.exports = Welcome;
