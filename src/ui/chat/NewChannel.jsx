const React = require('react');
const { observable, when } = require('mobx');
const { observer } = require('mobx-react');
const { chatStore } = require('~/icebear');
const UserPicker = require('~/ui/shared-components/UserPicker');
const { t } = require('peerio-translator');
const T = require('~/ui/shared-components/T');
const { ProgressBar, Button, Input } = require('~/react-toolbox');
const css = require('classnames');

@observer
class NewChannel extends React.Component {
    @observable waiting = false;
    @observable channelName = '';
    @observable purpose = '';

    handleAccept = () => {
        this.waiting = true;
        const chat = chatStore.startChat(this.userPicker.selected, true, this.channelName, this.purpose);

        when(() => chat.added === true, () => {
            window.router.push('/app/chats');
        });
    };

    handleClose = () => {
        window.router.push('/app/chats');
    };

    gotoNewChat() {
        window.router.push('/app/new-chat');
    }

    handleNameChange = val => {
        this.channelName = val;
    }

    handlePurposeChange = val => {
        this.purpose = val;
    }

    setUserPickerRef = ref => {
        this.userPicker = ref;
    };

    render() {
        if (this.waiting) {
            return (<div className="create-new-chat">
                <div className="user-picker flex-justify-center"><ProgressBar type="circular" /></div>
            </div>);
        }
        return (
            <div className="create-new-chat">
                <T k="title_createChannel" tag="h1" />
                <T k="title_createChannelDetails" tag="div" />
                <div className="new-chat-search">
                    <div className="chip-wrapper">
                        <Input placeholder={t('title_channelName')}
                            value={this.channelName} onChange={this.handleNameChange} />
                    </div>
                    <Button className={css('confirm', { banish: !this.channelName.length })}
                        label={t('button_go')}
                        onClick={this.handleAccept} />
                </div>
                <div className="new-chat-search">
                    <div className="chip-wrapper">
                        <Input placeholder={t('title_channelPurpose')}
                            value={this.purpose} onChange={this.handlePurposeChange} />
                    </div>
                </div>
                <UserPicker ref={this.setUserPickerRef} title={t('title_chatWith')} noHeader onlyPick />
                <div className="chat-channel-switch">
                    <T k="title_goCreateChat" />
                    <Button label={t('button_createChat')} flat primary onClick={this.gotoNewChat} />
                </div>
            </div>
        );
    }
}


module.exports = NewChannel;
