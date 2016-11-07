/* eslint-disable jsx-a11y/no-static-element-interactions*/
const React = require('react');
const { withRouter } = require('react-router');
const { Component } = require('react');
const { Input, Dropdown, Button, Dialog, IconButton } = require('react-toolbox');
const { cryptoUtil, config, User } = require('../icebear'); // eslint-disable-line
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const languageStore = require('../stores/language-store');
const { Link } = require('react-router');
const FullCoverSpinner = require('../components/FullCoverSpinner');
const T = require('../components/T');

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

    actions = [{ label: t('ok'), onClick: this.hideDialog }];

    constructor() {
        super();
        this.usernameUpdater = val => { this.username = val; };
        this.passphraseUpdater = val => { this.passcodeOrPassphrase = val; };
        this.login = this.login.bind(this);
        this.togglePasswordVisibility = this.togglePasswordVisibility.bind(this);
        this.unsetLastUser = this.unsetLastUser.bind(this);
        User.getLastAuthenticated()
            .then((username) => {
                console.log('user',username)
                this.lastUser = username;
            })
            .catch(err => {
                console.log('wh',err)
            })
    }

    togglePasswordVisibility() {
        this.passwordVisible = !this.passwordVisible;
    }

    unsetLastUser () {
        return User.removeLastAuthenticated()
            .then(() => {
                this.lastUser = undefined;
            })
    }

    login() {
        if (this.busy) return;
        this.busy = true;
        const user = new User();
        user.username = this.username || this.lastUser;
        user.passphrase = this.passcodeOrPassphrase;
        user.login().then(() => {
            User.current = user;
            this.props.router.push('/app');
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

    render() {
        return (
            <div className="flex-row app-root">
                {/* TODO: - After Alpha -
                    remove FullCoverSpinner
                   change login button to spinner while working
                   disable inputs while spinner is active */}
                <FullCoverSpinner show={this.busy} />
                <div className="login rt-light-theme">
                    <img role="presentation" className="logo" src="static/img/peerio-logo-white.png" />
                    <div className={this.lastUser ? 'welcome-back' : 'hide'} >
                        <div>{t('login_welcomeBack')} <strong>{this.lastUser}</strong></div>
                        <div className="subtitle">
                            <T k="login_changeUser">
                                {{
                                    username: text => <span>{this.lastUser}</span>,
                                    changeLink: text => <a onClick={this.unsetLastUser}>{text}</a>
                                }}
                            </T>
                        </div>
                    </div>
                    <div className="login-form">
                        <Input type="text" label={t('username')} value={this.username}
                               onChange={this.usernameUpdater}
                               onKeyPress={this.handleKeyPress}
                               className={this.lastUser ? 'hide' : '' }
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
                    <Button className="login-button" label={t('login')} flat onClick={this.login} />
                    <div className="login-reg-button">
                        <a href={config.termsUrl}>{t('terms')}</a> | <Link to="/signup">{t('signup')}</Link>
                    </div>

                </div>
                <div className="flex-col welcome">
                    <div className="welcome-text">
                        <div className="display-2">Welcome to Peerio Alpha (codename Icebear)</div>
                        [changelog should magically appear here in the nearest future]<br /><br />
                        <div>
                            In this release you can:<br /><br />
                            * create an account<br />
                            * login<br />
                            * change interface language<br />
                            * eat icecream
                        </div>
                        For your convenience passphrase is always 'icebear'
                    </div>
                    {randomGif()}
                </div>
                <Dialog actions={this.actions} active={this.errorVisible}
                        onEscKeyDown={this.hideDialog} onOverlayClick={this.hideDialog}
                        title={t('error')}>{this.errorMsg}</Dialog>
            </div>
        );
    }
}


let cachedGif = null;
function randomGif() {
    return cachedGif || (cachedGif = (<img role="presentation" className="ice-gif"
        src={`static/ice/${cryptoUtil.getRandomNumber(1, 25)}.gif`} />));
}


module.exports = withRouter(Login);
