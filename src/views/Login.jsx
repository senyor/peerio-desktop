/* eslint-disable jsx-a11y/no-static-element-interactions*/
const React = require('react');
const { Component } = require('react');
const { Layout, Panel, Input, Dropdown, Button, Dialog, IconButton } = require('react-toolbox');
const { pCrypto, config, User } = require('../icebear'); // eslint-disable-line
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const languageStore = require('../stores/language-store');
const { Link } = require('react-router');
const FullCoverSpinner = require('../components/FullCoverSpinner');

@observer class Login extends Component {
    @observable username ='';
    @observable passphrase ='';
    @observable busy = false;
    @observable errorVisible = false;
    @observable passwordVisible = false;
    hideDialog = () => {
        this.errorVisible = false;
    };

    actions = [{ label: t('ok'), onClick: this.hideDialog }];

    constructor() {
        super();
        this.usernameUpdater = val => { this.username = val; };
        this.passphraseUpdater = val => { this.passphrase = val; };
        this.login = this.login.bind(this);
        this.togglePasswordVisibility = this.togglePasswordVisibility.bind(this);
    }

    togglePasswordVisibility(){
        this.passwordVisible = !this.passwordVisible;
    }

    login() {
        if (this.busy) return;
        this.busy = true;
        const user = new User();
        user.username = this.username;
        user.passphrase = this.passphrase;
        user.login().then(() => {
            User.current = user;
            this.context.router.push('/app');
        }).catch(err => {
            console.error(err);
            this.errorMsg = t('error_loginFailed');
            this.errorVisible = true;
            this.busy = false;
        });
    }
    render() {
        return (
            <Layout>
                <Panel className="login rt-light-theme">
                    <img role="presentation" className="logo" src="static/img/peerio-logo-white.png" />
                    <div className="login-form">
                        <Input type="text" label={t('username')}
                            value={this.username} onChange={this.usernameUpdater} />
                        <div className="password">
                            <Input type={this.passwordVisible ? 'text' : 'password'} label={t('passphrase')}
                                value={this.passphrase} onChange={this.passphraseUpdater} />
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
                    {/* TODO: - After Alpha -
                        remove FullCoverSpinner
                       change login button to spinner while working
                       disable inputs while spinner is active */}
                    <FullCoverSpinner show={this.busy} />
                </Panel>
                <Panel className="welcome">
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
                </Panel>
                <Dialog actions={this.actions} active={this.errorVisible}
                        onEscKeyDown={this.hideDialog} onOverlayClick={this.hideDialog}
                        title={t('error')}>{this.errorMsg}</Dialog>
            </Layout>
        );
    }
}

Login.contextTypes = {
    router: React.PropTypes.object
};

let cachedGif = null;
function randomGif() {
    return cachedGif || (cachedGif = (<img role="presentation" className="ice-gif"
        src={`static/ice/${pCrypto.util.getRandomNumber(1, 25)}.gif`} />));
}


module.exports = Login;
