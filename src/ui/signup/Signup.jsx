const React = require('react');
const { Button, Dialog, IconButton } = require('react-toolbox');
const { User, errors } = require('~/icebear');
const { observable, computed } = require('mobx');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const css = require('classnames');
const languageStore = require('~/stores/language-store');
const FullCoverLoader = require('~/ui/shared-components/FullCoverLoader');
const { Profile, ProfileStore } = require('./Profile');
const { Passcode, PasscodeStore } = require('./Passcode');
const Snackbar = require('~/ui/shared-components/Snackbar');


@observer class Signup extends React.Component {
    @observable busy = false;
    @observable show = false; // starts show animation
    @observable step = 1; // 1 -profile, 2- passcode
    @observable errorVisible = false;
    @observable errorMessage = undefined;

    passcodeStore = new PasscodeStore();
    profileStore = new ProfileStore();

    @computed get hasErrors() {
        return this.step === 1 ? this.profileStore.hasErrors : this.passcodeStore.hasErrors;
    }

    componentDidMount() {
        this.show = true;
    }

    createAccountWithPasscode = () => {
        if (this.passcodeStore.hasErrors || this.busy) return Promise.resolve(false);
        return this.createAccount()
            .then(() => User.current.setPasscode(this.passcodeStore.passcode))
            .then(() => { window.router.push('/app'); })
            .catch(err => {
                console.error(err);
            });
    };

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
                window.router.push('/app');
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

    navigateToLogin = () => {
        window.router.push('/');
    };

    navigateToPasscode = () => {
        if (this.profileStore.hasErrors || this.busy) return;
        this.step = 2;
        this.busy = false;
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

    retreat = () => {
        if (this.step === 1) {
            this.navigateToLogin();
        } else {
            this.navigateToProfile();
        }
    };

    render() {
        return (
            <div className={css('signup', 'rt-light-theme', { show: this.show })}>
                <img role="presentation" className="logo" src="static/img/logo-white.png" />
                <div className="signup-form">
                    <div className="signup-title">{t('signup')}</div>
                    {
                        this.step === 1
                            ? <Profile store={this.profileStore} returnHandler={this.advance} />
                            : <Passcode store={this.passcodeStore} profileStore={this.profileStore}
                                  returnHandler={this.advance} />
                    }
                </div>
                <div className="signup-nav">
                    <IconButton icon="arrow_back" onClick={this.retreat} />
                    <Button flat label={this.step === 1 ? t('next') : t('button_finish')} onClick={this.advance}
                            disabled={this.hasErrors} />
                </div>
                <div className="progress">
                    <div className={css('indicator', { active: this.step === 1 })} />
                    <div className={css('indicator', { active: this.step === 2 })} />
                </div>
                <FullCoverLoader show={this.busy} />
                <Dialog actions={this.errorActions} active={this.errorVisible}
                        onEscKeyDown={this.navigateToProfile} onOverlayClick={this.navigateToProfile}
                        title={t('error')}>{this.errorMessage}</Dialog>
                <Snackbar location="signup" />
            </div>
        );
    }
}


module.exports = Signup;
