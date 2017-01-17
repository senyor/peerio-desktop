const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { Button, IconButton, Input } = require('~/react-toolbox');
const { User, contactStore } = require('~/icebear');

@observer class Profile extends React.Component {
    componentWillMount() {
        this.contact = contactStore.getContact(User.current.username);
    }

    render() {
        return (
            <section className="flex-row">
                <div>
                    <div className="input-row">
                        <Input type="text"
                               label="First name"
                               value={User.current.firstName} />
                        <Input type="text"
                               label="Last name"
                               value={User.current.lastName} />
                    </div>
                    <div className="input-row">
                        <Input type="email" label="Email" value={User.current.addresses} />
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
                        <Input type="tel" label="Phone" />
                    </div>
                    <Button label="update"
                            style={{ marginTop: '40px' }} primary raised />
                </div>
                <div className="avatar-card"
                    style={{ backgroundColor: this.contact.color }}>
                    <div className="avatar-card-user">
                        <div className="avatar-card-display-name">
                            {User.current.firstName} {User.current.lastName}
                        </div>
                        <div className="avatar-card-username">
                            {User.current.username}
                        </div>
                    </div>
                    {/* TODO: dynmaic inital */}
                    <div className="avatar-card-initial">B</div>
                    <div className="card-footer">
                        {/*
                          TODO: hide delete button when there is no avatar img
                        */}
                        <IconButton icon="delete" />
                        <IconButton icon="add_a_photo" />
                    </div>
                </div>
            </section>
        );
    }
}

module.exports = Profile;
