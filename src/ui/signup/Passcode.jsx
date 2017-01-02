const React = require('react');
const { Component } = require('react');
const { observable, computed, reaction } = require('mobx');
const { observer } = require('mobx-react');
const { config, socket, validation } = require('~/icebear'); // eslint-disable-line
const { t } = require('peerio-translator');
const T = require('~/ui/shared-components/T');
const zxcvbn = require('zxcvbn');
const ValidatedInput = require('~/ui/shared-components/ValidatedInput');
const OrderedFormStore = require('~/stores/ordered-form-store');

const { validators } = validation; // use common validation from core

class PasscodeStore extends OrderedFormStore {
    @observable fieldsExpected = 2;
    @observable passcode;
    @observable passcodeRepeat;

    @computed get hasErrors() {
        return !(this.initialized && socket.connected && this.passcodeValid && this.passcodeRepeatValid);
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

    componentDidMount() {
        // force passcodeRepeat to validate on subsequent passcode changes
        reaction(() => this.props.store.passcode, () => {
            if (this.props.store.passcodeRepeat) {
                this.props.store.validatePasscodeRepeat();
            }
        });
    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.props.returnHandler();
        }
    };

    /**
     * Checks that the password is > 8 characters long and not abysmal as per zxcvbn
     *
     * @param {String} value
     * @param {Object} additionalArguments -- passed through ValidatedInput component
     * @param {Array<String>} additionalArguments.banList
     * @returns {Promise.<boolean>}
     */
    passwordStrengthValidator = (value, additionalArguments) => {
        if (value) {
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
            message: t('error_fieldRequired')
        });
    };

    /**
     * Validator for the passcode field.
     *
     * @type {Array}
     */
    passwordValidator = [
        { action: this.passwordStrengthValidator, message: t('signup_passcodeErrorWeak') }
    ];

    render() {
        return (
            <div className="passcode">
                <div className="signup-subtitle">{t('signup_desktop_passcodeTitle')}</div>
                <ValidatedInput type="password"
                                name="passcode"
                                className="login-input"
                                label={t('signup_passcode')}
                                store={this.props.store}
                                validator={this.passwordValidator}
                                validationArguments={{
                                    equalsValue: this.props.store.passcodeRepeat,
                                    equalsErrorMessage: t('signup_passcodeErrorRepeat'),
                                    banList: this.passwordBanList
                                }}
                                onKeyPress={this.handleKeyPress} />
                <ValidatedInput type="password"
                                name="passcodeRepeat"
                                className="login-input"
                                label={t('signup_passcodeRepeat')}
                                validator={validators.valueEquality}
                                validationArguments={{
                                    equalsValue: this.props.store.passcode,
                                    equalsErrorMessage: t('signup_passcodeErrorRepeat')
                                }}
                                store={this.props.store}
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
