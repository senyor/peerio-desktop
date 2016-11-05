const React = require('react');
const { observable, computed, when } = require('mobx');
const { observer } = require('mobx-react');
const { Button, Chip, Input, List, ListItem, ListSubHeader, ProgressBar } = require('react-toolbox');
const { contactStore, chatStore } = require('../icebear'); //eslint-disable-line
const css = require('classnames');

@observer
class NewMessage extends React.Component {
    @observable selected = [];
    @observable query = '';

    @computed get options() {
        return contactStore.contacts.filter(c => !c.loading && !c.notFound && !this.selected.includes(c));
    }

    @computed get canGO() {
        return !!this.selected.find(s => !s.loading && !s.notFound);
    }

    handleTextChange = newVal => {
        if (newVal.length > 1 && ', '.includes(newVal[newVal.length - 1])) {
            this.query = newVal.substr(0, newVal.length - 1).trim();
            this.tryAcceptUsername();
            return;
        }
        this.query = newVal.trim();
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
        if (this.selected.find(s => s.username === this.query)) {
            return;
        }
        const c = contactStore.getContact(this.query);
        this.selected.push(c);
        when(() => !c.loading, () => {
            setTimeout(() => c.notFound && this.selected.remove(c), 3000);
        });
        this.query = '';
    }
    creatingChat = false;
    go = () => {
        if (this.creatingChat || !this.canGO) return;
        this.creatingChat = true;
        this.selected.forEach(s => {
            if (s.notFound) this.selected.remove(s);
        });

        chatStore.startChat(this.selected);
        this.context.router.push('/app');
    };

    render() {
        return (
            <div className="create-new-message">
                <div className="flex-col"
                    style={{
                        alignItems: 'center',
                        width: '600px',
                        marginTop: '168px' }}>
                    <div className="new-message-search">
                        {this.selected.map(c =>
                            <Chip key={c.username} className={css('username', { 'not-found': c.notFound })}
                                  onDeleteClick={() => this.selected.remove(c)} deletable>
                                { c.loading ? <ProgressBar type="linear" mode="indeterminate" /> : c.username }
                            </Chip>
                        )}
                        <Input placeholder="enter username" value={this.query} onChange={this.handleTextChange}
                                onKeyDown={this.handleKeyDown} />
                        <Button className="confirm" label="Go" onClick={this.go} disabled={!this.canGO} />
                    </div>
                    <List selectable ripple >
                        <ListSubHeader caption="Your contacts" />
                        { this.options.map(c =>
                            <ListItem key={c.username} avatar="https://placeimg.com/80/80/animals"
                                      caption={c.username} legend="some text about the user"
                                      onClick={() => this.selected.push(c)} />
                        )}
                    </List>
                </div>
            </div>
        );
    }
}

NewMessage.contextTypes = {
    router: React.PropTypes.object
};

module.exports = NewMessage;
