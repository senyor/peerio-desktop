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
            <div className="contact-profile">
                { c.tofuError ? <div className="contact-error">{t('error_contactFingerprintChangedDetail')}</div>
                    : null}
                <div className="row flex-row flex-align-center">
                    <RTAvatar style={{ backgroundColor: c.color }} title={c.username} />
                    <div style={{ marginLeft: '8px' }}>{c.firstName} {c.lastName}</div>
                </div>
                <div className="row">
                    <div className="list-title" style={{ marginBottom: '8px' }}> {t('title_publicKey')}</div>
                    <div className="monospace">{f[0]} {f[1]} {f[2]}</div>
                    <div className="monospace">{f[3]} {f[4]} {f[5]}</div>
                </div>
            </div>
        );
    }
}


module.exports = ContactProfile;
