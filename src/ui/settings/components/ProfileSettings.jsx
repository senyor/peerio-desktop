const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { Button, Input } = require('~/react-toolbox');
const { User } = require('~/icebear');

@observer class Profile extends React.Component {

    render() {
        return (
            <section className="flex-row">
                <div>
                    <div className="input-row">
                        <span className="dark-label">Username</span> <br />
                        {User.current.username}
                    </div>

                    <div className="input-row">
                        <Input type="text" label="First name" value={User.current.firstName} />
                        <Input type="text" label="Last name" value={User.current.lastName} />
                    </div>
                    <div className="input-row">
                        <Input type="email" label="Email" value={User.current.mail} />
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
                    <Button label="update" primary raised />
                </div>
                <div>
                    avatar and avatar uploading stuff goes here
                </div>
            </section>
        );
    }
}

module.exports = Profile;
