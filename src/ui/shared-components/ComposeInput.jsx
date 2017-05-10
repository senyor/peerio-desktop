/* eslint-disable react/no-multi-comp, no-cond-assign */
const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const EmojiPicker = require('~/ui/emoji/Picker');
const emojione = require('~/static/emoji/emojione.js');
const Quill = require('quill/dist/quill.core');
const { sanitizeChatMessage } = require('~/helpers/sanitizer');
const FilePicker = require('~/ui/files/components/FilePicker');
const { t } = require('peerio-translator');

// todo: this file is messy as hell, maybe refactor it

const Embed = Quill.import('blots/embed');
const Inline = Quill.import('blots/inline');
const Keyboard = Quill.import('modules/keyboard');

const pngFolder = './static/emoji/png/';
const codeUrlRegex = /([A-Za-z0-9-]+)\.png/i;

class EmojiBlot extends Embed {
    static create(unicode) {
        const node = super.create();
        node.setAttribute('src', `${pngFolder}${unicode}.png`);
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

class BoldBlot extends Inline { }
BoldBlot.blotName = 'bold';
BoldBlot.tagName = 'b';

class ItalicBlot extends Inline { }
ItalicBlot.blotName = 'italic';
ItalicBlot.tagName = 'i';

Quill.register(EmojiBlot);
Quill.register(ItalicBlot);
Quill.register(BoldBlot);

// this makes it impossible to have 2 ComposeInput rendered at the same time
// for the sake of emoji picker performance.
// But we probably never want to render 2 inputs anyway.
let cachedPicker;
let currentInputInstance;

function onEmojiPicked(emoji) {
    currentInputInstance.hideEmojiPicker();
    currentInputInstance.insertEmoji(emoji);
}


@observer
class ComposeInput extends React.Component {
    @observable text = '';
    @observable emojiPickerVisible = false;
    @observable suggests = null;
    @observable filePickerActive = false;


    constructor() {
        super();
        this.cachedPicker = cachedPicker;
        currentInputInstance = this;
        this.returnToSend = false;
        this.permitEmptyBody = false;
        if (!this.cachedPicker) {
            this.cachedPicker = (
                <EmojiPicker onPicked={onEmojiPicked} onBlur={this.hideEmojiPicker} />
            );
        }
    }

    componentWillReceiveProps(newProps) {
        if (!this.quill) return;
        this.quill.root.setAttribute('data-placeholder', newProps.placeholder);
    }

    getCleanContents = () => {
        let data = document.getElementsByClassName('ql-editor')[0].innerHTML;
        data = data.trim();
        if (data === '') return '';
        data = data.replace(/<br\/?>/gim, '\n');
        data = data.replace(/<\/p>/gim, '\n');
        data = data.replace(/<p>/gim, '');

        const imgRegex = /<img src=".*?\/([A-Za-z0-9-]+)\.png"\/?>/gim;
        let match;
        const replacements = [];
        while ((match = imgRegex.exec(data)) !== null) {
            replacements.push({ img: match[0], unicode: emojione.convert(match[1]) });
        }
        replacements.forEach(r => {
            data = data.replace(r.img, r.unicode);
        });

        // this shortnameToUnicode catches pasted shortnames and emoticons
        data = emojione.shortnameToUnicode(data);
        data = sanitizeChatMessage(data);

        data = data.trim();
        return data;
    };

    setPlaceholder(text) {
        if (!this.quill) return;
        this.quill.root.setAttribute('data-placeholder', text);
    }
    handleSubmit = () => {
        const data = this.getCleanContents();
        if (data === '' && !this.permitEmptyBody) return;
        this.props.onSend(data);
        this.clearEditor();
    };

    showEmojiPicker = () => {
        this.emojiPickerVisible = true;//! this.emojiPickerVisible;
    };

    hideEmojiPicker = () => {
        this.emojiPickerVisible = false;
    };

    insertEmoji = (emoji) => {
        const ind = this.quill.getSelection(true).index;
        this.quill.insertEmbed(ind, 'emoji', emoji.unicode, Quill.sources.USER);
        this.quill.insertText(ind + 1, ' ', Quill.sources.USER);
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

        if (this.returnToSend === true) {
            opts.modules.keyboard.bindings.enter = {
                key: Keyboard.keys.ENTER,
                shiftKey: false,
                metaKey: false,
                ctrlKey: false,
                altKey: false,
                // eslint-disable-next-line
                handler: (range, context) => {
                    this.handleSubmit();
                }
            };
        }
        // const quill =
        this.quill = new Quill(el, opts);
        setTimeout(() => this.quill.focus(), 1500);

        // quill.on('text-change', (delta, oldDelta, source) => {
        //     if (source === Quill.sources.USER) {
        //         this.tryShowEmojiSuggestions();
        //     }
        // });
    };
    //     ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", "k", "i", "s", "_", "w", "|", "c", "o", "u",
    // "p", "l", "e", "m", "f", "a", "y", "b", "g", "t", "h", "r", "n", "d", "z", "v", "x", "j", "-", "\", "+",
    // "q"]
    // tryShowEmojiSuggestions = () =>{
    //     const sel = this.quill.getSelection();
    //     if(sel.length){
    //         this.suggests = null;
    //         return;
    //     }
    //     const text = this.quill.getText();
    //
    // };
    clearEditor = () => {
        this.quill.setText('');
        this.quill.history.clear();
    };
    preventDrop = (e) => {
        e.preventDefault();
        return false;
    };

    handleFilePickerClose = () => {
        this.filePickerActive = false;
    };

    shareFiles = selected => {
        this.props.onFileShare(selected);
        this.handleFilePickerClose();
    };

    renderFilePicker() {
        return (<FilePicker active={this.filePickerActive} onClose={this.handleFilePickerClose}
            onShare={this.shareFiles} />);
    }

    render() {
        return null;
    }
}
module.exports = ComposeInput;
