const React = require('react');

class MailSent extends React.Component {

    render() {
        return (
            <div className="compose-view">
                <div className="compose-meta sent">
                    <div className="subject">Sent meta data</div>
                    <div className="date">Saturday, September 3, 2016 at 7:39AM</div>
                    <div className="to">some@email.com</div>
                </div>
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

module.exports = MailSent;
