const React = require('react');
const { observable, when } = require('mobx');
const { observer } = require('mobx-react');
const { chatStore, Contact } = require('~/icebear');
const UserPicker = require('~/ui/shared-components/UserPicker');
const { t } = require('peerio-translator');
const T = require('~/ui/shared-components/T');
const FullCoverLoader = require('~/ui/shared-components/FullCoverLoader');

@observer
class NewChat extends React.Component {
    @observable waiting = false;
    @observable picker;

    componentDidMount() {
        chatStore.deactivateCurrentChat();
    }

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

    handleClose() {
        window.router.push('/app/chats');
    }

    gotoNewChannel() {
        window.router.push('/app/chats/new-channel');
    }

    setRef = (ref) => {
        this.picker = ref;
    }

    render() {
        const textParser = {
            toCreateRoom: text => <a className="clickable" onClick={this.gotoNewChannel}>{text}</a>
        };
        return (
            <div className="new-dm create-new-chat">
                <div className="user-picker-container">
                    <UserPicker
                        ref={this.setRef}
                        title={t('title_newDirectMessage')}
                        description={
                            <T k="title_newDirectMessageDescription">{textParser}</T>
                        }
                        limit={1}
                        onAccept={this.handleAccept}
                        onClose={this.handleClose} />
                </div>
                <FullCoverLoader show={this.waiting} />
            </div>
        );
    }
}


module.exports = NewChat;
