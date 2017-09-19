const React = require('react');
const { observable, computed, when } = require('mobx');
const { observer } = require('mobx-react');
const { Button, Chip, FontIcon, IconButton, Input, List,
    ListItem, ListSubHeader, ProgressBar } = require('~/react-toolbox');
const { t } = require('peerio-translator');
const { fileStore, contactStore, User } = require('~/icebear');
const css = require('classnames');
const Avatar = require('~/ui/shared-components/Avatar');
const T = require('~/ui/shared-components/T');
const { getAttributeInParentChain } = require('~/helpers/dom');

@observer
class UserPicker extends React.Component {
    @observable selected = [];
    @observable query = '';
    @observable noGood = false;
    accepted = false;
    @observable suggestInviteEmail = '';
    @observable showNotFoundError;
    legacyContactError = false; // not observable bcs changes only with showNotFoundError

    componentDidMount() {
        if (this.props.onChange) {
            this.selected.observe(() => this.props.onChange(this.selected));
        }
    }

    @computed get options() {
        const ret = contactStore.filter(this.query).filter(this.filterOptions);
        for (let i = 0; i < ret.length; i++) {
            if (!ret[i].isAdded) {
                if (i === 0 || i === (ret.length - 1)) break;
                ret.splice(i, 0, true); // separator
                break;
            }
        }
        return ret;
    }

    @computed get isValid() {
        return !this.selected.find(s => s.loading || s.notFound) && !this.isLimitReached;
    }

    @computed get selectedSelfless() {
        return this.selected.filter(this.selfFilter);
    }

    filterOptions = (item) => {
        if (this.selected.find(s => s.username === item.username)) return false;
        if (this.props.noDeleted && item.isDeleted) return false;
        if (item.isMe) return false;
        if (this.isExcluded(item)) return false;

        return true;
    }

    isExcluded(contact) {
        if (this.props.exceptContacts && this.props.exceptContacts.includes(contact)) return true;
        return false;
    }

    selfFilter(contact) {
        return contact.username !== User.current.username;
    }

    handleTextChange = newVal => {
        const newValLower = newVal.toLocaleLowerCase();
        if (newValLower.length > 1 && ', '.includes(newValLower[newValLower.length - 1])) {
            this.query = newValLower.substr(0, newValLower.length - 1).trim();
            this.tryAcceptUsername();
            return;
        }
        this.query = newValLower.trim();
    };

    // Don't use onKeyPress it won't catch backspace
    // Don't use onKeyUp - text change fires earlier
    handleKeyDown = e => {
        if (e.key === 'Enter' && this.query !== '') this.tryAcceptUsername();
        if (e.key === 'Backspace' && this.query === '' && this.selected.length > 0) {
            this.selected.remove(this.selected[this.selected.length - 1]);
        }
    };

    tryAcceptUsername() {
        this.legacyContactError = false;
        this.showNotFoundError = false;
        if (this.selected.find(s => s.username === this.query)) {
            return;
        }
        const q = this.query;
        const c = contactStore.getContact(q);
        if (this.isExcluded(c)) {
            this.query = '';
            return;
        }
        const atInd = q.indexOf('@');
        const isEmail = atInd > -1 && atInd === q.lastIndexOf('@');
        this.selected.push(c);
        when(() => !c.loading, () => {
            setTimeout(() => {
                if (c.notFound) this.selected.remove(c);
            }, 1000);
            this.suggestInviteEmail = (c.notFound && isEmail && !this.props.noInvite) ? q : '';
            this.legacyContactError = c.isLegacy;
            this.showNotFoundError = c.notFound;
        });
        this.query = '';
    }


    accept = () => {
        if (this.props.onlyPick || this.accepted || !this.isValid) return;
        this.accepted = true;
        this.selected.forEach(s => {
            if (s.notFound) this.selected.remove(s);
        });
        this.props.onAccept(this.selected);
    };

    handleClose = () => {
        this.props.onClose();
    };

    onInputMount(input) {
        if (!input) return;
        input.focus();
    }

