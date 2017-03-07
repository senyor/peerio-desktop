const React = require('react');
const { Component } = require('react');
const { observable, computed, reaction } = require('mobx');
const { observer } = require('mobx-react');
const { config, socket, validation } = require('~/icebear'); // eslint-disable-line
const { t } = require('peerio-translator');
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
                    message: `${t('error_passwordWeak')} ${t('error_passwordShort')}`
                });
            }
            if (zResult.guesses_log10 < 8) {
                const suggestion = zResult.feedback.suggestions || t('error_passwordSuggestionGeneric');
                return Promise.resolve({
                    message: `${t('error_passwordWeak')} ${suggestion}`
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
        { action: this.passwordStrengthValidator, message: t('error_passwordWeak') }
    ];

    render() {
        return (
            <div className="passcode">
			<div className="signup-title">{t('title_signupStep2')}</div>
                <div className="signup-subtitle">{t('title_selectPassword')}</div>
                <ValidatedInput type="password"
                                name="passcode"
                                className="login-input"
                                label={t('title_password')}
                                store={this.props.store}
                                validator={this.passwordValidator}
                                validationArguments={{
                                    equalsValue: this.props.store.passcodeRepeat,
                                    equalsErrorMessage: t('error_passwordRepeat'),
                                    banList: this.passwordBanList
                                }}
                                onKeyPress={this.handleKeyPress} />
                <ValidatedInput type="password"
                                name="passcodeRepeat"
                                className="login-input"
                                label={t('title_passwordConfirm')}
                                validator={validators.valueEquality}
                                validationArguments={{
                                    equalsValue: this.props.store.passcode,
                                    equalsErrorMessage: t('error_passwordRepeat')
                                }}
                                store={this.props.store}
                                onKeyPress={this.handleKeyPress} />
            </div>
        );
    }
}

module.exports = { Passcode, PasscodeStore };
