const React = require('react');
const { observable, when } = require('mobx');
const { observer } = require('mobx-react');
const { chatStore, config, User } = require('peerio-icebear');
const UserPicker = require('~/ui/shared-components/UserPicker');
const { t } = require('peerio-translator');
const T = require('~/ui/shared-components/T');
const { Input, ProgressBar } = require('peer-ui');

@observer
class NewPatient extends React.Component {
    @observable waiting = false;
    @observable spaceName = '';

    componentDidMount() {
        if (this.isLimitReached) this.upgradeDialog.show();
    }

    get isLimitReached() {
        return User.current.channelsLeft === 0;
    }

    handleAccept = async () => {
        this.waiting = true;
        console.log('handleAccept()');

        // // From NewChannel.jsx
        // const chat = await chatStore.startChat(this.userPicker.selected, true, this.spaceName, this.purpose);
        // if (!chat) {
        //     this.waiting = false;
        //     return;
        // }
        // when(() => chat.added === true, () => {
        //     window.router.push('/app/chats');
        // });
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
