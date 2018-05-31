const React = require('react');
// const mobx = require('mobx');
const { observer } = require('mobx-react');

@observer
class PatientZeroChats extends React.Component {
    render() {
        return (
            <div className="patient-zero-chats">
                PatientZeroChats
            </div>
        );
    }
}

module.exports = PatientZeroChats;
