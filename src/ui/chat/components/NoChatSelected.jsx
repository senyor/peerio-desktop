const React = require('react');
const { when, observable } = require('mobx');
const { observer } = require('mobx-react');
const UserPicker = require('~/ui/shared-components/UserPicker');
const { chatStore, Contact } = require('peerio-icebear');
const FullCoverLoader = require('~/ui/shared-components/FullCoverLoader');
const T = require('~/ui/shared-components/T');

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
        if (chatStore.loading || chatStore.chats.length) return null;
        return (
            <div className="zero-message new-dm create-new-chat">
                <div className="zero-message-content">
                    <T k="title_zeroChat" className="zero-chat-header" tag="div" />
                    <T k="title_zeroChatInstructions" className="zero-chat-instructions" tag="div" />
                    <div className="user-picker-container">
                        <UserPicker limit={1} onAccept={this.handleAccept} />
                    </div>
                </div>
                <FullCoverLoader show={this.waiting} />
            </div>
        );
    }
}

module.exports = NoChatSelected;
