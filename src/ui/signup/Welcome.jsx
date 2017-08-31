const React = require('react');
const { Component } = require('react');
const { observer } = require('mobx-react');
const { Button } = require('~/react-toolbox');
const TermsDialog = require('./TermsDialog');
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
                    <div className="display-2">Welcome to Peerio!</div>
                    <div className="headline">Your private and secure collaboration platform</div>
                </div>
                <div className="flex-row">
                    <div className="private">
                        <div className="headline">Private</div>
                        <p>Peerio’s end-to-end encryption keeps your data safe from breaches.</p>
                    </div>
                    <div className="safe">
                        <div className="headline">Safe</div>
                        <p>Only you can access your account. Your data is safe and secure 24/7.</p>
                    </div>

                    <div className="fast">
                        <div className="headline">Private</div>
                        <p>So fast, you’ll forget that everything is always encrypted.</p>
                    </div>
                </div>

                <T k="title_TOSRequestText" className="terms">
                    {{
                        tosButton: text => (<Button onClick={TermsDialog.showDialog}
                            label={text}
                            className="button-link" />)
                    }}
                </T>
                <TermsDialog />
                {/* <Dropdown value={languageStore.language}
                    source={languageStore.translationLangsDataSource} onChange={languageStore.changeLanguage} /> */}
            </div>
        );
    }
}

module.exports = Welcome;
