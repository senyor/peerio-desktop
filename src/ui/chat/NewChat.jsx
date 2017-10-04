const React = require('react');
const { observable, when } = require('mobx');
const { observer } = require('mobx-react');
const { chatStore, Contact } = require('~/icebear');
const UserPicker = require('~/ui/shared-components/UserPicker');
const { t } = require('peerio-translator');
const FullCoverLoader = require('~/ui/shared-components/FullCoverLoader');

@observer
class NewChat extends React.Component {
    @observable waiting = false;
    @observable picker;

    handleChange = (selected) => {
        if (selected && selected.length) this.handleAccept(selected);
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
        window.router.push('/app/new-channel');
    }

    setRef = (ref) => {
        this.picker = ref;
    }

    render() {
        return (
            <div className="create-new-chat new-dm">
                <div className="userpicker-container">
                    <UserPicker
                        ref={this.setRef}
                        title={t('title_chatWith')}
                        onChange={this.handleChange}
                        onAccept={this.handleAccept}
                        onClose={this.handleClose} />
                </div>
                <FullCoverLoader show={this.waiting} />
            </div>
        );
    }
}


module.exports = NewChat;
