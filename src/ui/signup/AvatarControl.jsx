const React = require('react');
const { Component } = require('react');
const { FontIcon } = require('~/react-toolbox');
const { observer } = require('mobx-react');
const AvatarDialog = require('./AvatarDialog');
const { t } = require('peerio-translator');

@observer class AvatarControl extends Component {
    render() {
        // TODO: move to stylesheet
        const s = {
            overflow: 'hidden'
        };
        const { url } = this.props;
        return (
            <div className="avatar-input" style={s} onClick={AvatarDialog.showDialog}>
                <FontIcon value="add" />
                <div className="avatar-instructions">
                    Add photo
                </div>
                {url && <img src={url} style={{ width: '128px', height: '128px' }} alt="avatar" />}
                <div className="caption">(optional)</div>
            </div>
        );
    }
}

module.exports = AvatarControl;
