const React = require('react');
const { Component } = require('react');
const { Layout, Panel, Input, Dropdown, Button, ProgressBar } = require('react-toolbox');
const { pCrypto, config, User, errors } = require('../icebear'); // eslint-disable-line
const { observable, autorunAsync } = require('mobx');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const { Link } = require('react-router');
const css = require('classnames');
const languageStore = require('../stores/language-store');
const FullCoverSpinner = require('../components/FullCoverSpinner');

@observer class Signup extends Component {
    @observable username: string = undefined;
    @observable email: string ='';
    @observable firstName: string ='';
    @observable lastName: string ='';
    @observable expand: boolean = false;
    @observable busy: boolean = false;
    @observable usernameError: string = '';

    constructor() {
        super();
        this.usernameUpdater = (val: string) => { this.username = val; };
        this.emailUpdater = (val: string) => { this.email = val; };
        this.firstNameUpdater = (val: string) => { this.firstName = val; };
        this.lastNameUpdater = (val: string) => { this.lastName = val; };
        this.createAccount = this.createAccount.bind(this);
        autorunAsync(() => {
            if (this.username === undefined) return;
            User.validateUsername(this.username)
                .then(res => { this.usernameError = res ? '' : t('usernameNotAvailable'); });
        }, 100);
    }
    componentDidMount() {
        this.expand = true;
    }

    createAccount() {
        this.busy = true;
        const u = this.user = new User();
        u.username = this.username;
        u.email = this.email;
        u.firstName = this.firstName;
        u.lastName = this.lastName;
        u.locale = languageStore.language;
        u.createAccount()
            .then(() => alert('success'))
            .catch(err => {
                this.busy = false;
                alert(`Error: ${errors.normalize(err)}`);
            });
    }
    render() {
        return (
          <Layout>
            <Panel className={css('signup', { expand: this.expand })} >
              <img role="presentation" className="signup-logo" src="static/img/peerio-logo-white.png" />
              <Panel className="signup-inner" scrollY>
                <div className="signup-title">{t('signup')}</div>
                <div className="signup-subtitle">{t('profile')}</div>
                <Input type="text" className="login-input" label={t('username')} error={this.usernameError}
                    value={this.username} onChange={this.usernameUpdater} />
                <Input type="text" className="login-input" label={t('email')}
                    value={this.email} onChange={this.emailUpdater} />
                <Input type="text" className="login-input" label={t('firstName')}
                    value={this.firstName} onChange={this.firstNameUpdater} />
                <Input type="text" className="login-input" label={t('lastName')}
                    value={this.lastName} onChange={this.lastNameUpdater} />

                <Dropdown className="login-input" value={languageStore.language}
                    source={languageStore.translationLangsDataSource} onChange={languageStore.changeLanguage} />

                <div className="signup-terms">
                  {t('signup_TOSRequestText', { tosLink: text => <a href={config.termsUrl}>{text}</a> })}
                </div>
              </Panel>
              <div className="signup-nav">
                <Link to="/"><Button flat label={t('button_exit')} /></Link>
                <Button flat label={t('next')} onClick={this.createAccount} />
              </div>
              <FullCoverSpinner show={this.busy} />
            </Panel>
          </Layout>
        );
    }
}

module.exports = Signup;
