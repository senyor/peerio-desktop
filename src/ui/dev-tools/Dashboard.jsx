const React = require('react');
const { Card, CardTitle, CardText, Input, Button } = require('~/react-toolbox');
const { User, socket } = require('peerio-icebear');
const config = require('~/config');
const { observable } = require('mobx');
const { observer } = require('mobx-react');

class DevToolsDashboard extends React.Component {
    render() {
        return (
            <div className="dashboard selectable">
                <Card style={{ width: '100%' }}>
                    <CardTitle title="Socket server" />
                    <CardText>
                        <ChangeServer />
                    </CardText>
                </Card>
                <Card style={{ width: '35%' }}>
                    <CardTitle title="Current user" />
                    <CardText>
                        <UserDetails />
                    </CardText>
                </Card>
                <Card style={{ width: '57%' }}>
                    <CardTitle title="Config" />
                    <CardText>
                        <pre className="selectable">{JSON.stringify(config, null, 2)}</pre>
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
        <span className="selectable">
            Username: <strong>{User.current.username}</strong><br />
            First name: <strong>{User.current.firstName}</strong><br />
            Last name: <strong>{User.current.lastName}</strong>
        </span>
    );
}

@observer
class ChangeServer extends React.Component {
    @observable server;
    onServerChange = v => {
        this.server = v;
    };
    changeServer = () => {
        socket.close();
        socket.socket.io.uri = this.server;
        socket.open();
        this.forceUpdate();
    };
    render() {
        if (User.current) {
            return <span>Can't change server after login, sign out first.</span>;
        }

        return (
            <span className="selectable">
                Current server: {socket.socket.io.uri}
                <Input type="text" value={this.server} onChange={this.onServerChange}
                    label="Server url" /><br />
                <Button label="Change and reconnect" raised primary onClick={this.changeServer} />
            </span>
        );
    }
}


module.exports = DevToolsDashboard;
