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
    stickDistance = 250;

    componentWillMount() {
        this.stickToBottom = true;
        // reaction to fix scroll position when scrolling up
        this._topLoadReaction = reaction(() => chatStore.activeChat && chatStore.activeChat.loadingTopPage,
            (loading) => {
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
                    if (!this.lastTopElement) return;
                    // todo: animate
                    this.containerRef.scrollTop = this.lastTopElement.offsetTop - this.lastTopElementOffset - 28;
                    this.lastTopElement = null;
                }
            });
        // reaction to jump to recent from history mode
        this._initialLoadReaction = reaction(
            () => chatStore.activeChat && chatStore.activeChat.loadingInitialPage,
            () => {
                this.stickToBottom = true;
                this.lastTopElement = null;
            }
        );
        // reaction to paging down to cancel top scroll fix
        this._botLoadReaction = reaction(
            () => chatStore.activeChat && chatStore.activeChat.loadingBottomPage,
            () => { this.lastTopElement = null; }
        );
        // reaction to user changing chats
        this._chatSwitchReaction = reaction(() => chatStore.activeChat, (chat) => {
            if (chat) this.scrollToBottom();
        });
    }

    componentWillUnmount() {
        this._topLoadReaction();
        this._botLoadReaction();
        this._initialLoadReaction();
        this._chatSwitchReaction();
    }

    componentDidUpdate() {
        if (this.stickToBottom) {
            setTimeout(this.scrollToBottom, 100);
        }
    }

    scrollToBottom = () => {
        setTimeout(() => {
            if (!this.containerRef) return;
            this.containerRef.scrollTop = this.containerRef.scrollHeight - this.containerRef.clientHeight - 20;
        }, 0);
    };
    // todo: investigate why throttlig causes lags when scrolling with trackpad at big velocity
    handleScroll = // _.throttle(
    () => {
        // console.log('SCROLL');
        // we can't handle scroll if content height is too small
        if (this.containerRef.scrollHeight <= this.containerRef.clientHeight) return;

        const distanceToBottom = this.containerRef.scrollHeight - this.containerRef.scrollTop
            - this.containerRef.clientHeight;
        const distanceToTop = this.containerRef.scrollTop;
        // console.log(distanceToTop, distanceToBottom);
        // detecting sticking state
        this.stickToBottom = distanceToBottom < this.stickDistance && !chatStore.activeChat.canGoDown;
        // triggering page load
        if (distanceToBottom < this.loadTriggerDistance) {
            //  console.log('TRIGGER');
            chatStore.activeChat.loadNextPage();
        }
        if (distanceToTop < this.loadTriggerDistance) {
            // console.log('TRIGGER');
            chatStore.activeChat.loadPreviousPage();
        }
    }// , 150, { leading: true, trailing: true });

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
                ret.push(<div key={`marker${i}${ts}${m.id}`} className="marker-wrapper">
                    <div className="marker" />
                    <div className="content">{ts === new Date().toLocaleDateString() ? t('title_today') : ts}</div>
                    <div className="marker" />
                </div>);
            }
            let key = m.tempId || m.id;
            if (i >= msgs.length) {
                key += 'limbo';
            }
            ret.push(<Message key={key} message={m} light={m.groupWithPrevious} />);
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

    renderChatStart() {
        if (chatStore.activeChat.canGoUp || !chatStore.activeChat.initialPageLoaded) return null;
        return (
            <div className="messages-start">
                <div className="avatars">
                    {chatStore.activeChat.participants.map(c => <Avatar key={c.username} contact={c} />)}
                </div>
                <div className="title">
                    {t('title_chatBeginning')}
                    &nbsp;<strong>{chatStore.activeChat.chatName}</strong>.
                </div>
            </div>
        );
    }

    render() {
        if (!chatStore.activeChat) return null;

        return (
            <div className="messages-container" onScroll={this.handleScroll} ref={this.setContainerRef}>
                {this.renderChatStart()}
                {chatStore.activeChat.loadingInitialPage
                    ? <ProgressBar type="circular" mode="indeterminate"
                        multicolor className="messages-progress-bar" />
                    : this.renderMessages()
                }
            </div>
        );
    }
}


module.exports = MessageList;
