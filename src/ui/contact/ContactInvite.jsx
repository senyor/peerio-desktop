const React = require('react');
const { observable, computed } = require('mobx');
const { observer } = require('mobx-react');
const { Button, IconButton, Input, TooltipIconButton } = require('~/react-toolbox');
const ContactGroups = require('./ContactGroups');

@observer
class ContactInvite extends React.Component {
    render() {
        return (
            <div className="contacts">
                <ContactGroups />
                <div className="contacts-view flex-align-center flex-justify-center">
                    <div className="invite-form">
                        <div className="display-1">Invite a contact or 5</div>
                        <Input label="Contact email(s)"
                               type="text" />
                        <div className="helper-text">Invite multiple contacts by separating their emails with commas.</div>
                        <Input type="text" />
                        <div className="invite-form-actions">
                            <Button primary flat label="button_sendInvite" />
                        </div>
                        <div className="flex-col">
                            <div className="title">Share on social</div>
                            <div className="flex-row flex-align-center">
                                link goes here <IconButton icon="content_copy" /><IconButton icon="email" />
                                <a className="twitter-share-button"
                                   href="https://twitter.com/intent/tweet?text=Hello%20world" data-size="large">
                                    <img src="./static/img/twitter.png" alt="twitter" />
                                </a>
                                <a className="facebook-share-button"
                                   href="https://twitter.com/intent/tweet?text=Hello%20world" data-size="large">
                                    <img src="./static/img/facebook.png" alt="twitter" />
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}

module.exports = ContactInvite;
