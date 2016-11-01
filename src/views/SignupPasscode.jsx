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
    validatePasswordStrength(password) {
        return zxcvbn(password).score > 2; // FIXME too low?
    }

    validate() {
        if (this.props.store.passcode === undefined) return;
        if (this.props.store.passcode !== this.props.store.passcodeRepeat) {
            this.props.store.passcodeRepeatError = t('signup_passcodeErrorRepeat');
        } else {
            this.props.store.passcodeRepeatError = undefined;
        }
        if (!this.validatePasswordStrength(this.props.store.passcode)) {
            this.props.store.passcodeError = t('signup_passcodeErrorWeak');
        } else {
            this.props.store.passcodeError = undefined;
        }
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

    render() {
        const s = this.props.store;
        return (
            <div className="passcode">
                <div className="signup-subtitle">{t('signup_desktop_passcodeTitle')}</div>
                <Input type="password" className="login-input" label={t('signup_passcode')} error={s.passcodeError}
                       value={s.passcode} onChange={this.passcodeUpdater} />
                <Input type="password" className="login-input" label={t('signup_passcodeRepeat')}
                       error={s.passcodeRepeatError}
                       value={s.passcodeRepeat} onChange={this.passcodeRepeatUpdater} />

                <p>{t('signup_masterPasswordText',
                    { emphasis: text => <strong>{text}</strong> })}
                </p>

                <p> {t('signup_masterPasswordSettings',
                    { emphasis: text => <strong>{text}</strong> })}
                </p>

                <T k="signup_TOSRequestText" className="signup-terms">
                    {{ tosLink: text => <a href={config.termsUrl}>{text}</a> }}
                </T>
            </div>
        );
    }
}

module.exports = { SignupPasscode, PasscodeStore };
