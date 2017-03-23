const React = require('react');
const { Component } = require('react');
const { observable, computed, reaction } = require('mobx');
const { observer } = require('mobx-react');
const { FontIcon } = require('~/react-toolbox');
const { config, socket, validation } = require('~/icebear'); // eslint-disable-line
const { t } = require('peerio-translator');
const zxcvbn = require('zxcvbn');
const ValidatedInput = require('~/ui/shared-components/ValidatedInput');
const OrderedFormStore = require('~/stores/ordered-form-store');
const T = require('~/ui/shared-components/T');
const css = require('classnames');

const { validators } = validation; // use common validation from core

const MIN_PASSWORD_LENGTH = 8;
const GLOBAL_BAN_LIST = ['peerio'];

class PasscodeStore extends OrderedFormStore {

    @observable fieldsExpected = 2;
    @observable passcode = '';
    @observable passcodeRepeat = '';
    @observable passcodeStrength = 0;
    @observable zxcvbnScore = null;

    @computed get hasErrors() {
        return !(this.initialized && socket.connected && this.passcodeValid && this.passcodeRepeatValid);
    }

    @observable passcodeHints = observable.map({
        length: false,
        case: false,
        number: false,
        specialChars: false,
        dictionary: false
    });

    constructor() {
        super();
        this.ratePasscode = this.ratePasscode.bind(this);
        this.banList = GLOBAL_BAN_LIST;
        reaction(() => this.passcode, this.ratePasscode);
    }

    /**
     * Add words to the passcode ban list.
     *
     * @param {Array} banArray
     */
    addToBanList(banArray) {
        this.banList = [...new Set([...this.banList, ...banArray])];
    }

    /**
     * Iterate through the user's FAILINGS, set each hint to true if the provided
     * value passes each criterion, and set the sentiment icon.
     *
     * Note that hints are divorced from whether the user can actually register.
     */
    ratePasscode() {
        this.passcodeHints.set('length', this.passcode.length > MIN_PASSWORD_LENGTH);
        this.passcodeHints.set('case', this.passcode.length > 0 &&
            !(this.passcode.match(/^[a-z\d\W]+$/) || this.passcode.match(/^[A-Z\d\W]+$/)));
        this.passcodeHints.set('number', this.passcode.match(/\d/));
        this.passcodeHints.set('specialChars', this.passcode.match(/\W/));
        let hasDictionaryProblems = this.passcode.length > 0;
        if (this.passcode.length > 0) {
            this.zxcvbnScore = zxcvbn(this.passcode, this.banList || []);
            hasDictionaryProblems = !this.zxcvbnScore.sequence.find((admonishment) => {
                return ['repeat', 'dictionary'].indexOf(admonishment.pattern) > -1;
            });
            this.passcodeStrength = this.zxcvbnScore.score;
        } else {
            this.zxcvbnScore = null;
        }
        this.passcodeHints.set('dictionary', hasDictionaryProblems);
    }
}

@observer class Passcode extends Component {

    constructor() {
        super();
        this.passcodeStrengthMeter = [
            { class: 'red', icon: 'sentiment_very_dissatisfied' },
            { class: 'yellow', icon: 'sentiment_dissatisfied' },
            { class: 'yellow', icon: 'sentiment_neutral' },
            { class: 'green', icon: 'sentiment_satisfied' },
            { class: 'green', icon: 'sentiment_very_satisfied' }
        ];
    }

    /**
     * Force passcodeRepeat to validate on subsequent passcode changes
     */
    componentDidMount() {
        reaction(() => this.props.store.passcode, () => {
            if (this.props.store.passcodeRepeat) {
                this.props.store.validatePasscodeRepeat();
            }
        });
    }

    /**
     * Given localized error messages, provides a validation function for ValidatedInput.
     *
     * @param {String} weakMsg
     * @param {String} requiredMsg
     * @param {String} shortMsg
     * @return {Array<Object>}
     */
    localizePasscodeValidator(weakMsg, requiredMsg, shortMsg) {
        return [
            {
                /**
                 * Validator function: Checks that the password is > 8 characters long and not *abysmal* as per zxcvbn
                 *
                 * @param {String} value
                 * @param {Object} additionalArguments -- passed through ValidatedInput component
                 * @param {Array<String>} additionalArguments.zxcvbnScore -- calculated in the store when setting hints
                 * @returns {Promise.<boolean>}
                 */
                action: (value, additionalArguments) => {
                    if (value) {
                        if (value.length < MIN_PASSWORD_LENGTH) {
                            return Promise.resolve({
                                message: shortMsg
                            });
                        }
                        if (additionalArguments.zxcvbnScore.guesses_log10 < 8) {
                            return Promise.resolve({
                                message: weakMsg
                            });
                        }
                        return Promise.resolve(true);
                    }
                    return Promise.resolve({
                        message: requiredMsg
                    });
                },
                message: shortMsg
            }
        ];
    }

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.props.returnHandler();
        }
    };

    render() {
        const passcodeValidator = this.localizePasscodeValidator(
            t('error_passwordWeak'),
            t('error_fieldRequired'),
            t('error_passwordShort')
        );
        console.log(this.props.store);

        return (
            <div className="passcode">
                <FontIcon value="sentiment_unsatisfied"
                />
                <div className="signup-title">{t('title_signupStep2')}</div>
                <div className="signup-subtitle">{t('title_createPassword')}</div>
                <p><T k="title_passwordIntro" className="signup-title">
                    {{
                        emphasis: text => <strong>{text}</strong>
                    }}
                </T></p>
                <p><T k="title_MPIntro1" className="signup-title">
                    {{
                        emphasis: text => <strong>{text}</strong>
                    }}
                </T></p>
                <p><T k="title_MPIntro2" className="signup-title">
                    {{
                        emphasis: text => <strong>{text}</strong>
                    }}
                </T></p>
                <div className={css('hint-wrapper', { focused: this.props.store.passcodeFocused })}>
                    <div className="password-sentiment">
                        <ValidatedInput type="password"
                                        name="passcode"
                                        className="login-input"
                                        label={t('title_password')}
                                        store={this.props.store}
                                        validator={passcodeValidator}
                                        validationArguments={{
                                            zxcvbnScore: this.props.store.zxcvbnScore,
                                            equalsValue: this.props.store.passcodeRepeat,
                                            equalsErrorMessage: t('error_passwordRepeat')
                                        }}
                                        onKeyPress={this.handleKeyPress} />
                        <FontIcon value={this.passcodeStrengthMeter[this.props.store.passcodeStrength].icon}
                                     className={this.props.store.zxcvbnScore === null ? 'hide' :
                                        this.passcodeStrengthMeter[this.props.store.passcodeStrength].class}
                                     />
                    </div>
                    <ul className="passcode-hints">
                        <li className="heading">{t('title_passwordHints')}</li>
                        {this.props.store.passcodeHints.entries().map(([key, hint]) => {
                            return (
                                <li key={key} className={hint ? 'passed' : ''}>
                                    <FontIcon value={hint ? 'lens' : 'panorama_fish_eye'} />
                                    {t(`title_passwordHint_${key}`)}
                                </li>
                            );
                        }
                    )}
                    </ul>
                </div>
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
