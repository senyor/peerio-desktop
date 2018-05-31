const React = require('react');
const { observable, when } = require('mobx');
const { observer } = require('mobx-react');
const { config, User } = require('peerio-icebear');
const UserPicker = require('~/ui/shared-components/UserPicker');
const { t } = require('peerio-translator');
const T = require('~/ui/shared-components/T');
const { Input, ProgressBar } = require('peer-ui');
const { chatStore } = require('peerio-icebear');

@observer
class NewPatient extends React.Component {
    @observable waiting = false;
    @observable spaceName = '';
    internalRoomName = 'general';
    patientRoomName = 'No participants';

    componentDidMount() {
        if (this.isLimitReached) this.upgradeDialog.show();
    }

    get isLimitReached() {
        return User.current.channelsLeft === 0;
    }

    handleAccept = async () => {
        this.waiting = true;

        const newSpace = {
            spaceId: null,
            spaceName: this.spaceName,
            spaceDescription: ''
        };

        newSpace.spaceRoomType = 'internal';
        const internalRoom = await chatStore.startChat([], true, this.internalRoomName, '', true, newSpace);

        newSpace.spaceRoomType = 'patient';
        // const chat = await chatStore.startChat(this.userPicker.selected, true, this.spaceName, this.purpose);
        const patientRoom = await chatStore.startChat([], true, this.patientRoomName, '', true, newSpace);

        if (!internalRoom && !patientRoom) {
            this.waiting = false;
            return;
        }

        when(() => internalRoom.added && patientRoom.added, () => {
            window.router.push('/app/chats'); //  should go to patient space zero screen
        });
    };

    gotoNewChannel() {
        window.router.push('/app/chats/new-channel');
    }

    handleNameChange = val => {
        this.spaceName = val;
    }

    setUserPickerRef = ref => {
        this.userPicker = ref;
    };

    setNameInputRef = ref => {
        if (!ref) return;
        ref.focus();
    };

    render() {
        const textParser = {
            toCreateRoom: text => (
                <a className="clickable" onClick={this.gotoNewChannel}>{text}</a>
            )
        };

        if (this.waiting) {
            return (<div className="new-channel create-new-chat">
                <div className="create-channel-loading"><ProgressBar type="circular" /></div>
            </div>);
        }
        return (
            <div className="new-patient new-channel create-new-chat">
                <div className="chat-creation-header">
                    <div className="title">
                        <T k="mcr_button_addPatient" tag="span" />
                    </div>
                    <div className="description">
                        <T k="mcr_title_newPatientDescription">{textParser}</T>
                    </div>
                </div>
                <div className="new-channel-inputs">
                    <div className="message-search-wrapper-new-channel message-search-wrapper">
                        <div className="new-chat-search">
                            <div className="chip-wrapper">
                                <Input placeholder={t('mcr_title_newPatientRecord')} innerRef={this.setNameInputRef}
                                    value={this.spaceName}
                                    onChange={this.handleNameChange}
                                    maxLength={config.chat.maxChatNameLength}
                                />
                            </div>
                        </div>
                        <T k="mcr_title_newPatientRecordHint" tag="div" className="helper-text" />
                    </div>
                    <div className="user-picker-container">
                        <UserPicker ref={this.setUserPickerRef} title={t('title_chatWith')}
                            noHeader onlyPick noAutoFocus
                            onAccept={this.handleAccept}
                            noSubmit={!this.spaceName.length}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = NewPatient;
