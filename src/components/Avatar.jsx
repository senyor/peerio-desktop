const React = require('react');
const { observer } = require('mobx-react');
const RTAvatar = require('react-toolbox').Avatar;

function Avatar(props) {
    return (
        <RTAvatar style={{ backgroundColor: props.contact.color }} title={props.contact.username} />
    );
}

module.exports = observer(Avatar);
