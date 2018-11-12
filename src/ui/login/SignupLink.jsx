import { login } from '~/telemetry';
const React = require('react');
const { Link } = require('react-router');
const T = require('~/ui/shared-components/T').default;
const { t } = require('peerio-icebear');
const { observer } = require('mobx-react');

@observer
class SignupLink extends React.Component {
    render() {
        return (
            <div className="signup-link">
                <T k="title_newToApp">{{ appName: t('title_appName') }}</T>&nbsp;
                <Link onClick={login.navToCreateAccount} to="/signup">
                    {t('button_CreateAccount')}
                </Link>
            </div>
        );
    }
}

module.exports = SignupLink;
