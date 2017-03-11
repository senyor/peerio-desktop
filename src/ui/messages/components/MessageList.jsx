const React = require('react');
const { reaction } = require('mobx');
const { observer } = require('mobx-react');
const { ProgressBar } = require('~/react-toolbox');
const Avatar = require('~/ui/shared-components/Avatar');
const Message = require('./Message');
const { chatStore } = require('~/icebear');
const { t } = require('peerio-translator');
const _ = require('lodash');

@observer
class MessageList extends React.Component {

    loadTriggerDistance = 20;
    stickDistance = 220;

    componentWillMount() {
        this.stickToBottom = true;
        // reaction to fix scroll position when scrolling up
        this._reaction = reaction(() => chatStore.activeChat && chatStore.activeChat.loadingTopPage, (loading) => {
            if (loading) {
                this.lastTopElement = null;
                for (let i = 0; i < this.containerRef.childNodes.length; i++) {
                    const el = this.containerRef.childNodes[i];
                    if (el.classList[0] !== 'message-content-wrapper') continue;
                    this.lastTopElement = el;
                    break;
                }
                this.lastTopElementOffset = this.lastTopElement ? this.lastTopElement.offsetTop : 0;
                return;
            }
            if (this.lastTopElement) {
                setTimeout(() => {
                    if (!this.lastTopElement) return;
                    // todo: animate
                    this.containerRef.scrollTop = this.lastTopElement.offsetTop - this.lastTopElementOffset - 28;
                    this.lastTopElement = null;
                }, 200);
            }
        });
        // reaction to jump to recent from history mode
        this._resetReaction = reaction(
            () => chatStore.activeChat && chatStore.activeChat.loadingInitialPage,
            () => {
                this.stickToBottom = true;
                this.lastTopElement = null;
            }
        );
        // reaction to paging down to cancel top scroll fix
        this._resetReaction = reaction(
            () => chatStore.activeChat && chatStore.activeChat.loadingBottomPage,
            () => { this.lastTopElement = null; }
        );
    }

    componentWillUnmount() {
        this._reaction();
        this._resetReaction();
    }

    componentDidUpdate() {
        if (this.stickToBottom) {
            setTimeout(this.scrollToBottom, 100);
        }
    }

    scrollToBottom = () => {
        if (!this.containerRef) return;
        this.containerRef.scrollTop = this.containerRef.scrollHeight - this.containerRef.clientHeight - 20;
    };

    handleScroll = _.debounce(() => {
        // we can't handle scroll if content height is too small
        if (this.containerRef.scrollHeight <= this.containerRef.clientHeight) return;

        const distanceToBottom = this.containerRef.scrollHeight - this.containerRef.scrollTop
                                    - this.containerRef.clientHeight;
        const distanceToTop = this.containerRef.scrollTop;
        // detecting sticking state
        this.stickToBottom = distanceToBottom < this.stickDistance && !chatStore.activeChat.canGoDown;
        // triggering page load
        if (distanceToBottom < this.loadTriggerDistance) {
            chatStore.activeChat.loadNextPage();
        }
        if (distanceToTop < this.loadTriggerDistance) {
            chatStore.activeChat.loadPreviousPage();
        }
    }, 250);

    setContainerRef = (r) => {
        this.containerRef = r;
    };

    /**
     * IMPORTANT:
     * Scroll position retention logic counts on
     * 1. Message items to have className "message-content-wrapper"as their FIRST class mentioned
     * 2. No OTHER type of items to have the same class name at the first position
     */
    renderMessages() {
        const ret = [];
        if (chatStore.activeChat.canGoUp) {
            ret.push(<div key="top-progress-bar" className="progress-wrapper"
                      style={{ visibility: chatStore.activeChat.loadingTopPage ? 'visible' : 'hidden' }}>
                <ProgressBar type="circular" mode="indeterminate" multicolor
                                  className="messages-inline-progress-bar" />
            </div>);
        }
        const msgs = chatStore.activeChat.messages;
        const limboMsgs = chatStore.activeChat.limboMessages;
        const totalLength = msgs.length + limboMsgs.length;
        for (let i = 0; i < totalLength; i++) {
            const m = i < msgs.length ? msgs[i] : limboMsgs[i - msgs.length];
            if (m.firstOfTheDay) {
                const ts = m.timestamp.toLocaleDateString();
                ret.push(<div key={ts + m.id} className="marker-wrapper">
                    <div className="marker" />
                    <div className="content">{ts === new Date().toLocaleDateString() ? t('today') : ts}</div>
                    <div className="marker" />
                </div>);
            }
            ret.push(<Message key={m.tempId || m.id} message={m} light={m.groupWithPrevious} />);
        }

        if (chatStore.activeChat.canGoDown) {
            ret.push(<div key="bot-progress-bar" className="progress-wrapper"
                style={{ visibility: chatStore.activeChat.loadingBottomPage ? 'visible' : 'hidden' }}>
                <ProgressBar type="circular" mode="indeterminate" multicolor
                                  className="messages-inline-progress-bar" />
            </div>);
        }

        return ret;
    }

    render() {
        if (!chatStore.activeChat) return null;
        const style = {
            paddingTop: `${this.loadTriggerHeight}px`,
            paddingBottom: `${this.loadTriggerHeight}px`
        };
        return (
            <div className="messages-container" style={style}
                    onScroll={this.handleScroll} ref={this.setContainerRef}>
                { chatStore.activeChat.canGoUp || !chatStore.activeChat.initialPageLoaded ? null :
                <div className="messages-start">
                    <div className="avatars">
                        {chatStore.activeChat.participants.map(c =>
                            <Avatar key={c.username} contact={c} />)}
                    </div>
                    <div className="title">
                        {t('title_chatBeginning')}
                        &nbsp;<strong>{chatStore.activeChat.chatName}</strong>.
                    </div>
                </div>
                }

                {chatStore.activeChat.loadingInitialPage
                    ? <ProgressBar type="circular" mode="indeterminate"
                                   multicolor className="messages-progress-bar" />
                    : this.renderMessages()
                }
                {chatStore.activeChat.loadiingBottomPage ? <ProgressBar type="circular" mode="indeterminate"
                                   multicolor className="messages-progress-bar bottom" /> : null }
            </div>
        );
    }
}


module.exports = MessageList;
