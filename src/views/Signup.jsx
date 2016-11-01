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
        this.navigateToPasscode = this.navigateToPasscode.bind(this);
        this.createAccountWithPasscode = this.createAccountWithPasscode.bind(this);
        autorunAsync(() => {
            if (this.username === undefined) return;
            User.validateUsername(this.username)
                .then(res => { this.usernameError = res ? '' : t('usernameNotAvailable'); });
        }, 100);
    }

    componentDidMount() {
        this.expand = true;
    }

    createAccountWithPasscode() {
        if (!this.passcodeStore.hasErrors) {
            return this.createAccount()
                .then(() => User.current.setPasscode(this.passcodeStore.passcode))
                .then(() => {
                    this.context.router.push('/app');
                });
        }
        return Promise.resolve(false);
    }

    createAccountWithoutPasscode() {
        this.createAccount();
        // then: show passphrase
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

        return u.createAccountAndLogin()
            .then(() => {
                User.current = u;
                this.busy = false;
                this.context.router.push('/app');
            })
            .catch(err => {
                this.busy = false;
                alert(`Error: ${errors.normalize(err)}`);
            });
    }

    navigateToPasscode() {
        this.busy = true;

        if (!this.profileStore.hasErrors) {
            this.step = 2;
            this.busy = false;
        }
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
                        <Button flat label={this.step === 1 ? t('next') : t('button_finish')}
                                onClick={this.step === 1 ? this.navigateToPasscode : this.createAccountWithPasscode}
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
