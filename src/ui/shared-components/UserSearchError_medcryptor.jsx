const React = require('react');
const { action, observable } = require('mobx');
const { observer } = require('mobx-react');

const T = require('~/ui/shared-components/T');
const { t } = require('peerio-translator');
const { Button, MaterialIcon, RadioButtons } = require('~/peer-ui');

const DOCTOR_OR_ADMIN = 'doctor_or_admin';
const PATIENT = 'patient';

@observer
class UserSearchError extends React.Component {
    options = [
        { value: DOCTOR_OR_ADMIN, label: t('title_inviteDoctorOrAdmin') },
        { value: PATIENT, label: t('title_invitePatient') }
    ];

    @observable selected = DOCTOR_OR_ADMIN;
    @action.bound onChange(value) {
        this.selected = value;
    }

    invite = () => {
        if (this.selected === DOCTOR_OR_ADMIN) {
            this.props.invite('medcryptor-doctor');
        } else {
            this.props.invite('medcryptor-patient');
        }
    }

    render() {
        return (
            <div className="user-search-error medcryptor">
                <div className="search-error-text">
                    <MaterialIcon icon="help_outline" />
                    {this.props.userAlreadyAdded
                        ? <T k="error_userAlreadyAdded" tag="div">{{ user: this.props.userAlreadyAdded }}</T>
                        : null
                    }
                    {this.props.userNotFound
                        ? <T k="error_userNotFoundTryEmail" tag="div">{{ user: this.props.userNotFound }}</T>
                        : null
                    }
                    {this.props.suggestInviteEmail
                        ? this.props.isChannel
                            ? <T k="error_emailNotFound">{{ email: this.props.suggestInviteEmail }}</T>
                            : <T k="title_inviteContactByEmailGeneric">{{ email: this.props.suggestInviteEmail }}</T>
                        : null
                    }
                </div>
                {this.props.suggestInviteEmail && !this.props.isChannel
                    ? <div className="radio-container">
                        <RadioButtons
                            value={this.selected}
                            onChange={this.onChange}
                            options={this.options}
                        />
                        <Button
                            onClick={this.invite}
                            label={t('button_sendInvite')}
                        />
                    </div>
                    : null
                }
            </div>
        );
    }
}

module.exports = UserSearchError;
