const React = require('react');
const { observer } = require('mobx-react');

const ChatView = require('~/ui/chat/ChatView');

@observer
class PatientView extends React.Component {
    render() {
        return (
            <div>
                <ChatView />
            </div>
        );
    }
}

module.exports = PatientView;
