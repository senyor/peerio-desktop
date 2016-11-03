const React = require('react');
const { Component } = require('react');
const { observable, autorunAsync, computed } = require('mobx');
const { observer } = require('mobx-react');
const { Input } = require('react-toolbox');
const { config } = require('../icebear'); // eslint-disable-line
const { t } = require('peerio-translator');
const T = require('../components/T');
const zxcvbn = require('zxcvbn');

class PasscodeStore {
    @observable passcode;
    @observable passcodeRepeat;
    @observable passcodeError;
    @observable passcodeRepeatError;

    @computed get hasErrors() {
        return !!(!this.passcode || !this.passcodeRepeat || this.passcodeError || this.passcodeRepeatError);
    }
}

@observer class SignupPasscode extends Component {
    validatePasswordStrength() {
        if (this.props.store.passcode) {
            const banList = [
                this.props.profileStore.username,
                this.props.profileStore.firstName,
                this.props.profileStore.lastName,
                'peerio'
            ];
            const zResult = zxcvbn(this.props.store.passcode, banList);

            if (this.props.store.passcode.length < 8) {
                this.props.store.passcodeError = `${t('signup_passcodeErrorWeak')} ${t('signup_passcodeErrorShort')}`
            } else if(zResult.guesses_log10 < 8) {
                this.props.store.passcodeError = `${t('signup_passcodeErrorWeak')} ${
                    zResult.feedback.suggestions || t('signup_passcodeSuggestionGeneric')
                    }`;
            } else {
                this.props.store.passcodeError = undefined;
            }
        }
    }

    validate() {
        if (this.props.store.passcode === undefined) return;
        if (this.props.store.passcode !== this.props.store.passcodeRepeat) {
            this.props.store.passcodeRepeatError = t('signup_passcodeErrorRepeat');
        } else {
            this.props.store.passcodeRepeatError = undefined;
        }
        this.validatePasswordStrength()
    }

    constructor() {
        super();
        this.passcodeUpdater = val => {
            this.props.store.passcode = val;
        };
        this.passcodeRepeatUpdater = val => {
            this.props.store.passcodeRepeat = val;
        };
        autorunAsync(() => this.validate(), 100);
    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.props.returnHandler();
        }
    };

    render() {
        const s = this.props.store;
        return (
            <div className="passcode">
                <div className="signup-subtitle">{t('signup_desktop_passcodeTitle')}</div>
                <Input type="password" className="login-input" label={t('signup_passcode')} error={s.passcodeError}
                       value={s.passcode} onChange={this.passcodeUpdater}
                       onKeyPress={this.handleKeyPress} />
                <Input type="password" className="login-input" label={t('signup_passcodeRepeat')}
                       error={s.passcodeRepeatError}
                       value={s.passcodeRepeat} onChange={this.passcodeRepeatUpdater}
                       onKeyPress={this.handleKeyPress} />

                <T k="signup_masterPasswordText" className="signup-help">
                    {{ emphasis: text => <strong>{text}</strong> }}
                </T>

                <T k="signup_masterPasswordSettings" className="signup-help">
                    {{ emphasis: text => <strong>{text}</strong> }}
                </T>

                <T k="signup_TOSRequestText" className="signup-terms">
                    {{
                        emphasis: text => <strong>{text}</strong>,
                        tosLink: text => <a href={config.termsUrl}>{text}</a>
                    }}
                </T>
            </div>
        );
    }
}

module.exports = { SignupPasscode, PasscodeStore };
