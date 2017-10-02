// @ts-check

/*

For simplicity, this component's render method returns an array of components,
using React 16's capacity to return unwrapped fragments.
(see https://egghead.io/lessons/react-render-multiple-elements-without-a-wrapping-element-in-a-component-in-react-16)

The parent component, MessageInput, also has its own components to render in a
flex group, so this lets them all mount inline. This could be confusing, so we
might want to revisit this in a later refactor.

Note that all components we return in the array need a unique key (which only
needs to be unique to this particular component, not siblings in other files)
so we give the suggests wrapper, emoji picker button, emoji picker and input
field their own named keys manually.

*/

const React = require('react');
const { observable, observe, reaction } = require('mobx');
const { observer } = require('mobx-react');

const Quill = require('quill/dist/quill.core');
const htmlDecoder = require('html-entities').AllHtmlEntities;

const { IconButton } = require('~/react-toolbox');
const { chatStore, contactStore } = require('~/icebear');

const uiStore = require('~/stores/ui-store');
const EmojiPicker = require('~/ui/emoji/Picker');

const emojione = require('~/static/emoji/emojione.js');


const Embed = Quill.import('blots/embed');
// const Inline = Quill.import('blots/inline');
const Keyboard = Quill.import('modules/keyboard');

const pngFolder = './static/emoji/png/';
const codeUrlRegex = /([A-Za-z0-9-]+)\.png/i;

class EmojiBlot extends Embed {
    static create(emoji) {
        const node = super.create();
        node.setAttribute('src', `${pngFolder}${emoji.unicode}.png`);
        node.setAttribute('alt', emoji.shortname);
        return node;
    }

    static value(node) {
        const url = node.getAttribute('src');
        codeUrlRegex.lastIndex = 0;
        const match = codeUrlRegex.exec(url);
        if (!match) return null;
        try {
            if (emojione.convert(match[1]) === '') return null;
        } catch (ex) {
            return null;
        }
        return match[1];
    }
}
EmojiBlot.blotName = 'emoji';
EmojiBlot.tagName = 'img';

Quill.register(EmojiBlot);


// this makes it impossible to have 2 MessageInputQuill rendered at the same time
// for the sake of emoji picker performance.
// But we probably never want to render 2 inputs anyway.
let cachedPicker;
let currentInputInstance;

function onEmojiPicked(emoji) {
    currentInputInstance.hideEmojiPicker();
    currentInputInstance.insertEmoji(emoji);
}

@observer
class MessageInputQuill extends React.Component {
    @observable suggests = null;
    @observable selectedSuggestIndex = -1;
    @observable currentSuggestToken = '';
    @observable emojiPickerVisible = false;

    constructor() {
        super();

        this.cachedPicker = cachedPicker;
        currentInputInstance = this;
        if (!this.cachedPicker) {
            this.cachedPicker = (
                <EmojiPicker key="emoji-picker" onPicked={onEmojiPicked} onBlur={this.hideEmojiPicker} />
            );
        }

        // FIXME: reaction not disposed!
        reaction(() => this.selectedSuggestIndex, ind => {
            if (ind < 0) return;
            /** @type {any} */
            const el = document.querySelector(`.suggests>.suggest-item:nth-of-type(${ind + 1})`);
            if (!el) return;
            el.scrollIntoViewIfNeeded(true);
        });
    }

    componentDidMount() {
        this.disposer = observe(chatStore, 'activeChat', change => {
            this.backupUnsentMessage(change.oldValue);
            this.restoreUnsentMessage(change.newValue);
        }, true);
    }

    componentWillUnmount() {
        this.backupUnsentMessage(chatStore.activeChat);
        this.disposer();
    }

    componentWillReceiveProps(newProps) {
        if (!this.quill) return;
        this.quill.root.setAttribute('data-placeholder', newProps.placeholder);
    }

    getCleanContents = () => {
        let data = document.getElementsByClassName('ql-editor')[0].innerHTML;
        data = htmlDecoder.decode(data);
        data = data.trim();
        if (data === '') return '';
        data = data.replace(/<br\/?>/gim, '\n');
        data = data.replace(/<\/p>/gim, '\n');
        data = data.replace(/<p>/gim, '');

        const imgRegex = /<img .*? alt="(:.*?:)"\/?>/gim;
        let match;
        const replacements = [];
        // eslint-disable-next-line no-cond-assign
        while ((match = imgRegex.exec(data)) !== null) {
            replacements.push({ img: match[0], unicode: emojione.shortnameToUnicode(match[1]) });
        }
        replacements.forEach(r => {
            data = data.replace(r.img, r.unicode);
        });

        // this shortnameToUnicode catches pasted shortnames and emoticons
        data = emojione.shortnameToUnicode(data);
        // data = sanitizeChatMessage(data);

        data = data.trim();
        return data;
    };

