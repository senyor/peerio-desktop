/* eslint-disable jsx-a11y/no-static-element-interactions*/
const React = require('react');
const { Component } = require('react');
const { Layout, Panel, Input, Dropdown, Button } = require('react-toolbox');
const { pCrypto, config } = require('../icebear'); // eslint-disable-line
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const languageStore = require('../stores/language-store');
const { Link } = require('react-router');

@observer class Login extends Component {
    @observable username ='';
    @observable password ='';

    constructor() {
        super();
        this.usernameUpdater = (val) => { this.username = val; };
        this.passwordUpdater = (val) => { this.password = val; };
    }

    navigateToSignup() {

    }
    render() {
        return (
            <Layout>
                <Panel className="login">
                    <img role="presentation" className="login-logo" src="static/img/peerio-logo-white.png" />
                    <Input type="text" className="login-input" label={t('username')}
                        value={this.username} onChange={this.usernameUpdater} />
                    <Input type="password" className="login-input" label={t('passphrase')}
                        value={this.password} onChange={this.passwordUpdater} />
                    <Dropdown className="login-input" value={languageStore.language}
                        source={languageStore.translationLangsDataSource} onChange={languageStore.changeLanguage} />
                    <Button className="login-button rt-light-theme" label={t('login')} flat />
                    <div className="login-reg-button">
                        <a href={config.termsUrl}>{t('terms')}</a>&nbsp;&nbsp;|&nbsp;&nbsp;
                        <Link to="/signup">{t('signup')}</Link>
                    </div>
                </Panel>
                <Panel className="welcome">
                    <div className="welcome-text">
                        <div className="welcome-title">Welcome to Peerio Alpha (codename Icebear)</div>
                        [changelog should magically appear here in the nearest future]<br /><br />
                        <div>
                            In this release you can:<br /><br />
                            * create an account<br />
                            * login<br />
                            * change interface language<br />
                            * eat icecream
                        </div>
                    </div>
                    {randomGif()}
                </Panel>
            </Layout>
        );
    }
}

let cachedGif = null;
function randomGif() {
    return cachedGif || (cachedGif = (<img role="presentation" className="ice-gif"
        src={`static/ice/${pCrypto.util.getRandomNumber(1, 25)}.gif`} />));
}


module.exports = Login;
