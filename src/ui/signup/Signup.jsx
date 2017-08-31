const React = require('react');
const { Button, Dialog } = require('~/react-toolbox');
const { User, errors } = require('~/icebear');
const { observable, computed } = require('mobx');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const css = require('classnames');
const languageStore = require('~/stores/language-store');
const FullCoverLoader = require('~/ui/shared-components/FullCoverLoader');
const Terms = require('~/ui/shared-components/Terms');
const { Profile, ProfileStore } = require('./Profile');
// const { Passcode, PasscodeStore } = require('./Passcode');
const AccountKey = require('./AccountKey');
const Welcome = require('./Welcome');
const T = require('~/ui/shared-components/T');
const ConfirmKey = require('~/ui/signup/ConfirmKey');
const config = require('~/config');

@observer class Signup extends React.Component {
    @observable busy = false;
    @observable show = false; // starts show animation
    @observable step = 1; // 1 -profile, 2- passcode
    @observable errorVisible = false;
    @observable errorMessage = undefined;
    @observable termsDialogOpen = false;

    // passcodeStore = new PasscodeStore();
    profileStore = new ProfileStore();

    @computed get hasErrors() {
        return this.step === 1 ? this.profileStore.hasErrors : false;// this.passcodeStore.hasErrors;
    }

    componentWillMount() {
        this.profileStore.rerollPassphrase();
    }
    componentDidMount() {
        this.show = true;
    }

    createAccount = () => {
        if (this.busy) return Promise.resolve(false);
        this.hideError();
        this.busy = true;
        const u = new User();
        u.username = this.profileStore.username;
        u.email = this.profileStore.email;
        u.firstName = this.profileStore.firstName;
        u.lastName = this.profileStore.lastName;
        u.locale = languageStore.language;
        u.passphrase = this.profileStore.passphrase;

        // DEV MODE ONLY
        if (config.devAutologin && config.devAutologin.signupPassphraseOverride) {
            u.passphrase = config.devAutologin.signupPassphraseOverride;
        }

        User.current = u;
        return u.createAccountAndLogin()
            .then(() => {
                this.busy = false;
                // User.current.setPasscode(this.passcodeStore.passcode)
                //    .catch(() => {
                //        warnings.addSevere('error_passcodeSetFailed');
                //    });
                window.router.push('/autologin');
            })
            .catch(err => {
                User.current = null;
                this.busy = false;
                this.errorVisible = true;
                // todo: error message will not be localized, maybe don't use it at all
                this.errorMessage = `${t('error_signupServerError')} ${errors.normalize(err).message}`;
            });
    }

    navigateToLogin = () => {
        window.router.push('/');
    };

    navigateToAccountKey = () => {
        if (this.profileStore.hasErrors || this.busy) return;
        // this.passcodeStore.addToBanList([
        //     this.profileStore.username,
        //     this.profileStore.firstName,
        //     this.profileStore.lastName
        // ]);
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
            this.navigateToAccountKey();
        } else if (this.step === 2) {
            this.step = 3;
        } else {
            this.createAccount();
        }
    };

    retreat = () => {
        if (this.step === 1) {
            this.navigateToLogin();
        } else if (this.step === 2) {
            this.navigateToProfile();
        } else {
            this.step = 2;
        }
    };

    hideTermsDialog = () => {
        this.termsDialogOpen = false;
    };

    showTermsDialog = () => {
        this.termsDialogOpen = true;
    };

    hideError = () => {
        this.errorVisible = false;
    };

    signupNav = () => {
        return (
            <div className="signup-nav">
                <Button flat
                    label={this.step === 2 ? t('button_cancel') : t('button_back')}
                    onClick={this.retreat} />
                <Button flat primary
                    label={this.step === 2 || this.step === 3 ? t('button_next') : t('button_finish')}
                    onClick={this.advance}
                    disabled={this.hasErrors} />
            </div>
        );
    }

    render() {
        const termsDialogActions = [
            { label: t('button_ok'), onClick: this.hideTermsDialog }
        ];
        const errorActions = [
            { label: t('button_cancel'), onClick: this.hideError },
            { label: t('button_retry'), onClick: this.createAccount }
        ];

        return (
            <div className={css('signup', { show: this.show })}>
                {/* {
                    weclomeScreen ? null : */}
                <div className="signup-step-header">
                    <div className="signup-step-title">Current step</div>
                    <div className="signup-step-indicator">
                        <div className="signup-step">
                            <div className="current-step" />
                        </div>
                        <div className="signup-step-divider" />
                        <div className="signup-step" />
                        <div className="signup-step-divider" />
                        <div className="signup-step" />
                    </div>
                </div>
                {/* } */}
                <div className={this.step === 1 ? 'signup-welcome' : 'signup-content'} >
                    {
                        this.step === 4
                            ? <Welcome returnHandler={this.advance} />
                            : null
                    }

                    {
                        this.step === 2
                            ? <Profile store={this.profileStore} returnHandler={this.advance} />
                            : null
                    }
                    {
                        this.step === 3
                            ? <AccountKey profileStore={this.profileStore} returnHandler={this.advance} />
                            : null
                    }
                    {
                        this.step === 1
                            ? <ConfirmKey store={this.profileStore} />
                            : null
                    }

                    {/* <T k="title_TOSRequestText" className="terms">
                        {{
                            tosButton: text => (<Button onClick={this.showTermsDialog}
                                label={text}
                                className="button-link" />)
                        }}
                    </T> */}
                    {this.step === 1 ?
                        <Button label={t('button_getStarted')} onClick={this.advance} primary />
                        : this.signupNav
                    }
                    {/* <div className="progress">
                        <div className={css('indicator', { active: this.step === 1 })} />
                        <div className={css('indicator', { active: this.step === 2 })} />
                    </div> */}

                    <Dialog actions={errorActions} active={this.errorVisible}
                        onEscKeyDown={this.hideError} onOverlayClick={this.hideError}
                        title={t('title_error')}>{this.errorMessage}</Dialog>

                    <Dialog active={this.termsDialogOpen}
                        actions={termsDialogActions}
                        onOverlayClick={this.hideTermsDialog}
                        onEscKeyDown={this.hideTermsDialog}
                        className="terms">
                        <Terms />
                    </Dialog>

                </div>
                <FullCoverLoader show={this.busy} />
            </div>
        );
    }
}


module.exports = Signup;
