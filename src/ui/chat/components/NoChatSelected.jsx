const React = require('react');
const { t } = require('peerio-translator');
const UserPicker = require('~/ui/shared-components/UserPicker');

function NoChatSelected() {
    return (
        <div className="zero-message">
            <div className="content">
                <h2 className="display-2">No contacts? <strong>No problem!</strong></h2>
                <div className="title">Enter a contacts email or user name to get started</div>
                <UserPicker />
            </div>
        </div>
    );
}

module.exports = NoChatSelected;
