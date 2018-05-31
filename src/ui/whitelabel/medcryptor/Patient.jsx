// @ts-check

const React = require('react');
const { observer } = require('mobx-react');

const { chatStore } = require('peerio-icebear');
const PatientSidebar = require('./PatientSidebar');
const PatientZeroChats = require('./PatientZeroChats');

@observer
class Patient extends React.Component {
    render() {
        return (
            <div className="messages patient-space">
                <PatientSidebar />
                {!chatStore.loading && !chatStore.activeChat
                    ? <PatientZeroChats />
                    : null
                }
                {this.props.children}
            </div>
        );
    }
}


module.exports = Patient;
