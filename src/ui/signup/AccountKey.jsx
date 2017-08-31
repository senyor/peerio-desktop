const React = require('react');
const { Component } = require('react');
const { observer } = require('mobx-react');
const { Button, FontIcon, IconButton } = require('~/react-toolbox');
const { t } = require('peerio-translator');
const T = require('~/ui/shared-components/T');


@observer class AccountKey extends Component {
    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.props.returnHandler();
        }
    };

    render() {
        return (
            <div className="flex-col">
                <div className="profile">
                    {/* FIXME: This should be switch for uploaded Avatar or First/Last Avatar */}
                    <div className="avatar-input">
                        <FontIcon value="add" />
                        <div className="avatar-instructions">
                            Add photo
                        </div>
                        <div className="caption">(optional)</div>
                    </div>
                    <p>Passwords are way stronger when computers make them. This Account Key was generated just for you. Beep boop.
                    </p>
                    <div className="account-key-wrapper">
                        <div className="label">Your Account Key</div>
                        <div className="flex-row flex-align-center">
                            <div className="account-key">4347 3836 2D7E 7038 <br />7321 692A 6F83 62DF</div>
                            <IconButton icon="content_copy" />
                        </div>
                    </div>
                    <p>Since Peerio cannot access any of your data, including this Account Key, saving a backup may help you in the future.
                    </p>
                    <Button label="save account key pdf" icon="file_download" raised />
                </div>
            </div>
        );
    }
}

module.exports = AccountKey;
