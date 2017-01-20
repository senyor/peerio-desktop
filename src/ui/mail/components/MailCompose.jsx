const React = require('react');
const { Button } = require('react-toolbox');
const MailFormatActions = require('./MailFormatActions');
const { t } = require('peerio-translator');

class MailCompose extends React.Component {

    render() {
        return (
            <div className="compose-view">
                <div className="compose-meta flex-row">
                    <div className="dark-label flex-col">
                        <div className="meta-input">To</div>
                        <div className="meta-input">Subject</div>
                    </div>
                    <div className="flex-grow-1">
                        <div className="meta-input">
                            {/*
                              TODO: Grab the input from new messages.
                              The behaviour should be the same.
                            */}
                            <div className="flex-grow-1">andemail@adomain.com</div>
                            <Button label={t('send')} primary />
                        </div>
                        <div className="meta-input"> Some suject info.</div>
                    </div>
                </div>
                <MailFormatActions />
                <div className="mail-content">
                    <p>Hey  Alice,</p>
                    <p>Business cards represent not only your business,
                       but it also tells people your professionalism in
                       the industry. In the business world today, the
                       usage of business cards is far beyond just informing
                       people who you are, it serves as one of the most
                       cost-effective marketing and advertising tool for promoting
                       your business. When you distribute business cards,
                       you certainly want to leave a lasting impression and to be
                       remembered by your business contacts. By having a good
                       business card design, it definitely helps you to
                       distinguish your level of professionalism from the rest of
                       the competitors. Of course, a fantastic business card
                       design does not promise you instant success, but it’ll
                       definitely help you to speed up the process. Thereby,
                       choosing the right business card design is important and
                       requires careful considerations so that it will not look
                       cheap and may tarnish your reputation in this highly
                       competitive business world today. Here are some pointers to
                       help you create an effective business card design:
                    </p>
                </div>
            </div>
        );
    }
}

module.exports = MailCompose;
