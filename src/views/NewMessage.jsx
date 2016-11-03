const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { Button, Chip, Input, List, ListItem } = require('react-toolbox');

@observer
class NewMessage extends React.Component {
    render() {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100vw', height: '100vh' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '600px', marginTop: '168px' }} >
                    <div className="new-message-search"><Chip deletable>user name</Chip>
                        <Input /> <Button className="confirm" label="Go" />
                    </div>
                    <List>
                        <ListItem
                            avatar="https://placeimg.com/80/80/animals"
                            caption="User name"
                            legend="some text about the user" />
                    </List>
                </div>
            </div>
        );
    }
}

module.exports = NewMessage;
