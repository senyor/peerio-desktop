/* eslint-disable jsx-a11y/no-static-element-interactions*/
const React = require('react');
const { Component } = require('react');
const { Dropdown, Button, IconButton } = require('react-toolbox');
const { config, socket, User, validation } = require('~/icebear');
const { observable, computed } = require('mobx');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const languageStore = require('~/stores/language-store');
const { Link } = require('react-router');
const ValidatedInput = require('~/ui/shared-components/ValidatedInput');
const FullCoverLoader = require('~/ui/shared-components/FullCoverLoader');
const T = require('~/ui/shared-components/T');
const OrderedFormStore = require('~/stores/ordered-form-store');
const Snackbar = require('~/ui/shared-components/Snackbar');

const { validators } = validation; // use common validation from core

class LoginStore extends OrderedFormStore {
    @observable fieldsExpected = 2;

    // also has observables usernameValid, usernameDirty created by ValidatedInput
    @observable username = '';
    @observable passcodeOrPassphrase = '';

    // non ValidatedInput-enhanced observables
    @observable busy = false;
    @observable passwordVisible = false;
    @observable lastAuthenticatedUser = undefined;

    @computed get hasErrors() {
        return !(
                this.initialized &&  // store has its input properties
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
                if (config.autologin) {
                    this.loginStore.username = config.autologin ? config.autologin.username : '';
                    this.loginStore.passcodeOrPassphrase = config.autologin ? config.autologin.passphrase : '';
                    return;
                }
                if (lastUserObject) {
                    this.loginStore.lastAuthenticatedUser = lastUserObject;
                    this.loginStore.username = lastUserObject.username;
                }
            });
    }


    togglePasswordVisibility = () => {
        this.loginStore.passwordVisible = !this.loginStore.passwordVisible;
    };

    unsetLastUser = () => {
        return User.removeLastAuthenticated()
            .then(() => {
                this.loginStore.lastAuthenticatedUser = undefined;
                this.loginStore.username = undefined;
            });
    };

    login = () => {
        if (this.loginStore.busy || this.loginStore.hasErrors) return;
        this.loginStore.busy = true;
        const user = new User();
        user.username = this.loginStore.username || this.loginStore.lastAuthenticatedUser.username;
        user.passphrase = this.loginStore.passcodeOrPassphrase;
        user.login().then(() => {
            User.current = user;
            window.router.push('/app');
        }).catch(() => {
            // show error inline
            this.loginStore.passcodeOrPassphraseValidationMessageText = t('error_loginFailed');
            this.loginStore.busy = false;
        });
    };

    handleKeyPress =(e) => {
        if (e.key === 'Enter') {
            this.login();
        }
    };

    getWelcomeBlock = () => {
        return (
            <div className="welcome-back-wrapper">
                <div className="welcome-back" onClick={this.unsetLastUser}>
                    <div className="overflow ">{t('login_welcomeBack')}&nbsp;
                        <strong>
                            {this.loginStore.lastAuthenticatedUser.firstName
                            || this.loginStore.lastAuthenticatedUser.username}
                        </strong>
                    </div>
                    <div className="subtitle">
                        <div className="overflow">
                            <T k="login_changeUser">
                                {{ username: (this.loginStore.lastAuthenticatedUser.firstName
                                                || this.loginStore.lastAuthenticatedUser.username) }}
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
                <div className="flex-row login rt-light-theme">
                    <img role="presentation" className="logo" src="static/img/logo-white.png" />

                    {this.loginStore.lastAuthenticatedUser ? this.getWelcomeBlock() : ''}

                    <div className="login-form">
                        <ValidatedInput label={t('username')}
                                        name="username"
                                        position="0"
                                        lowercase="true"
                                        store={this.loginStore}
                                        validator={validators.usernameLogin}
                                        onKeyPress={this.handleKeyPress} />
                        <div className="password">
                            <ValidatedInput type={this.loginStore.passwordVisible ? 'text' : 'password'}
                                            label={t('passcodeOrPassphrase')}
                                            position="1"
                                            store={this.loginStore}
                                            validator={validators.stringExists}
                                            name="passcodeOrPassphrase"
                                            onKeyPress={this.handleKeyPress} />
                            <IconButton icon={this.loginStore.passwordVisible ? 'visibility_off' : 'visibility'}
                                        onClick={this.togglePasswordVisibility} />
                        </div>
                        <Dropdown value={languageStore.language}
                                  source={languageStore.translationLangsDataSource}
                                  onChange={languageStore.changeLanguage} />
                    </div>
                    <Button className="login-button" label={t('login')} flat
                            onClick={this.login}
                            disabled={this.loginStore.hasErrors} />
                    <div className="login-reg-button">
                        <a href={config.termsUrl}>{t('terms')}</a> | <Link to="/signup">{t('signup')}</Link>
                    </div>

                </div>
                {/* <div className="flex-col welcome">
                    <h4 className="welcome-title">Simple and secure.</h4>
                    <p>
                       Send messages, share files, and store documents online.
                    </p>
                    <p>
                        Encrypt everything before it leaves your device.
                    </p>
                    <p>
                       You decide who accesses your data.
                    </p>
                </div> */}
                <Snackbar location="login" />
            </div>
        );
    }
}


module.exports = Login;
