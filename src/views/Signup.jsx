const React = require('react');
const { Component } = require('react');
const { Layout, Panel, Button } = require('react-toolbox');
const { pCrypto, config, User, errors } = require('../icebear'); // eslint-disable-line
const { observable, autorunAsync, computed } = require('mobx');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const { Link } = require('react-router');
const css = require('classnames');
const languageStore = require('../stores/language-store');
const FullCoverSpinner = require('../components/FullCoverSpinner');
const { SignupProfile, ProfileStore } = require('./SignupProfile');
const { SignupPasscode, PasscodeStore } = require('./SignupPasscode');
const storage = require('../stores/tiny-db');

//----------------------------------------------------------------------------------------------------------------
@observer class Signup extends Component {
    @observable busy = false;
    @observable expand = false; // starts expand animation
    @observable step = 1; // 1 -profile, 2- passcode
    profileStore = new ProfileStore();
    passcodeStore = new PasscodeStore();

    @computed get hasError() {
        if (this.step === 1) {
            return this.profileStore.hasErrors;
        }
        return this.passcodeStore.hasErrors;
    }

    constructor() {
        super();
        this.usernameUpdater = (val) => { this.username = val; };
        this.emailUpdater = (val) => { this.email = val; };
        this.firstNameUpdater = (val) => { this.firstName = val; };
        this.lastNameUpdater = (val) => { this.lastName = val; };
        this.createAccount = this.createAccount.bind(this);
        this.setPasscode = this.setPasscode.bind(this);
        autorunAsync(() => {
            if (this.username === undefined) return;
            User.validateUsername(this.username)
                .then(res => { this.usernameError = res ? '' : t('usernameNotAvailable'); });
        }, 100);
    }

    componentDidMount() {
        this.expand = true;
    }

    setPasscode() {
        if (!this.passcodeStore.hasErrors) {
            return User.current.getPasscodeSecret(this.passcodeStore.passcode)
                .then((passcodeSecret) => {
                    const passcodeSecretToSerialize = Array.apply(null, passcodeSecret);
                    storage.set(`${User.current.username}:passcode`, passcodeSecretToSerialize);
                    this.context.router.push('/app');
                });
        }
        return false;
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
                this.step = 2;
                this.busy = false;
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
                    <Panel className="signup-form" scrollY>
                        <div className="signup-title">{t('signup')}</div>
                        {this.step === 1 ?
                            <SignupProfile store={this.profileStore} /> :
                                <SignupPasscode store={this.passcodeStore} />}
                    </Panel>

                    <div className="signup-nav">
                        <Link to="/"><Button flat label={t('button_exit')} /></Link>
                        <Button flat label={t('next')}
                                onClick={this.step === 1 ? this.createAccount : this.setPasscode}
                                disabled={this.hasError}
                        />
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
