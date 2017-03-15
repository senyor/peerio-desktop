const React = require('react');
const { Component } = require('react');
const { computed, reaction } = require('mobx');
const { observer } = require('mobx-react');
const { FontIcon, Button } = require('~/react-toolbox');
const { config, socket, validation } = require('~/icebear'); // eslint-disable-line
const { t } = require('peerio-translator');
const zxcvbn = require('zxcvbn');
const ValidatedInput = require('~/ui/shared-components/ValidatedInput');
const T = require('~/ui/shared-components/T');

const { validators } = validation; // use common validation from core

const MIN_PASSWORD_LENGTH = 8;

@observer class NewDevice extends Component {

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
            <div className="signup rt-light-theme show">
                <img alt="" className="logo" src="static/img/logo-white.png" />
                <div className="signup-form">

                    <div className="passcode">
                        <div className="signup-title">{t('title_newDeviceSetup')}</div>
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

                        <ValidatedInput type="password"
                                        name="passcode"
                                        className="login-input"
                                        label={t('title_password')}
                                        store={this.props.store}
                                        validator={this.passwordValidator}
                                        validationArguments={{
                                            hintStore: this.props.store.passwordHints,
                                            equalsValue: this.props.store.passcodeRepeat,
                                            equalsErrorMessage: t('error_passwordRepeat'),
                                            banList: this.passwordBanList
                                        }}
                                        onKeyPress={this.handleKeyPress} />
                        <ul className="passcode-hints">
                            {this.props.store.passwordHints.entries().map(([key, hint]) => {
                                return (
                                    <li key={key} className={hint ? 'passed' : ''}>
                                        <FontIcon value={hint ? 'lens' : 'panorama_fish_eye'} />
                                        {t(`title_passwordHint_${key}`)}
                                    </li>
                                );
                            }
                        )}
                        </ul>
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

                    <T k="title_TOSRequestText" className="terms">
                        {{
                            emphasis: text => <strong>{text}</strong>,
                            tosLink: text => <Button onClick={this.showTermsDialog}
                                                       label={text}
                                                       className="button-link" />
                        }}
                    </T>
                </div>
                <div className="signup-nav">
                    <Button flat label={t('button_skip')}
                            onClick={this.retreat} />
                    <Button flat label={t('button_finish')}
                            onClick={this.advance} disabled={this.hasErrors} />
                </div>
            </div>
        );
    }
}

module.exports = NewDevice;
