const React = require('react');
const { action, computed, observable, reaction } = require('mobx');
const { observer } = require('mobx-react');

const ChatView = require('~/ui/chat/ChatView');

@observer
class PatientView extends React.Component {
    render() {
        return (
            <div>
                TEST
                <ChatView />
            </div>
        );
    }
}

module.exports = PatientView;
