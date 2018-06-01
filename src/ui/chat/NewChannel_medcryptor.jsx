/*
    NOTE: this component encompasses the Medcryptor version of NewChannel view
    as well as new patient space, new patient room, and new internal room
*/

const React = require('react');
const { observable, when } = require('mobx');
const { observer } = require('mobx-react');
const { chatStore, config } = require('peerio-icebear');
const UserPicker = require('~/ui/shared-components/UserPicker');
const { t } = require('peerio-translator');
const T = require('~/ui/shared-components/T');
const { Input, ProgressBar } = require('peer-ui');
const ELEMENTS = require('~/whitelabel/elements');
const STRINGS = require('~/whitelabel/strings');

@observer
class NewChannel extends React.Component {
    @observable waiting = false;
    @observable channelName = '';
    @observable purpose = '';
    internalRoomName = t('mcr_title_general');
    patientRoomName = t('mcr_title_noParticipants');

    handleAccept = () => {
        this.waiting = true;

        // TODO:
        // this.createNewChannel();
        // this.createNewPatientSpace();
    };

    createNewChannel = async () => {
        const chat = await chatStore.startChat(this.userPicker.selected, true, this.channelName, this.purpose);
        if (!chat) {
            this.waiting = false;
            return;
        }
        when(() => chat.added === true, () => {
            window.router.push('/app/chats');
        });
    }

    createNewPatientSpace = async () => {
        const newSpace = {
            spaceId: null,
            spaceName: this.channelName,
            spaceDescription: ''
        };

        newSpace.spaceRoomType = 'internal';
        const internalRoom = await chatStore.startChat([], true, this.internalRoomName, '', true, newSpace);

        newSpace.spaceRoomType = 'patient';
        // const chat = await chatStore.startChat(this.userPicker.selected, true, this.spaceName, this.purpose);
        const patientRoom = await chatStore.startChat([], true, this.patientRoomName, '', true, newSpace);

        if (!internalRoom && patientRoom) {
            this.waiting = false;
            return;
        }

        when(() => internalRoom.added && patientRoom.added, () => {
            window.router.push('/app/patients');
        });
    }

    gotoNewChat() {
        window.router.push('/app/chats/new-chat');
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

    setNameInputRef = ref => {
        if (!ref) return;
        ref.focus();
    };

    render() {
        if (this.waiting) {
            return (<div className="new-channel create-new-chat">
                <div className="create-channel-loading"><ProgressBar type="circular" /></div>
            </div>);
        }
        return (
            <div className="new-channel create-new-chat">
                <div className="chat-creation-header">
                    <div className="title">
                        <T k={STRINGS.newChannel.title} tag="span" />
                    </div>
                    <div className="description">
                        {ELEMENTS.newChannel.description}
                    </div>
                </div>
                <div className="new-channel-inputs">
                    <div className="message-search-wrapper-new-channel message-search-wrapper">
                        <div className="new-chat-search">
                            <div className="chip-wrapper">
                                <Input placeholder={t(STRINGS.newChannel.channelName)} innerRef={this.setNameInputRef}
                                    value={this.channelName}
                                    onChange={this.handleNameChange}
                                    maxLength={config.chat.maxChatNameLength}
                                />
                            </div>
                        </div>
                        <div className="helper-text" />
                    </div>
                    <div className="message-search-wrapper-new-channel message-search-wrapper">
                        <div className="new-chat-search">
                            <div className="chip-wrapper">
                                <Input placeholder={t(STRINGS.newChannel.channelPurpose)}
                                    value={this.purpose}
                                    onChange={this.handlePurposeChange}
                                    maxLength={config.chat.maxChatPurposeLength}
                                />
                            </div>
                        </div>
                        <T k={STRINGS.newChannel.purposeHelper} tag="div" className="helper-text" />
                    </div>
                    <div className="user-picker-container">
                        <UserPicker ref={this.setUserPickerRef} title={t(STRINGS.newChannel.userPickerTitle)}
                            noHeader onlyPick noAutoFocus
                            onAccept={this.handleAccept}
                            noSubmit={!this.channelName.length}
                        />
                    </div>
                </div>
            </div>
        );
    }
}


module.exports = NewChannel;
