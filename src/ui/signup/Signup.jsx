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
const T = require('~/ui/shared-components/T');
const SaveNow = require('~/ui/signup/SaveNow');

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

        return u.createAccountAndLogin()
            .then(() => {
                User.current = u;
                this.busy = false;
                // User.current.setPasscode(this.passcodeStore.passcode)
                //    .catch(() => {
                //        warnings.addSevere('error_passcodeSetFailed');
                //    });
                window.router.push('/autologin');
            })
            .catch(err => {
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

    render() {
        const termsDialogActions = [
            { label: t('button_ok'), onClick: this.hideTermsDialog }
        ];
        const errorActions = [
            { label: t('button_cancel'), onClick: this.hideError },
            { label: t('button_retry'), onClick: this.createAccount }
        ];

        return (
            <div className={css('signup', 'rt-light-theme', { show: this.show })}>
                <div className="signup-content">
                    <img alt="" className="logo" src="static/img/logo-with-tag.png" />
                    <div className="signup-form">

                        {
                            this.step === 1
                                ? <Profile store={this.profileStore} returnHandler={this.advance} />
                                : null
                        }
                        {
                            this.step === 2
                                ? (
                                    <div className="passcode">
                                        <div className="signup-title">{t('title_signupStep2')}</div>
                                        <div className="signup-subtitle">{t('title_AccountKey')}</div>
                                        <AccountKey profileStore={this.profileStore}
                                            returnHandler={this.advance} />
                                    </div>
                                ) : null
                        }
                        {
                            this.step === 3
                                ? <SaveNow store={this.profileStore} />
                                : null
                        }

                        <T k="title_TOSRequestText" className="terms">
                            {{
                                tosButton: text => (<Button onClick={this.showTermsDialog}
                                    label={text}
                                    className="button-link" />)
                            }}
                        </T>
                    </div>
                    <div className="signup-nav">
                        <Button flat
                            label={this.step === 1 ? t('button_cancel') : t('button_back')}
                            onClick={this.retreat} />
                        <Button flat
                            label={this.step === 1 || this.step === 2 ? t('button_next') : t('button_finish')}
                            onClick={this.advance}
                            disabled={this.hasErrors} />
                    </div>
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
