const React = require('react');
const { Component } = require('react');
const { observable, computed, reaction, autorun } = require('mobx');
const { observer } = require('mobx-react');
const { FontIcon, Tooltip } = require('~/react-toolbox');
const { config, socket, validation } = require('~/icebear'); // eslint-disable-line
const { t } = require('peerio-translator');
const zxcvbn = require('zxcvbn');
const ValidatedInput = require('~/ui/shared-components/ValidatedInput');
const OrderedFormStore = require('~/stores/ordered-form-store');
const T = require('~/ui/shared-components/T');

const { validators } = validation; // use common validation from core


const MIN_PASSWORD_LENGTH = 8;

class PasscodeStore extends OrderedFormStore {

    @observable fieldsExpected = 2;
    @observable passcode = '';
    @observable passcodeRepeat = '';
    @observable passcodeStrength = 0;

    get lastZScore() {
        return this.cachedZscore;
    }

    set lastZScore(v) {
        this.cachedZscore = v;
    }

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
        this.cachedZscore = null;
        // hints are divorced from whether the user can actually register
        autorun(() => {
            console.log('autorun', this.passcode);
            // iterate through the user's FAILINGS, set hint to true if passed
            this.passcodeHints.set('length', this.passcode.length > MIN_PASSWORD_LENGTH);
            this.passcodeHints.set('case', this.passcode.length > 0 &&
                !(this.passcode.match(/^[a-z\d\W]+$/) || this.passcode.match(/^[A-Z\d\W]+$/)));
            this.passcodeHints.set('number', this.passcode.match(/\d/));
            this.passcodeHints.set('specialChars', this.passcode.match(/\W/));
            let dictProblem = this.passcode.length > 0;
            if (this.lastZScore) {
                dictProblem = !this.lastZScore.sequence.find((admonishment) => {
                    return ['repeat', 'dictionary'].indexOf(admonishment.pattern) > -1;
                });
                this.passcodeStrength = this.lastZScore.score;
            }
            this.passcodeHints.set('dictionary', dictProblem);
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
                    message: t('error_passwordShort')
                });
            }
            if (zResult.guesses_log10 < 8) {
                return Promise.resolve({
                    message: t('error_passwordWeak')
                });
            }
            return Promise.resolve(true);
        }
        this.props.store.lastZScore = null;
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
        console.log('cached on render', this.props.store.lastZScore);
        const passcodeStrengthMeter = [
            { class: 'red', icon: 'sentiment_very_dissatisfied' },
            { class: 'yellow', icon: 'sentiment_dissatisfied' },
            { class: 'yellow', icon: 'sentiment_neutral' },
            { class: 'green', icon: 'sentiment_satisfied' },
            { class: 'green', icon: 'sentiment_very_satisfied' }
        ];
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
                <div className="hint-wrapper">
                    <div className="password-sentiment">
                        <ValidatedInput type="password"
                                        name="passcode"
                                        className="login-input"
                                        label={t('title_password')}
                                        store={this.props.store}
                                        validator={this.passwordValidator}
                                        validationArguments={{
                                            hintStore: this.props.store.passcodeHints,
                                            equalsValue: this.props.store.passcodeRepeat,
                                            equalsErrorMessage: t('error_passwordRepeat'),
                                            banList: this.passwordBanList
                                        }}
                                        onKeyPress={this.handleKeyPress} />
                        <FontIcon value={passcodeStrengthMeter[this.props.store.passcodeStrength].icon}
                                     className={this.props.store.lastZScore === null ? 'hide' :
                                        passcodeStrengthMeter[this.props.store.passcodeStrength].class}
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
