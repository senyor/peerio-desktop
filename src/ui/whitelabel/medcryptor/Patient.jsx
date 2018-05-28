// @ts-check

const React = require('react');
const { observer } = require('mobx-react');

@observer
class Patient extends React.Component {
    render() {
        return (
            <div className="messages">
                {this.props.children}
            </div>
        );
    }
}


module.exports = Patient;
