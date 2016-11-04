const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { Button, Chip, Input, List, ListItem, ListSubHeader } = require('react-toolbox');

@observer
class NewMessage extends React.Component {
    render() {
        return (
            <div className="create-new-message">
                {/* TODO create class */}
                <div className="flex-col"
                    style={{
                        alignItems: 'center',
                        width: '600px',
                        marginTop: '168px' }}>
                    <div className="new-message-search"><Chip deletable>user name</Chip>
                        <Input /> <Button className="confirm" label="Go" />
                    </div>
                    <List selectable ripple >
                        <ListSubHeader caption="Your contacts" />
                        <ListItem
                            avatar="https://placeimg.com/80/80/animals"
                            caption="User name"
                            legend="some text about the user" />
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
