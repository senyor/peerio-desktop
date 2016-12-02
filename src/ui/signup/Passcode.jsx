const React = require('react');
const { Component } = require('react');
const { observable, computed } = require('mobx');
const { observer } = require('mobx-react');
const { Input } = require('react-toolbox');
const { config, socket, validation } = require('../../icebear'); // eslint-disable-line
const { t } = require('peerio-translator');
const T = require('../shared-components/T');
const zxcvbn = require('zxcvbn');
const ValidatedInput = require('../shared-components/ValidatedInput');
const OrderedFormStore = require('../../stores/ordered-form-store');

const { validators } = validation; // use common validation from core

class PasscodeStore extends OrderedFormStore {
    @observable passcode;
    @observable passcodeRepeat;

    /**
     * Checks that the password is > 8 characters long and not abysmal as per zxcvbn
     *
     * @param {String} value
     * @param {Object} additionalArguments -- passed through ValidatedInput component
     * @param {Array<String>} additionalArguments.banList
     * @returns {Promise.<boolean>}
     */
    passwordStrengthValidator(value, additionalArguments) {
        if (value.length > 0) {
            const zResult = zxcvbn(this.props.store.passcode, additionalArguments.banList || []);
            if (value.length < 8) {
                return Promise.resolve({
                    message: `${t('signup_passcodeErrorWeak')} ${t('signup_passcodeErrorShort')}`
                });
            }
            if (zResult.guesses_log10 < 8) {
                const suggestion = zResult.feedback.suggestions || t('signup_passcodeSuggestionGeneric');
                return Promise.resolve({
                    message: `${t('signup_passcodeErrorWeak')} ${suggestion}`
                });
            }
            return Promise.resolve(true);
        }
        return Promise.resolve({
            message: t('required')
        });
    }

    /**
     * Validator for the passcode field.
     *
     * @type {Array}
     */
    passwordValidator = [
        { action: validators.valueComparison, message: t('signup_passcodeErrorRepeat') },
        { action: this.passwordStrengthValidator, message: t('signup_passcodeErrorWeak') }
    ];

    @computed get hasErrors() {
        return (socket.connected && this.passcodeValid && this.passcodeRepeatValid);
    }
}

@observer class Passcode extends Component {
    @computed get passwordBanList() {
        return [
            this.props.profileStore.username,
            this.props.profileStore.firstName,
            this.props.profileStore.lastName,
            'peerio'
        ];
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
                <ValidatedInput type="password"
                                className="login-input"
                                label={t('signup_passcode')}
                                store={s}
                                validator={s.passwordValidator}
                                validationArguments={{
                                    equalsValue: s.passcodeRepeat,
                                    equalsErrorMessage: t('signup_passcodeErrorRepeat'),
                                    banList: this.passwordBanList
                                }}
                                onKeyPress={this.handleKeyPress} />
                <ValidatedInput type="password"
                                className="login-input"
                                label={t('signup_passcodeRepeat')}
                                validator={validators.valueComparison}
                                validationArguments={{
                                    equalsValue: s.passcode,
                                    equalsErrorMessage: t('signup_passcodeErrorRepeat')
                                }}
                                store={s}
                                onKeyPress={this.handleKeyPress} />

                <T k="signup_TOSRequestText" className="terms">
                    {{
                        emphasis: text => <strong>{text}</strong>,
                        tosLink: text => <a href={config.termsUrl}>{text}</a>
                    }}
                </T>
            </div>
        );
    }
}

module.exports = { Passcode, PasscodeStore };
