// @ts-check

const React = require('react');
const { observer } = require('mobx-react');

const PatientSidebar = require('./PatientSidebar');

@observer
class Patient extends React.Component {
    render() {
        return (
            <div className="messages">
                <PatientSidebar />
                {this.props.children}
            </div>
        );
    }
}


module.exports = Patient;
