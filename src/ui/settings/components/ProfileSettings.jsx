const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { Button, IconButton, Input } = require('~/react-toolbox');
const { User, contactStore } = require('~/icebear');
const { t } = require('peerio-translator');
const css = require('classnames');

@observer class Profile extends React.Component {
    // @observable avatarImage = 'url(http://placekitten.com/512/512)';
    @observable inital = User.current.firstName.slice(0, 1);

    componentWillMount() {
        this.contact = contactStore.getContact(User.current.username);
    }

    // handleDeleteAvatar = () => {
    //     this.avatarImage = '';
    // }
    //
    // handleAddAvatar = () => {
    //   this.avatarImage = 'url(http://placekitten.com/512/512)';
    // }

    render() {
        return (
            <section className="flex-row">
                <div>
                    <div className="input-row">
                        <Input type="text"
                               label={t('firstName')}
                               value={User.current.firstName} />
                        <Input type="text"
                               label={t('lastName')}
                               value={User.current.lastName} />
                    </div>
                    <div className="input-row">
                        <Input type="email" label={t('email')} value={User.current.addresses} />
                    </div>
                    <div className="input-row">
                        {/*
                            This will probably be a custom input.
                            The current plan  for phone numbers is that when the
                            user clicks the country code are it will open a
                            dropdown. The input is designed to look like one
                            single solitary individual all alone by itself with
                            nothing else...input.
                        */}
                        {/* TODO: INPUT MASK FOR THE PRETTIEST PHONE NUMBERS */}
                        <Input type="tel" label={t('phone')} />
                    </div>
                    <Button label={t('button_update')}
                            style={{ marginTop: '40px' }} primary raised />
                </div>
                <div className="avatar-card"
                    style={{
                        backgroundColor: this.contact.color
                        // backgroundImage: this.avatarImage
                    }}>
                    <div className="avatar-card-user">
                        <div className="avatar-card-display-name">
                            {User.current.firstName} {User.current.lastName}
                        </div>
                        <div className="avatar-card-username">
                            {User.current.username}
                        </div>
                    </div>
                    <div className="avatar-card-initial">
                        {/* {this.avatarImage ? '' : this.inital} */}
                        {this.inital}
                    </div>
                    <div className="card-footer">
                        {/* <IconButton icon="delete"
                                    className={css({ banish: !this.avatarImage })}
                                    onClick={this.handleDeleteAvatar} />
                        <IconButton icon="add_a_photo"
                                    onClick={this.handleAddAvatar} /> */}
                    </div>
                </div>
            </section>
        );
    }
}
module.exports = Profile;
