import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Input } from 'peer-ui';
import { User, t } from 'peerio-icebear';
import _ from 'lodash';

@observer
class PasscodeLock extends React.Component {
    @observable passcode = '';
    @observable error;

    handleChange = val => {
        this.passcode = val;
        this.validatePasscode();
    };

    unlock = () => {
        this.props.onUnlocked();
        this.error = null;
    };

    handleError = () => {
        this.error = t('error_wrongPassword');
    };

    validatePasscode = _.debounce(() => {
        User.current
            .validatePasscode(this.passcode)
            .then(this.unlock)
            .catch(this.handleError);
    }, 350);

    render() {
        return (
            <div className="passcode-lock">
                <p>{t('title_enterPasswordDetail')}</p>
                <Input
                    type="password"
                    value={this.passcode}
                    label={t('title_devicePassword')}
                    onChange={this.handleChange}
                    error={this.error}
                    autoFocus
                />
            </div>
        );
    }
}

export default PasscodeLock;
