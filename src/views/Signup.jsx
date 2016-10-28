const React = require('react');
const { Component } = require('react');
const { Layout, Panel, Button } = require('react-toolbox');
const { pCrypto, config, User, errors } = require('../icebear'); // eslint-disable-line
const { observable, autorunAsync } = require('mobx');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const { Link } = require('react-router');
const css = require('classnames');
const languageStore = require('../stores/language-store');
const FullCoverSpinner = require('../components/FullCoverSpinner');
const { SignupProfile, ProfileStore } = require('./SignupProfile');

//----------------------------------------------------------------------------------------------------------------
@observer class Signup extends Component {
    @observable busy = false;
    @observable expand = false; // starts expand animation
    @observable step = 1; // 1 -profile, 2- passcode
    profileStore = new ProfileStore();
    // passcodeStore = new PasscodeStore();

    constructor() {
        super();
        this.usernameUpdater = (val) => { this.username = val; };
        this.emailUpdater = (val) => { this.email = val; };
        this.firstNameUpdater = (val) => { this.firstName = val; };
        this.lastNameUpdater = (val) => { this.lastName = val; };
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
        const u = new User();
        u.username = this.profileStore.username;
        u.email = this.profileStore.email;
        u.firstName = this.profileStore.firstName;
        u.lastName = this.profileStore.lastName;
        u.locale = languageStore.language;
        u.passphrase = 'icebear';
        u.createAccountAndLogin()
            .then(() => {
                User.current = u;
                this.context.router.push('/app');
            })
            .catch(err => {
                this.busy = false;
                alert(`Error: ${errors.normalize(err)}`);
            });
    }

    render() {
        return (
            <Layout>
                <Panel className={css('signup', 'rt-light-theme', { expand: this.expand })} >
                    <img role="presentation" className="logo" src="static/img/peerio-logo-white.png" />
                    <Panel className="signup-inner" scrollY>
                        <div className="signup-title">{t('signup')}</div>
                        {this.step === 1 ? <SignupProfile store={this.profileStore} /> : 'Hello, Passcode'}
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

Signup.contextTypes = {
    router: React.PropTypes.object
};

module.exports = Signup;
