const React = require('react');
const { observable, when } = require('mobx');
const { observer } = require('mobx-react');
const { chatStore, User } = require('~/icebear');
const UserPicker = require('~/ui/shared-components/UserPicker');
const { t } = require('peerio-translator');
const T = require('~/ui/shared-components/T');
const { ProgressBar, Button, Link } = require('~/react-toolbox');
const config = require('../../config');
const ChannelCreateOffer = require('./components/ChannelCreateOffer');

@observer
class NewChat extends React.Component {
    @observable waiting = false;
    @observable picker;

    handleChange = (selected) => {
        if (selected && selected.length) this.handleAccept(selected);
    }

    // TODO: SDK should be doing this
    waitForLoad(contacts) {
        return Promise.all(contacts.map(
            c => new Promise(resolve => when(() => !c.loading, resolve))
        ));
    }

    handleAccept = async(selected) => {
        this.waiting = true;
        // don't start chats if user types quickly non-existent username
        // should be on SDK level
        await this.waitForLoad(selected);
        if (!selected.length || selected.filter(c => c.notFound).length) {
            this.waiting = false;
            return;
        }
        console.log(JSON.stringify(selected));
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

    pickerStyle = { height: 'auto', width: '100%' };

    render() {
        if (this.waiting) {
            return (<div className="create-new-chat">
                <div className="user-picker flex-justify-center"><ProgressBar type="circular" /></div>
            </div>);
        }

        return (
            <div className="create-new-chat">
                <div style={this.pickerStyle}>
                    <UserPicker
                        ref={this.setRef}
                        title={t('title_chatWith')}
                        onChange={this.handleChange}
                        onAccept={this.handleAccept}
                        onClose={this.handleClose} />
                </div>
            </div>
        );
    }
}


module.exports = NewChat;
