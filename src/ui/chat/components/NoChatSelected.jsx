const React = require('react');
const { when, observable } = require('mobx');
const { observer } = require('mobx-react');
const UserPicker = require('~/ui/shared-components/UserPicker');
const { chatStore, Contact } = require('~/icebear');
const FullCoverLoader = require('~/ui/shared-components/FullCoverLoader');

@observer
class NoChatSelected extends React.Component {
    @observable waiting;

    handleAccept = async (selected) => {
        this.waiting = true;
        await Contact.ensureAllLoaded(selected);
        if (!selected.length || selected.filter(c => c.notFound).length) {
            this.waiting = false;
            return;
        }
        const chat = chatStore.startChat(selected);
        if (!chat) {
            this.waiting = false;
            return;
        }
        when(() => chat.added === true, () => {
            window.router.push('/app/chats');
        });
    };

    render() {
        if (chatStore.loading) return null;
        return (
            <div className="zero-message new-dm create-new-chat">
                <div style={{
                    marginTop: '168px',
                    maxWidth: '600px'
                }} >
                    <h2 className="display-2">No chats? <strong>No problem!</strong></h2>
                    <div className="title">Enter a contacts email or user name to get started</div>
                    <div className="userpicker-container">
                        <UserPicker limit={1} onAccept={this.handleAccept} />
                    </div>
                </div>
                <FullCoverLoader show={this.waiting} />
            </div>
        );
    }
}

module.exports = NoChatSelected;
