const React = require('react');
const { Button } = require('~/react-toolbox');
const { User, errors, warnings, legacyMigrator } = require('~/icebear');
const { observable, computed } = require('mobx');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const css = require('classnames');
const FullCoverLoader = require('~/ui/shared-components/FullCoverLoader');
const T = require('~/ui/shared-components/T');

@observer class Signup extends React.Component {

    render() {
        return (
            <div className="auto-sign-in rt-light-theme" >
                <div className="flex-align-center flex-col">
                    <img alt="peerio" className="logo" src="static/img/logo-white.png" />
                    <div className="display-2">Enable Automatic Sign-in?</div>
                    <div className="options">
                        <div className="option">
                            <Button label="enable" value="enable" className="primary" />
                            <p>
                                <em>Account Key</em> is never required to sign in. Sign out to disable.
                            </p>
                        </div>
                        <div className="option">
                            <Button label="disable" value="disable" />
                            <p>
                                <em>Account Key</em> is always required to sign in.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


module.exports = Signup;
