const React = require('react');
const { observable, when } = require('mobx');
const { observer } = require('mobx-react');
const { chatStore, User } = require('~/icebear');
const UserPicker = require('~/ui/shared-components/UserPicker');
const { t } = require('peerio-translator');
const T = require('~/ui/shared-components/T');
const { ProgressBar, Button, Input, IconButton } = require('~/react-toolbox');
const css = require('classnames');
const ChannelUpgradeDialog = require('./components/ChannelUpgradeDialog');
const config = require('~/config');

@observer
class NewChannel extends React.Component {
    @observable waiting = false;
    @observable channelName = '';
    @observable purpose = '';

    componentDidMount() {
        if (this.isLimitReached) this.upgradeDialog.show();
    }

    get isLimitReached() {
        return User.current.channelsLeft === 0;
    }

    handleAccept = () => {
        this.waiting = true;
        const chat = chatStore.startChat(this.userPicker.selected, true, this.channelName, this.purpose);
        if (!chat) {
            this.waiting = false;
            return;
        }
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

    setUpgradeDialogRef = ref => {
        this.upgradeDialog = ref;
    };

    render() {
        if (this.waiting) {
            return (<div className="new-channel create-new-chat">
                <div className="user-picker"><ProgressBar type="circular" /></div>
            </div>);
        }
        const detailsKey = config.disablePayments || User.current.hasActivePlans
            ? 'title_createChannelDetails_noPayments' : 'title_createChannelDetails';
        return (
            <div className="new-channel create-new-chat">
                <div className="chat-creation-header">
                    <div className="title">
                        <T k="title_createChannel" tag="span" />
                    </div>
                    <IconButton icon="close" onClick={this.handleClose} />
                </div>
                <T k={detailsKey} tag="div" className="create-room-info" />
                <div className="new-chat-search">
                    <div className="chip-wrapper">
                        <Input placeholder={t('title_channelName')}
                            value={this.channelName} onChange={this.handleNameChange} />
                    </div>
                    {<Button className={css('confirm', {
                        banish: !this.channelName.length
                        || !this.upgradeDialog
                        || !this.userPicker.isValid
                        || !this.userPicker.queryIsEmpty
                    })} label={t('button_go')} onClick={this.handleAccept} />}
                </div>
                <div className="new-chat-search">
                    <div className="chip-wrapper">
                        <Input placeholder={t('title_channelPurpose')}
                            value={this.purpose} onChange={this.handlePurposeChange} />
                    </div>
                </div>
                <UserPicker ref={this.setUserPickerRef} title={t('title_chatWith')} noHeader onlyPick noInvite />
                <ChannelUpgradeDialog ref={this.setUpgradeDialogRef} />
            </div>
        );
    }
}


module.exports = NewChannel;
