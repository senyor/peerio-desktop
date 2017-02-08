const React = require('react');
const { observer } = require('mobx-react');
const RTAvatar = require('~/react-toolbox').Avatar;
const { contactStore } = require('~/icebear');
const { t } = require('peerio-translator');

@observer
class ContactProfile extends React.Component {

    render() {
        const c = contactStore.getContact(this.props.username);
        if (c.loading) return null; // todo: spinner
        const f = c.fingerprint.split('-');
        return (
            <div>
                <h1>{t('profile')}</h1>
                <RTAvatar style={{ backgroundColor: c.color }} title={c.username} />
                {c.firstName} {c.lastName} <br /><br />
                {f[0]} {f[1]} {f[2]} <br />
                {f[3]} {f[4]} {f[5]}
            </div>
        );
    }
}


module.exports = ContactProfile;
