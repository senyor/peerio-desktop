const React = require('react');
const { observable, action } = require('mobx');
const { observer } = require('mobx-react');
const { Button, IconButton, Input, FontIcon } = require('~/react-toolbox');
const T = require('~/ui/shared-components/T');
const { t } = require('peerio-translator');
const css = require('classnames');
const { contactStore, User } = require('~/icebear');
const urls = require('~/icebear').config.translator.urlMap;

@observer
class NewContact extends React.Component {
    @observable query = '';
    @observable notFound = false;
    @observable suggestInviteEmail = '';
    @observable waiting = false;

    // Don't use onKeyUp - text change fires earlier
    handleKeyDown = e => {
        if (e.key === 'Enter' && this.query !== '') this.tryAdd();
    };
    @action.bound handleTextChange(newVal) {
        this.notFound = false;
        this.query = newVal.toLocaleLowerCase().trim();
    }
    onInputMount(input) {
        if (!input) return;
        input.focus();
    }
    tryAdd = () => {
        if (this.waiting) return;
        this.waiting = true;
        this.suggestInviteEmail = '';
        this.notFound = false;
        contactStore.addContact(this.query)
            .then(found => {
                if (found) {
                    this.query = '';
                } else {
                    this.notFound = true;
                    const atInd = this.query.indexOf('@');
                    const isEmail = atInd > -1 && atInd === this.query.lastIndexOf('@');
                    if (isEmail) this.suggestInviteEmail = this.query;
                }
            })
            .finally(() => { this.waiting = false; });
    }
    invite = () => {
        contactStore.invite(this.suggestInviteEmail);
        this.suggestInviteEmail = '';
    };

    getFacebookUrl() {
        const link = encodeURIComponent(urls.socialShareUrl);
        const image = encodeURIComponent(urls.socialShareImage);
        const title = encodeURIComponent(t('title_socialShareInvite'));
        const content = encodeURIComponent(t('title_socialShareInviteContent', {
            socialShareUrl: urls.socialShareUrl,
            username: User.current.username
        }));
        const url = `https://www.facebook.com/dialog/feed?app_id=184683071273&link=${link}&picture=${image}`
            + `&name=${title}&caption=%20&description=${content}&redirect_uri=https%3A%2F%2Fwww.facebook.com`;
        return url;
    }

    getEmailUrl() {
        const title = encodeURIComponent(t('title_socialShareInvite'));
        const content = encodeURIComponent(t('title_socialShareInviteContent', {
            socialShareUrl: urls.socialShareUrl,
            username: User.current.username
        }));
        const url = `mailto:?subject=${title}&body=${content}`;
        return url;
    }
    getTwitterUrl() {
        const message = encodeURIComponent(t('title_socialShareInviteContent', {
            socialShareUrl: urls.socialShareUrl,
            username: User.current.username
        }));
        return `https://twitter.com/intent/tweet?text=${message}`;
    }
    render() {
        return (
            <div className="contacts">
                <div className="contacts-view flex-align-center flex-justify-center create-new-chat user-picker">
                    <div className="invite-form">
                        <T k="title_addAContact" className="display-1" tag="div" />

                        <div className="message-search-wrapper">
                            <div className="new-chat-search">
                                <FontIcon value="search" />
                                <div className="chip-wrapper">
                                    <Input innerRef={this.onInputMount} placeholder={t('title_userSearch')}
                                        value={this.query} onChange={this.handleTextChange}
                                        onKeyDown={this.handleKeyDown} />
                                </div>
                                <Button className={css('confirm', { hide: !this.query.length || this.waiting })}
                                    label={t('button_add')}
                                    onClick={this.tryAdd} />
                            </div>
                            {this.notFound ? <T k="error_userNotFound" tag="div" className="error-search" /> : null}
                            {this.suggestInviteEmail ?
                                <div className="flex-row flex-align-center flex-justify-between flex-shrink-0">
                                    <div className="email-invite">{this.suggestInviteEmail}</div>
                                    <Button primary onClick={this.invite} label={t('button_inviteEmailContact')} />
                                </div>
                                : null}
                        </div>
                        <div className="flex-row flex-align-center flex-justify-center">
                            <T k="title_shareSocial" tag="strong" />
                            <div className="flex-row flex-shrink-0" style={{ marginLeft: '32px' }} >
                                <IconButton icon="email" href={this.getEmailUrl()} />
                                <a className="twitter-share-button"
                                    href={this.getTwitterUrl()} data-size="large">
                                    <img src="./static/img/twitter.png" alt="twitter" />
                                </a>
                                <a className="facebook-share-button"
                                    href={this.getFacebookUrl()} data-size="large">
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

module.exports = NewContact;
