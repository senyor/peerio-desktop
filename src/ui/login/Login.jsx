/* eslint-disable jsx-a11y/no-static-element-interactions*/
const React = require('react');
const { Component } = require('react');
const { Dropdown, Button, Dialog, IconButton } = require('react-toolbox');
const { config, socket, User, validation } = require('../../icebear'); // eslint-disable-line
const { observable, computed } = require('mobx');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const languageStore = require('../../stores/language-store');
const { Link } = require('react-router');
const ValidatedInput = require('../shared-components/ValidatedInput');
const FullCoverLoader = require('../shared-components/FullCoverLoader');
const T = require('../shared-components/T');
const OrderedFormStore = require('../../stores/ordered-form-store');

const { validators } = validation; // use common validation from core

class LoginStore extends OrderedFormStore {
    // also has observables usernameValid, usernameDirty created by ValidatedInput
    @observable username = '';
    @observable passcodeOrPassphrase = '';

    // non ValidatedInput-enhanced observables
    @observable busy = false;
    @observable errorVisible = false;
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

    actions = [{ label: t('ok'), onClick: this.hideDialog }];

    constructor() {
        super();
        this.loginStore = new LoginStore();
    }

    componentDidMount() {
        User.getLastAuthenticated()
            .then((lastUserObject) => {
                if (lastUserObject) {
                    this.loginStore.lastAuthenticatedUser = lastUserObject;
                    this.loginStore.username = lastUserObject.username;
                } else {
                    this.loginStore.username = config.autologin ? config.autologin.username : '';
                    this.loginStore.passcodeOrPassphrase = config.autologin ? config.autologin.passphrase : '';
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
        if (this.loginStore.busy) return;
        this.loginStore.busy = true;
        const user = new User();
        user.username = this.loginStore.username || this.loginStore.lastAuthenticatedUser.username;
        user.passphrase = this.loginStore.passcodeOrPassphrase;
        user.login().then(() => {
            User.current = user;
            window.router.push('/app');
        }).catch(err => {
            console.error(err);
            this.errorMsg = t('error_loginFailed');
            this.loginStore.errorVisible = true;
            this.loginStore.busy = false;
        });
    };

    handleKeyPress =(e) => {
        if (e.key === 'Enter') {
            this.login();
        }
    };

    hideDialog = () => {
        this.loginStore.errorVisible = false;
    };

    getWelcomeBlock = () => {
        return (
            <div className="welcome-back" onClick={this.unsetLastUser}>
                <div className="overflow ">{t('login_welcomeBack')}
                    <strong>
                        {this.loginStore.lastAuthenticatedUser.firstName || this.loginStore.lastAuthenticatedUser.username}
                    </strong>
                </div>
                <div className="subtitle">
                    <div className="overflow">
                        <T k="login_changeUser">
                            {{ username: (this.loginStore.lastAuthenticatedUser.firstName || this.loginStore.lastAuthenticatedUser.username) }}
                        </T>
                    </div>
                </div>
            </div>
        );
    };

    render() {
        console.log('logins tore', this.loginStore);
        return (
            <div className="flex-row app-root">
                <FullCoverLoader show={this.loginStore.busy} />
                <div className="login rt-light-theme">
                    <img role="presentation" className="logo" src="static/img/peerio-logo-white.png" />

                    {this.loginStore.lastAuthenticatedUser ? this.getWelcomeBlock() : ''}

                    <div className="login-form">
                        <ValidatedInput label={t('username')}
                                        name="username"
                                        position="0"
                                        store={this.loginStore}
                                        validator={validators.usernameLogin}
                                        onKeyPress={this.handleKeyPress}
                                        className={this.loginStore.lastAuthenticatedUser ? 'banish' : ''} />
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
                <div className="flex-col welcome">
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
                </div>
                <Dialog actions={this.actions}
                        active={this.loginStore.errorVisible}
                        onEscKeyDown={this.hideDialog}
                        onOverlayClick={this.hideDialog}
                        title={t('error')}>{this.errorMsg}</Dialog>
            </div>
        );
    }
}


module.exports = Login;
