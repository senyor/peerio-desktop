/* eslint-disable jsx-a11y/no-static-element-interactions */
const React = require('react');
const { Component } = require('react');
const { Button, TooltipIconButton } = require('~/react-toolbox');
const { config, socket, User, validation, warnings } = require('~/icebear');
const { observable, computed, when } = require('mobx');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const { Link } = require('react-router');
const ValidatedInput = require('~/ui/shared-components/ValidatedInput');
const FullCoverLoader = require('~/ui/shared-components/FullCoverLoader');
const T = require('~/ui/shared-components/T');
const OrderedFormStore = require('~/stores/ordered-form-store');
const css = require('classnames');
const autologin = require('~/helpers/autologin');
const routerStore = require('~/stores/router-store');

const { validators } = validation; // use common validation from core


class LoginStore extends OrderedFormStore {
    @observable fieldsExpected = 2;

    // also has observables usernameValid, usernameDirty created by ValidatedInput
    @observable username = '';
    @observable passcodeOrPassphrase = '';

    // non ValidatedInput-enhanced observables
    @observable busy = true;
    @observable passwordVisible = false;
    @observable lastAuthenticatedUser = undefined;

    @computed get hasErrors() {
        return !(
            this.initialized && // store has its input properties
            this.usernameValid && this.passcodeOrPassphraseValid && // fields ok
            socket.connected // server is available
        );
    }
}

@observer class Login extends Component {
    constructor() {
        super();
        this.loginStore = new LoginStore();
    }

    componentDidMount() {
        User.getLastAuthenticated()
            .then((lastUserObject) => {
                const dev = config.devAutologin;
                if (dev) {
                    setTimeout(() => {
                        this.loginStore.username = dev.username;
                        this.loginStore.passcodeOrPassphrase = dev.passphrase;
                        this.loginStore.busy = false;
                    }, 500);
                    if (dev.autologin) {
                        setTimeout(() => this.login(true), 1000);
                    }
                    if (dev.navigateTo) {
                        when(() => routerStore.currentRoute && routerStore.currentRoute.startsWith('/app'),
                            () => routerStore.navigateTo(dev.navigateTo));
                    }
                    return;
                }
                if (lastUserObject) {
                    this.loginStore.lastAuthenticatedUser = lastUserObject;
                    this.loginStore.username = lastUserObject.username;
                    autologin.getPassphrase(this.loginStore.username)
                        .then(passphrase => {
                            if (!passphrase) {
                                this.loginStore.busy = false;
                                return;
                            }
                            this.loginStore.passcodeOrPassphrase = passphrase;
                            this.login(true);
                        })
                        .catch(() => { this.loginStore.busy = false; });
                } else this.loginStore.busy = false;
            });
    }


    togglePasswordVisibility = () => {
        this.loginStore.passwordVisible = !this.loginStore.passwordVisible;
        if (this.akRef) this.akRef.inputRef.focus();
    };

    unsetLastUser = () => {
        return User.removeLastAuthenticated()
            .then(() => {
                this.loginStore.lastAuthenticatedUser = undefined;
                this.loginStore.username = undefined;
            });
    };
    // need this to sqallow event arguments
    onLoginClick = () => {
        this.login();
    };
    login = (isAutologin = false) => {
        if (this.loginStore.busy && !isAutologin) return;
        if (!isAutologin && this.loginStore.hasErrors) return;
        if (isAutologin && !socket.connected) {
            socket.onceConnected(() => this.login(true));
            return;
        }
        this.loginStore.busy = true;
        const user = new User();
        user.username = this.loginStore.username || this.loginStore.lastAuthenticatedUser.username;
        user.passphrase = this.loginStore.passcodeOrPassphrase;
        user.autologinEnabled = isAutologin;
        User.current = user;
        user.login().then(() => {
            if (!User.current.autologinEnabled) {
                return autologin.shouldSuggestEnabling()
                    .then(suggest => {
                        if (suggest) {
                            autologin.enable();
                            autologin.dontSuggestEnablingAgain();
                            window.router.push('/app/chats');
                        }
                        // window.router.push(suggest ? '/autologin' : '/app/chats');
                    });
            }
            return window.router.push('/app/chats');
        }).catch((e) => {
            User.current = null;
            this.loginStore.busy = false;
            // show error inline
            this.loginStore.passcodeOrPassphraseValidationMessageText = t('error_loginFailed');
            if (user.blacklisted) {
                warnings.addSevere('error_accountSuspendedText', 'error_accountSuspendedTitle');
            }
        });
    };

    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.login();
        }
    };

    onAKRef = ref => {
        this.akRef = ref;
    }

    getWelcomeBlock = () => {
        return (
            <div className="welcome-back-wrapper">
                <div className="welcome-back" onClick={this.unsetLastUser}>
                    <div className="overflow ">{t('title_welcomeBack')}&nbsp;
                        <strong>
                            {this.loginStore.lastAuthenticatedUser.firstName
                                || this.loginStore.lastAuthenticatedUser.username}
                        </strong>
                    </div>
                    <div className="subtitle">
                        <div className="overflow">
                            <T k="button_changeUserDesktop">
                                {{
                                    username: (this.loginStore.lastAuthenticatedUser.firstName
                                        || this.loginStore.lastAuthenticatedUser.username)
                                }}
                            </T>
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    render() {
        return (
            <div className="flex-row app-root">
                <FullCoverLoader show={this.loginStore.busy} />
                <div className="login rt-light-theme">
                    <img alt="Peerio logo" className="logo" src="static/img/logo-with-tag.png" />
                    {this.loginStore.lastAuthenticatedUser ? this.getWelcomeBlock() : ''}
                    <div className="login-form">
                        <div className={css('title', { banish: this.loginStore.lastAuthenticatedUser })}>
                            {t('title_login')}
                        </div>
                        <ValidatedInput label={t('title_username')}
                            name="username"
                            position="0"
                            lowercase="true"
                            store={this.loginStore}
                            validator={validators.usernameLogin}
                            onKeyPress={this.handleKeyPress}
                            className={css({ banish: this.loginStore.lastAuthenticatedUser })} />
                        <div className="password">
                            <ValidatedInput type={this.loginStore.passwordVisible ? 'text' : 'password'}
                                label={t('title_AccountKey')}
                                position="1"
                                store={this.loginStore}
                                validator={validators.stringExists}
                                name="passcodeOrPassphrase"
                                onKeyPress={this.handleKeyPress}
                                ref={this.onAKRef} />
                            <TooltipIconButton icon={this.loginStore.passwordVisible ? 'visibility_off' : 'visibility'}
                                tooltip={this.loginStore.passwordVisible ?
                                    t('title_hideAccountKey') : t('title_showAccountKey')}
                                tooltipPosition="right"
                                tooltipDelay={500}
                                onClick={this.togglePasswordVisibility}
                            />
                        </div>
                        {/* <Dropdown value={languageStore.language}
                                  source={languageStore.translationLangsDataSource}
                                  onChange={languageStore.changeLanguage} /> */}
                    </div>
                    <Button className="login-button" label={t('button_login')} flat
                        onClick={this.onLoginClick}
                        disabled={this.loginStore.hasErrors} />

                    <div>{t('title_newUser')} &nbsp; <Link to="/signup">{t('button_CreateAccount')}</Link></div>
                </div>
            </div>
        );
    }
}


module.exports = Login;
