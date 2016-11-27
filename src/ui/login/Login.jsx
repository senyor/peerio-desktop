/* eslint-disable jsx-a11y/no-static-element-interactions*/
const React = require('react');
const { Component } = require('react');
const { Input, Dropdown, Button, Dialog, IconButton } = require('react-toolbox');
const { config, socket, User } = require('../../icebear'); // eslint-disable-line
const { observable, computed } = require('mobx');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const languageStore = require('../../stores/language-store');
const { Link } = require('react-router');
const FullCoverLoader = require('../shared-components/FullCoverLoader');
const T = require('../shared-components/T');

@observer class Login extends Component {
    @observable username = config.autologin ? config.autologin.username : '';
    @observable passcodeOrPassphrase = config.autologin ? config.autologin.passphrase : '';
    @observable busy = false;
    @observable errorVisible = false;
    @observable passwordVisible = false;
    @observable lastUser = undefined;

    hideDialog = () => {
        this.errorVisible = false;
    };

    @computed get hasError() {
        console.log('socket', socket.connected);
        return !(this.username && this.passcodeOrPassphrase && socket.connected);
    }

    actions = [{ label: t('ok'), onClick: this.hideDialog }];

    constructor() {
        super();
        this.usernameUpdater = val => { this.username = val; };
        this.passphraseUpdater = val => { this.passcodeOrPassphrase = val; };
        this.login = this.login.bind(this);
        this.togglePasswordVisibility = this.togglePasswordVisibility.bind(this);
        this.unsetLastUser = this.unsetLastUser.bind(this);
        User.getLastAuthenticated()
            .then((user) => {
                this.lastUser = user;
            });
    }

    togglePasswordVisibility() {
        this.passwordVisible = !this.passwordVisible;
    }

    unsetLastUser() {
        return User.removeLastAuthenticated()
            .then(() => {
                this.lastUser = undefined;
            });
    }

    login() {
        if (this.busy) return;
        this.busy = true;
        const user = new User();
        user.username = this.username || this.lastUser.username;
        user.passphrase = this.passcodeOrPassphrase;
        user.login().then(() => {
            User.current = user;
            window.router.push('/app');
        }).catch(err => {
            console.error(err);
            this.errorMsg = t('error_loginFailed');
            this.errorVisible = true;
            this.busy = false;
        });
    }

    handleKeyPress =(e) => {
        if (e.key === 'Enter') {
            this.login();
        }
    };

    getWelcomeBlock = () => {
        return (
            <div className="welcome-back" onClick={this.unsetLastUser}>
                <div className="overflow ">{t('login_welcomeBack')}
                    <strong> {this.lastUser.firstName || this.lastUser.username}</strong>
                </div>
                <div className="subtitle">
                    <div className="overflow">
                        <T k="login_changeUser">
                            {{ username: (this.lastUser.firstName || this.lastUser.username) }}
                        </T>
                    </div>
                </div>
            </div>
        );
    };

    render() {
        return (
            <div className="flex-row app-root">
                <FullCoverLoader show={this.busy} />
                <div className="login rt-light-theme">
                    <img role="presentation" className="logo" src="static/img/peerio-logo-white.png" />

                    {this.lastUser ? this.getWelcomeBlock() : ''}

                    <div className="login-form">
                        <Input type="text" label={t('username')} value={this.username}
                               onChange={this.usernameUpdater}
                               onKeyPress={this.handleKeyPress}
                               className={this.lastUser ? 'banish' : ''}
                        />
                        <div className="password">
                            <Input type={this.passwordVisible ? 'text' : 'password'} label={t('passcodeOrPassphrase')}
                                   value={this.passcodeOrPassphrase}
                                   onChange={this.passphraseUpdater} onKeyPress={this.handleKeyPress} />
                            <IconButton icon={this.passwordVisible ? 'visibility_off' : 'visibility'}
                                onClick={this.togglePasswordVisibility} />
                        </div>
                        <Dropdown value={languageStore.language}
                            source={languageStore.translationLangsDataSource} onChange={languageStore.changeLanguage} />
                    </div>
                    <Button className="login-button" label={t('login')} flat onClick={this.login} disabled={this.hasError} />
                    <div className="login-reg-button">
                        <a href={config.termsUrl}>{t('terms')}</a> | <Link to="/signup">{t('signup')}</Link>
                    </div>

                </div>
                <div className="flex-col welcome">
                    <div className="welcome-text">
                        <h4>Welcome to Peerio Alpha (codename Icebear)</h4>
                        [changelog should magically appear here in the nearest future]<br /><br />
                        <div>
                            In this release you can:<br /><br />
                            * create an account<br />
                            * login<br />
                            * change interface language<br />
                            * send messages <br />
                        </div>
                        <br />
                        <strong>For your convenience passphrase is always 'icebear'.</strong>
                    </div>
                </div>
                <Dialog actions={this.actions} active={this.errorVisible}
                        onEscKeyDown={this.hideDialog} onOverlayClick={this.hideDialog}
                        title={t('error')}>{this.errorMsg}</Dialog>
            </div>
        );
    }
}


module.exports = Login;
