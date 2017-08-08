const React = require('react');
const { Component } = require('react');
const { observer } = require('mobx-react');
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
            <div className="flex-col profile">
                <div className="warning-line">
                    <div className="flex-col flex-justify-center" style={{ width: '275px' }}>
                        <T k="title_AKwarn1" className="display-1" style={{ whiteSpace: 'nowrap' }} />
                    </div>
                </div>
                <T k="title_AKwarn3" tag="p" />
                <div>
                    <T k="title_yourAccountKey" tag="p" />
                    <div className="passphrase selectable">{this.props.profileStore.passphrase}</div>
                </div>
                <T k="title_AKwarn4" tag="p" />
            </div>
        );
    }
}

module.exports = AccountKey;
