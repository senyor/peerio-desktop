const React = require('react');
const { Button, Dialog } = require('react-toolbox');
const { User, errors } = require('../icebear'); // eslint-disable-line
const { observable, computed } = require('mobx');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const { Link } = require('react-router');
const css = require('classnames');
const languageStore = require('../stores/language-store');
const FullCoverSpinner = require('../components/FullCoverSpinner');
const { SignupProfile, ProfileStore } = require('./SignupProfile');
const { SignupPasscode, PasscodeStore } = require('./SignupPasscode');

@observer class Signup extends React.Component {
    @observable busy = false;
    @observable expand = false; // starts expand animation
    @observable step = 1; // 1 -profile, 2- passcode
    @observable errorVisible = false;
    @observable errorMessage = undefined;

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
        this.createAccountWithPasscode = this.createAccountWithPasscode.bind(this);
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
                })
                .catch(err => {});
        }
        return Promise.resolve(false);
    }

    createAccountWithoutPasscode() {
        this.createAccount()
            .catch(err => {});
        // TODO then: show passphrase
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
                this.errorVisible = true;
                this.errorMessage = errors.normalize(err).message || t('signup_serverError'); // TODO handle error types
                throw err;
            });
    }

    errorActions = [
        { label: t('ok'), onClick: () => { this.navigateToProfile(); } }
    ];

    navigateToPasscode = () => {
        if (!this.profileStore.hasErrors) {
            this.step = 2;
            this.busy = false;
        }
    };

    navigateToProfile = () => {
        this.step = 1;
        this.busy = false;
        this.errorVisible = false;
    };

    advance = () => {
        if (this.step === 1) {
            this.navigateToPasscode();
        } else {
            this.createAccountWithPasscode();
        }
    };

    // todo retreat
    render() {
        return (
            <div className={css('signup', 'rt-light-theme', { expand: this.expand })}>
                <img role="presentation" className="logo" src="static/img/peerio-logo-white.png" />
                <div className="signup-form" scrollY>
                    <div className="signup-title">{t('signup')}</div>
                    {this.step === 1 ?
                        <SignupProfile store={this.profileStore} returnHandler={this.advance} /> :
                            <SignupPasscode
                                store={this.passcodeStore}
                                profileStore={this.profileStore}
                                returnHandler={this.advance} />}
                </div>

                <div className="signup-nav">
                    <Link to="/">
                        <Button flat label={this.step === 1 ? t('button_exit') : t('button_back')} />
                    </Link>
                    <Button flat label={this.step === 1 ? t('next') : t('button_finish')}
                            onClick={this.advance}
                            disabled={this.hasError}
                    />
                </div>
                <div className="progress">
                    <div className={`indicator ${this.step === 1 ? 'active' : ''}`} />
                    <div className={`indicator ${this.step === 2 ? 'active' : ''}`} />
                </div>
                <FullCoverSpinner show={this.busy} />
                <Dialog actions={this.errorActions} active={this.errorVisible}
                        onEscKeyDown={this.navigateToProfile} onOverlayClick={this.navigateToProfile}
                        title={t('error')}>{this.errorMessage}</Dialog>
            </div>
        );
    }
}

Signup.contextTypes = {
    router: React.PropTypes.object
};

module.exports = Signup;
