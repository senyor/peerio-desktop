const React = require('react');
const config = require('~/config');
const PatientListComponent = require('~/ui/whitelabel/medcryptor/PatientList');

class PatientList extends React.Component {
    render() {
        if (config.whiteLabel.name === 'medcryptor') {
            return <PatientListComponent />;
        }
        return <div />;
    }
}

module.exports = PatientList;