    onContactClick = (ev) => {
        const username = getAttributeInParentChain(ev.target, 'data-id');
        // avoiding incorrect setState bcs of computed options
        setTimeout(() => {
            this.selected.push(contactStore.getContact(username));
            this.query = '';
        });
    };

    invite = () => {
        contactStore.invite(this.suggestInviteEmail);
        this.suggestInviteEmail = '';
    }

    get isLimitReached() {
        return this.props.limit && this.selectedSelfless.length >= this.props.limit;
    }

    render() {
        return (
            <div className="user-picker">
                <div className={css('selected-items', { banish: !this.props.sharing })} >
                    <List>
                        <ListSubHeader key="header" caption={t('title_selectedFiles')} />
                        {
                            fileStore.getSelectedFiles().map(f => (<ListItem
                                key={f.id}
                                leftIcon="insert_drive_file"
                                caption={f.name}
                                rightIcon="remove_circle_outline" />))
                        }

                    </List>
                </div>
                <div className="inputs-container">
                    <div className="inputs-container-inner">
                        {this.props.noHeader
                            ? null
                            : <div className="chat-creation-header">
                                <div className="title">
                                    {this.props.title}
                                    {this.props.subtitle ? <span>{this.props.subtitle}</span> : ''}
                                </div>
                                <IconButton icon="close" onClick={this.handleClose} />
                            </div>
                        }
                        <div className="message-search-wrapper">
                            <div className="new-chat-search">
                                <FontIcon value="search" />
                                <div className="chip-wrapper">
                                    {this.selected.map(c =>
                                        (<Chip key={c.username}
                                            className={css('chip-label', { 'not-found': c.notFound })}
                                            onDeleteClick={() => this.selected.remove(c)} deletable>
                                            {c.loading
                                                ? <ProgressBar type="linear" mode="indeterminate" />
                                                : c.username}
                                        </Chip>)
                                    )}
                                    <Input innerRef={this.onInputMount} placeholder={t('title_userSearch')}
                                        value={this.query} onChange={this.handleTextChange}
                                        onKeyDown={this.handleKeyDown} />
                                </div>
                                <Button className={css('confirm', {
                                    banish: this.props.onlyPick
                                    || (!this.selected.length && (!this.props.extraChips || !this.props.extraChips.length))
                                })} label={this.props.button || t('button_go')} onClick={this.accept} disabled={!this.isValid} />
                            </div>
                            {this.props.limit &&
                                <div className={css('text-right', 'dark-label', { 'error-search': this.isLimitReached })}>
                                    <T k="title_addedPeopleLimit">
                                        {{ added: this.selectedSelfless.length + 1, limit: this.props.limit }}
                                    </T>
                                </div>}
                            {this.showNotFoundError
                                ? <T k={this.legacyContactError ? 'title_inviteLegacy' : 'error_userNotFound'} tag="div"
                                    className="error-search" />
                                : null}

                        </div>
                        {this.suggestInviteEmail ?
                            <div className="email-invite-container">
                                <div className="email-invite">{this.suggestInviteEmail}</div>
                                <Button primary onClick={this.invite} label={t('button_inviteEmailContact')} />
                            </div>
                            : null}
                        {!this.isLimitReached && <List selectable ripple >
                            <div key="list" className="user-list">
                                <ListSubHeader key="fav-header" caption={t('title_favoriteContacts')} />
                                {this.options.map(c => {
                                    if (c === true) return <ListSubHeader key="all-header" caption={t('title_allContacts')} />;

                                    return (<span key={c.username} data-id={c.username}>
                                        <ListItem
                                            leftActions={[<Avatar key="a" contact={c} size="medium" />]}
                                            caption={c.username}
                                            // Should be something like <span class="tag"> In channel</span>
                                            legend={`${c.firstName} ${c.lastName}`}
                                            onClick={this.onContactClick}
                                            className={css({ warning: this.noGood })} />
                                    </span>);
                                })
                                }
                            </div>
                        </List>}
                    </div>
                </div>
            </div>
        );
    }
}


module.exports = UserPicker;
