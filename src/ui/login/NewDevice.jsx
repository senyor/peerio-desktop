import React from 'react';
import { Button } from 'peer-ui';
import { User, warnings, t } from 'peerio-icebear';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import css from 'classnames';
import FullCoverLoader from '~/ui/shared-components/FullCoverLoader';
import { Passcode, PasscodeStore } from '../signup/Passcode';
import T from '~/ui/shared-components/T';

@observer
class NewDevice extends React.Component {
    @observable busy = false;

    passcodeStore = new PasscodeStore();

    constructor() {
        super();
        this.createPasscode = this.createPasscode.bind(this);
        this.skip = this.skip.bind(this);
    }

    /**
     * Disallow user's names.
     */
    componentDidMount() {
        this.passcodeStore.addToBanList([
            User.current.username,
            User.current.firstName,
            User.current.lastName
        ]);
    }

    /**
     * Set passcode.
     *
     * @returns {Promise}
     */
    @action
    createPasscode() {
        if (this.passcodeStore.hasErrors || this.busy) return Promise.resolve(false);
        this.busy = true;
        return User.current.setPasscode(this.passcodeStore.passcode).then(() => {
            this.busy = false;
            warnings.add('warning_passcodeAdded');
            window.router.push('/app/chats');
        });
    }

    /**
     * Disable passcode.
     */
    skip() {
        this.busy = true;
        User.current.disablePasscode().then(() => {
            this.busy = false;
            window.router.push('/app/chats');
        });
    }

    render() {
        return (
            <div className={css('signup', 'show', 'test-new-device')}>
                <div className="signup-content">
                    <img className="logo" src="static/img/logo-white.png" />
                    <div className="signup-form">
                        <div className="passcode">
                            <div className="signup-title">{t('title_newDeviceSetup')}</div>
                            <div className="signup-subtitle">{t('title_createPassword')}</div>
                            <p>
                                <T k="title_passwordIntro" className="signup-title" />
                            </p>
                            <p>{t('title_passwordSkip')}</p>
                            <Passcode
                                store={this.passcodeStore}
                                returnHandler={this.createPasscode}
                            />
                        </div>
                    </div>
                    <FullCoverLoader show={this.busy} />

                    <div className="signup-nav">
                        <Button label={t('button_skip')} onClick={this.skip} />
                        <Button
                            label={t('button_finish')}
                            onClick={this.createPasscode}
                            disabled={this.passcodeStore.hasErrors}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default NewDevice;
