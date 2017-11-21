const React = require('react');
const T = require('~/ui/shared-components/T');
const { FontIcon } = require('~/react-toolbox');
const css = require('classnames');

class IdentityVerificationNotice extends React.Component {
    render() {
        return (
            <div className="identity-verification-notice">
                <div className={css('notice-container', { 'extra-margin': this.props.extraMargin })}>
                    <FontIcon className="notice-icon" value="security" />
                    <T className="text-content" k="title_verifyUserIdentity" />
                </div>
            </div>
        );
    }
}

module.exports = IdentityVerificationNotice;