    activateQuill = el => {
        if (!el) return;
        const opts = {
            placeholder: this.props.placeholder || '',
            formats: ['bold', 'italic', 'emoji'],
            modules: {
                keyboard: {
                    bindings: {

                    }
                }
            }
        };

        opts.modules.keyboard.bindings.enter = {
            key: Keyboard.keys.ENTER,
            shiftKey: false,
            metaKey: false,
            ctrlKey: false,
            altKey: false,
            // eslint-disable-next-line
            handler: (range, context) => {
                if (this.suggests && this.suggests.length && this.selectedSuggestIndex >= 0) {
                    this.acceptSuggestedString();
                    return;
                }
                this.handleSubmit();
            }
        };

        // const quill =
        this.quill = new Quill(el, opts);
        setTimeout(() => this.quill.focus(), 500);

        const usernameRegex = /(^|\s+)@([a-zA-Z0-9_]{0,32})$/;

        const getUsernameToken = () => {
            const sel = this.quill.getSelection(true);
            if (!sel) return null;
            const text = this.quill.getText().substring(0, sel.index);
            const matches = text.match(usernameRegex);
            if (matches && matches.length) return matches[matches.length - 1];
            return null;
        };

        this.quill.on('text-change', (delta, oldDelta, source) => {
            if (source === Quill.sources.USER) {
                const chat = chatStore.activeChat;
                if (!chat || !chat.participants.length) return;
                let token = getUsernameToken();
                if (token === null) {
                    this.suggests = null;
                    return;
                }
                token = token.toLocaleLowerCase();
                this.currentSuggestToken = token;
                this.suggests = contactStore.filter(token, chat.participants);
                this.selectedSuggestIndex = this.suggests.length ? 0 : -1;
                // console.log(delta, oldDelta);
                //                this.tryShowEmojiSuggestions();
            }
        });

        this.quill.keyboard.addBinding({
            key: 37, // left
            shortKey: false
        }, () => {
            this.suggests = null;
            return true;
        });

        this.quill.keyboard.addBinding({
            key: 39, // right
            shortKey: false
        }, () => {
            this.suggests = null;
            return true;
        });

        this.quill.keyboard.addBinding({
            key: 27, // esc
            shortKey: false
        }, () => {
            this.suggests = null;
            return true;
        });

        this.quill.keyboard.addBinding({
            key: 38, // up
            shortKey: false
        }, () => {
            if (!this.suggests || !this.suggests.length) {
                return true;
            }
            if (this.selectedSuggestIndex > 0) {
                this.selectedSuggestIndex--;
            }
            return false;
        });

        this.quill.keyboard.addBinding({
            key: 40, // down
            shortKey: false
        }, () => {
            if (!this.suggests || !this.suggests.length) {
                return true;
            }
            if (this.selectedSuggestIndex < this.suggests.length - 1) {
                this.selectedSuggestIndex++;
            }
            return false;
        });

        // @ts-ignore
        window.q = this.quill;
    };

    showEmojiPicker = () => {
        this.suggests = null;
        this.emojiPickerVisible = true;//! this.emojiPickerVisible;
    };

    hideEmojiPicker = () => {
        this.emojiPickerVisible = false;
    };

    acceptSuggestedString = () => {
        let ind = this.quill.getSelection(true).index;
        this.quill.insertText(ind - this.currentSuggestToken.length,
            `${this.suggests[this.selectedSuggestIndex].username} `, Quill.sources.USER);

        ind = this.quill.getSelection(true).index;
        this.quill.deleteText(ind - this.currentSuggestToken.length, this.currentSuggestToken.length);
        this.suggests = [];
        setTimeout(() => this.quill.focus()); // for the cases when user clicked on the dropdown causing blur
    };

    clearEditor = () => {
        this.quill.setText('');
        this.quill.history.clear();
    };

    insertEmoji = (emoji) => {
        const ind = this.quill.getSelection(true).index;
        this.quill.insertEmbed(
            ind,
            'emoji',
            { unicode: emoji.unicode, shortname: emoji.shortname },
            Quill.sources.USER
        );
        this.quill.insertText(ind + 1, ' ', Quill.sources.USER);
        this.quill.setSelection(ind + 2, 0);
    };


    backupUnsentMessage(chat) {
        try {
            if (!chat || !this.quill) return;
            const delta = this.quill.getContents();
            uiStore.unsentMessages[chat.id] = delta;
        } catch (err) {
            console.error(err);
            // don't care, swallowing errors because don't want to deal with all the mounted/unmounted/created states
        }
    }

    restoreUnsentMessage(chat) {
        try {
            if (!this.quill) return;
            let delta;
            // eslint-disable-next-line no-cond-assign
            if (!chat || !(delta = uiStore.unsentMessages[chat.id])) {
                this.clearEditor();
                return;
            }
            this.quill.setContents(delta);
        } catch (err) {
            console.error(err);
            // don't care, swallowing errors because don't want to deal with all the mounted/unmounted/created states
        }
    }

    handleSubmit = () => {
        const data = this.getCleanContents();
        if (data === '') return;
        this.props.onSend(data);
        this.clearEditor();
    };

    onInputBlur = () => {
        setTimeout(() => { this.suggests = null; });
    }

    renderSuggests() {
        if (!this.suggests || !this.suggests.length) return null;
        let c = 0;
        return (
            <div className="suggests-wrapper" key="suggests">
                <div className="suggests">
                    {this.suggests ?
                        this.suggests.map(s => {
                            const i = c++;
                            return (
                                <div className={`suggest-item ${i === this.selectedSuggestIndex ? 'selected' : ''}`}
                                    key={s.username}
                                    onMouseDown={() => {
                                        this.selectedSuggestIndex = i;
                                        this.acceptSuggestedString();
                                    }}
                                    onMouseOver={() => {
                                        this.selectedSuggestIndex = i;
                                    }}>
                                    @{s.username} - {s.fullName}
                                </div>
                            );
                        }) : null}
                </div>
            </div>
        );
    }

    render() {
        return [
            this.renderSuggests(),
            <div
                key="editor"
                id="messageEditor"
                onBlur={this.onInputBlur}
                ref={this.activateQuill}
            />,
            <IconButton
                key="emoji-picker-open-button"
                icon="mood"
                disabled={this.emojiPickerVisible}
                onClick={this.showEmojiPicker}
            />,
            this.emojiPickerVisible ? this.cachedPicker : null
        ];
    }
}

module.exports = MessageInputQuill;
