const React = require('react');
const { Component } = require('react');
const { observable, computed, reaction, autorun } = require('mobx');
const { observer } = require('mobx-react');
const { FontIcon } = require('~/react-toolbox');
const { config, socket, validation } = require('~/icebear'); // eslint-disable-line
const { t } = require('peerio-translator');
const zxcvbn = require('zxcvbn');
const ValidatedInput = require('~/ui/shared-components/ValidatedInput');
const OrderedFormStore = require('~/stores/ordered-form-store');

const { validators } = validation; // use common validation from core

const MIN_PASSWORD_LENGTH = 8;

class PasscodeStore extends OrderedFormStore {
    lastZScore = null;
    @observable fieldsExpected = 2;
    @observable passcode = '';
    @observable passcodeRepeat = '';

    @computed get hasErrors() {
        return !(this.initialized && socket.connected && this.passcodeValid && this.passcodeRepeatValid);
    }

    @observable passwordHints = observable.map({
        length: false,
        case: false,
        number: false,
        specialChars: false,
        dictionary: false
    });

    constructor() {
        super();
        // hints are divorced from whether the user can actually register
        autorun(() => {
            // iterate through the user's FAILINGS, set hint to true if passed
            this.passwordHints.set('length', this.passcode.length > MIN_PASSWORD_LENGTH);
            this.passwordHints.set('case', this.passcode.length > 0 &&
                !(this.passcode.match(/^[a-z\d\W]+$/) || this.passcode.match(/^[A-Z\d\W]+$/)));
            this.passwordHints.set('number', this.passcode.match(/\d/));
            this.passwordHints.set('specialChars', this.passcode.match(/\W/));
            let dictProblem = this.passcode.length > 0;
            if (this.lastZScore) {
                dictProblem = !this.lastZScore.sequence.find((admonishment) => {
                    return ['repeat', 'dictionary'].indexOf(admonishment.pattern) > -1;
                });
            }
            this.passwordHints.set('dictionary', dictProblem);
        });
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
            this.props.store.lastZScore = zResult; // cache the last result to the store for hints
            if (value.length < MIN_PASSWORD_LENGTH) {
                return Promise.resolve({
                    message: t('signup_passcodeErrorShort')
                });
            }
            if (zResult.guesses_log10 < 8) {
                return Promise.resolve({
                    message: t('signup_passcodeErrorWeak')
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
                <p>{t('signup_desktop_passcodeIntro1')}</p>
                <p>{t('signup_desktop_passcodeIntro2')}</p>
                <p>{t('signup_desktop_passcodeIntro3')}</p>
                <ValidatedInput type="password"
                                name="passcode"
                                className="login-input"
                                label={t('signup_passcode')}
                                store={this.props.store}
                                validator={this.passwordValidator}
                                validationArguments={{
                                    hintStore: this.props.store.passwordHints,
                                    equalsValue: this.props.store.passcodeRepeat,
                                    equalsErrorMessage: t('signup_passcodeErrorRepeat'),
                                    banList: this.passwordBanList
                                }}
                                onKeyPress={this.handleKeyPress} />
                <ul className="passcode-hints">
                    {this.props.store.passwordHints.entries().map(([key, hint]) => {
                        return (
                            <li key={key} className={hint ? 'passed' : ''}>
                                <FontIcon value={hint ? 'lens' : 'panorama_fish_eye'} />
                                {t(`signup_passcodeHint_${key}`)}
                            </li>
                        );
                    }
                )}
                </ul>
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
            </div>
        );
    }
}

module.exports = { Passcode, PasscodeStore };
