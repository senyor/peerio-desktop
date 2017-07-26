const React = require('react');
const { observable, computed, when } = require('mobx');
const { observer } = require('mobx-react');
const { Button, Chip, FontIcon, IconButton, Input, List,
    ListItem, ListSubHeader, ProgressBar } = require('~/react-toolbox');
const { t } = require('peerio-translator');
const { fileStore, contactStore } = require('~/icebear');
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
    @observable inChannel = true;
    legacyContactError = false; // not observable bcs changes only with showNotFoundError

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
        return !!this.selected.find(s => !s.loading && !s.notFound);
    }

    filterOptions = (item) => {
        if (this.selected.find(s => s.username === item.username)) return false;
        if (this.props.noDeleted && item.isDeleted) return false;
        if (item.isMe) return false;
        return true;
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
        const atInd = q.indexOf('@');
        const isEmail = atInd > -1 && atInd === q.lastIndexOf('@');
        this.selected.push(c);
        when(() => !c.loading, () => {
            setTimeout(() => c.notFound && this.selected.remove(c), 3000);
            this.suggestInviteEmail = (c.notFound && isEmail) ? q : '';
            this.legacyContactError = c.isLegacy;
            this.showNotFoundError = c.notFound;
        });
        this.query = '';
    }


    accept = () => {
        if (this.accepted || !this.isValid) return;
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

    render() {
        return (
            <div className="user-picker">
                <div className={css('flex-col selected-items', { banish: !this.props.sharing })} >
                    <List>
                        <ListSubHeader key="header" caption={t('title_selectedFiles')} />
                        {fileStore.getSelectedFiles().map(f => (<ListItem
                            key={f.id}
                            leftIcon="insert_drive_file"
                            caption={f.name}
                            rightIcon="remove_circle_outline" />))}

                    </List>
                </div>
                <div className="flex-row flex-justify-center"
                    style={{ width: '100%' }}>
                    <div className="flex-col flex-grow-1"
                        style={{
                            maxWidth: '600px'
                        }}>
                        <div className="chat-creation-header">
                            <div className="title">
                                {this.props.title}
                                {this.props.subtitle ? <span>{this.props.subtitle}</span> : ''}
                            </div>
                            <IconButton icon="close" onClick={this.handleClose} />
                        </div>
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
                                <Button className={css('confirm', { hide: !this.selected.length })}
                                    label={this.props.button || t('button_go')}
                                    onClick={this.accept} disabled={!this.isValid} />
                            </div>
                            {this.showNotFoundError
                                ? <T k={this.legacyContactError ? 'title_inviteLegacy' : 'error_userNotFound'} tag="div"
                                    className="error-search" />
                                : null}

                        </div>
                        {this.suggestInviteEmail ?
                            <div className="flex-row flex-align-center flex-justify-between flex-shrink-0">
                                <div className="email-invite">{this.suggestInviteEmail}</div>
                                <Button primary onClick={this.invite} label={t('button_inviteEmailContact')} />
                            </div>
                            : null}
                        <List selectable ripple >
                            <ListSubHeader caption={t('title_allContacts')} />
                            {/* TODO: change text to Invites on zero state messages screen */}
                            {/* TODO: change text to Favourites when favs exist */}
                            <div className="user-list">
                                {this.options.map(c => {
                                    // return <ListSubHeader caption={t('title_allContacts')} />;

                                    return (<span key={c.username} data-id={c.username}>
                                        <ListItem
                                            leftActions={[<Avatar key="a" contact={c} size="medium" />]}
                                            caption={`${c.username}
                                              ${!this.isInChannel ? 'In channel' : null}`}
                                            // Should be something like <span class="tag"> In channel</span>
                                            legend={`${c.firstName} ${c.lastName}`}
                                            onClick={this.onContactClick}
                                            className={css({ warning: this.noGood })} />
                                    </span>);
                                })
                                }
                            </div>
                        </List>
                    </div>
                </div>
            </div>
        );
    }
}


module.exports = UserPicker;
