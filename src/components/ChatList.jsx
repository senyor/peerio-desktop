const React = require('react');
const { t } = require('peerio-translator');
const { List, ListItem, ListSubHeader } = require('react-toolbox');

class ChatList extends React.Component {
    render() {
        return (
            <div className="message-list">
                <List selectable ripple>
                    <ListSubHeader caption={t('directMessages')} />
                    <ListItem caption="Alice" className="online active" leftIcon="fiber_manual_record" />
                    <ListItem caption="Albert" leftIcon="fiber_manual_record" />
                    <ListItem caption="Bill" className="online" leftIcon="fiber_manual_record"
                                rightIcon={<div className="notification">12</div>} />
                    <ListItem caption="Jeff" className="online" leftIcon="fiber_manual_record" />
                    <ListItem caption="Steve" className="busy" leftIcon="fiber_manual_record" />
                </List>
            </div>
        );
    }
}

module.exports = ChatList;
