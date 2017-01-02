const React = require('react');
const { Card, CardTitle, CardText } = require('react-toolbox');
const { User } = require('~/icebear');
const config = require('~/config');

class DevToolsDashboard extends React.Component {
    render() {
        return (
            <div className="dashboard">
                <Card style={{ width: '400px' }}>
                    <CardTitle title="Current user" />
                    <CardText>
                        <UserDetails />
                    </CardText>
                </Card>
                <Card>
                    <CardTitle title="Config" />
                    <CardText>
                        <pre>{JSON.stringify(config, null, 2)}</pre>
                    </CardText>
                </Card>
            </div>
        );
    }

}

function UserDetails() {
    if (!User.current) {
        return <span>Not authenticated.</span>;
    }
    return (
        <span>
            Username: <strong>{User.current.username}</strong><br />
            First name: <strong>{User.current.firstName}</strong><br />
            Last name: <strong>{User.current.lastName}</strong>
        </span>
    );
}


module.exports = DevToolsDashboard;
