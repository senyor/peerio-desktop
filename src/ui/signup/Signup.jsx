const React = require('react');
const { Button, Dialog } = require('~/react-toolbox');
const { PhraseDictionary, User, errors, systemWarnings } = require('~/icebear');
const { observable, computed } = require('mobx');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const css = require('classnames');
const languageStore = require('~/stores/language-store');
const FullCoverLoader = require('~/ui/shared-components/FullCoverLoader');
const Terms = require('~/ui/shared-components/Terms');
const { Profile, ProfileStore } = require('./Profile');
const { Passcode, PasscodeStore } = require('./Passcode');
const Snackbar = require('~/ui/shared-components/Snackbar');
const T = require('~/ui/shared-components/T');

@observer class Signup extends React.Component {
    @observable busy = false;
    @observable show = false; // starts show animation
    @observable step = 1; // 1 -profile, 2- passcode
    @observable errorVisible = false;
    @observable errorMessage = undefined;
    @observable termsDialogOpen = false;

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
        this.hideError();
        this.busy = true;

        const u = new User();
        u.username = this.profileStore.username;
        u.email = this.profileStore.email;
        u.firstName = this.profileStore.firstName;
        u.lastName = this.profileStore.lastName;
        u.locale = languageStore.language;
        u.passphrase = PhraseDictionary.current.getPassphrase(5);

        return u.createAccountAndLogin()
            .then(() => {
                User.current = u;
                this.busy = false;
                User.current.setPasscode(this.passcodeStore.passcode)
                    .catch(() => {
                        systemWarnings.add({
                            content: t('error_passcodeSetFailed'),
                            level: 'severe'
                        });
                    });
                window.router.push('/app');
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

    navigateToPasscode = () => {
        if (this.profileStore.hasErrors || this.busy) return;
        this.passcodeStore.addToBanList([
            this.profileStore.username,
            this.profileStore.firstName,
            this.profileStore.lastName
        ]);
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
            { label: t('button_retry'), onClick: this.createAccountWithPasscode }
        ];

        return (
            <div className={css('signup', 'rt-light-theme', { show: this.show })}>
                <div className="signup-content">
                    <img alt="" className="logo" src="static/img/logo-white.png" />
                    <div className="signup-form">

                        {
                            this.step === 1
                                ? <Profile store={this.profileStore} returnHandler={this.advance} />
                                : (
                                    <div className="passcode">
                                        <div className="signup-title">{t('title_signupStep2')}</div>
                                        <div className="signup-subtitle">{t('title_createPassword')}</div>
                                        <p><T k="title_passwordIntro" className="signup-title">
                                            {{
                                                emphasis: text => <strong>{text}</strong>
                                            }}
                                        </T></p>
                                        <p><T k="title_MPIntro1" className="signup-title">
                                            {{
                                                emphasis: text => <strong>{text}</strong>
                                            }}
                                        </T></p>
                                        <p><T k="title_MPIntro2" className="signup-title">
                                            {{
                                                emphasis: text => <strong>{text}</strong>
                                            }}
                                        </T></p>
                                        <Passcode store={this.passcodeStore} profileStore={this.profileStore}
                                            returnHandler={this.advance} />
                                    </div>
                                )
                        }

                        <T k="title_TOSRequestText" className="terms">
                            {{
                                emphasis: text => <strong>{text}</strong>,
                                tosLink: text => <Button onClick={this.showTermsDialog}
                                    label={text}
                                    className="button-link" />
                            }}
                        </T>
                    </div>
                    <div className="signup-nav">
                        <Button flat
                            label={this.step === 1 ? t('button_cancel') : t('button_back')}
                            onClick={this.retreat} />
                        <Button flat
                            label={this.step === 1 ? t('button_next') : t('button_finish')}
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
                    <Snackbar location="signup" />

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
