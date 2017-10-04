const React = require('react');
const { observable, action, when } = require('mobx');
const { observer } = require('mobx-react');
const { Button, IconButton, Input, FontIcon } = require('~/react-toolbox');
const T = require('~/ui/shared-components/T');
const { t } = require('peerio-translator');
const css = require('classnames');
const { contactStore, User } = require('~/icebear');
const urls = require('~/icebear').config.translator.urlMap;
const routerStore = require('~/stores/router-store');

@observer
class NewContact extends React.Component {
    @observable query = '';
    @observable notFound = false;
    @observable legacyContactError = false;
    @observable suggestInviteEmail = '';
    @observable waiting = false;
    @observable isInviteView = false;

    // same component is used for add and invite,
    // when on invited zero state view - we want to render it slightly different
    isInviteView = false;

    componentWillMount() {
        this.isInviteView = routerStore.currentRoute === routerStore.ROUTES.newInvite;
    }
    componentWillUpdate() {
        this.isInviteView = routerStore.currentRoute === routerStore.ROUTES.newInvite;
    }
    // Don't use onKeyUp - text change fires earlier
    handleKeyDown = e => {
        if (e.key === 'Enter' && this.query !== '') {
            if (this.isInviteView) this.invite();
            else this.tryAdd();
        }
    };

    @action.bound handleTextChange(newVal) {
        this.notFound = false;
        this.legacyContactError = false;
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
        this.legacyContactError = false;
        const c = contactStore.getContact(this.query);
        when(() => !c.loading, () => {
            if (c.notFound) {
                this.notFound = true;
                this.legacyContactError = c.isLegacy;
                const atInd = this.query.indexOf('@');
                const isEmail = atInd > -1 && atInd === this.query.lastIndexOf('@');
                if (isEmail) {
                    this.suggestInviteEmail = this.query;
                    this.query = '';
                }
            } else {
                this.query = '';
                contactStore.addContact(c);
            }
            this.waiting = false;
        });
    };

    invite = () => {
        contactStore.invite(this.isInviteView ? this.query : this.suggestInviteEmail);
        this.suggestInviteEmail = '';
        if (this.isInviteView) this.query = '';
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
            <div className="contacts new-contact">
                <div className="contacts-view create-new-chat user-picker">

                    <div className="invite-form">
                        {this.isInviteView ? <T k="title_contactZeroState" className="title" tag="div" /> : null}

                        <T k={this.isInviteView ? 'button_inviteEmailContact' : 'title_addAContact'}
                            className="display-1" tag="div" />

                        <div className="message-search-wrapper">
                            <div className="new-chat-search">
                                <FontIcon value="search" />
                                <div className="chip-wrapper">
                                    <Input innerRef={this.onInputMount}
                                        placeholder={t(this.isInviteView ? 'title_enterEmail' : 'title_userSearch')}
                                        value={this.query} onChange={this.handleTextChange}
                                        onKeyDown={this.handleKeyDown} />
                                </div>
                                <Button className={css('confirm',
                                    {
                                        hide: !this.query.length || this.waiting ||
                                        (this.isInviteView && this.query.indexOf('@') < 0)
                                    })}
                                label={t(this.isInviteView ? 'button_invite' : 'button_add')}
                                onClick={this.isInviteView ? this.invite : this.tryAdd} />
                            </div>
                            {this.notFound
                                ? <T k={this.legacyContactError ? 'title_inviteLegacy' : 'error_userNotFound'}
                                    tag="div" className="error-search" />
                                : null
                            }
                            {this.suggestInviteEmail ?
                                <div className="email-invite-container">
                                    <div className="email-invite">{this.suggestInviteEmail}</div>
                                    <Button primary onClick={this.invite} label={t('button_inviteEmailContact')} />
                                </div>
                                : null}
                        </div>
                        <div className="invite-elsewhere">
                            <T k="title_shareSocial" tag="strong" />
                            <div className="icons">
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
