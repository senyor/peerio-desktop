/* eslint-disable react/no-multi-comp */
const React = require('react');
const { IconMenu, MenuItem, IconButton } = require('react-toolbox');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const Snackbar = require('../../shared-components/Snackbar');
const EmojiPicker = require('../../emoji/Picker');
const emojione = require('emojione');
const { EditorState, ContentState, Modifier, Entity } = require('draft-js');
const Editor = require('draft-js-plugins-editor').default;
const createUndoPlugin = require('draft-js-undo-plugin').default;
const createEmojiPlugin = require('draft-js-emoji-plugin').default;
const defaultPositionSuggestions = require('draft-js-emoji-plugin/lib/utils/positionSuggestions').default;

function addEmoji(editorState, unicode) {
    const currentSelectionState = editorState.getSelection();
    const emoji = String.fromCodePoint.apply(null, unicode.split('-').map(i => `0x${i}`));
    const entityKey = Entity.create('emoji', 'IMMUTABLE', { emojiUnicode: emoji });

    const emojiReplacedContent = Modifier.insertText(
    editorState.getCurrentContent(),
    currentSelectionState,
    emoji,
    null,
    entityKey
  );

    const newEditorState = EditorState.push(
    editorState,
    emojiReplacedContent,
    'insert-emoji',
  );
    return EditorState.forceSelection(newEditorState, emojiReplacedContent.getSelectionAfter());
}

// todo: this file is messy as hell, maybe refactor it

// this makes it impossible to have 2 MessageInput rendered at the same time
// for the sake of emoji picker performance.
// But we probably never want to render 2 inputs anyway.
let cachedPicker;
let currentInputInstance, currentEditorInstance;

function onEmojiPicked(emoji) {
    currentInputInstance.hideEmojiPicker();
    currentEditorInstance.onEmojiPicked(emoji);
}

const emojiPlugin = createEmojiPlugin({
    imageType: 'png',
    imagePath: './static/emoji/png/',
    allowImageCache: true,
    positionSuggestions: (data) => {
        const s = defaultPositionSuggestions(data);
        s.top = `${parseInt(s.top, 10) - 300}px`;
        return s;
    }
});

const plugins = [
    emojiPlugin,
    createUndoPlugin()
];

const { EmojiSuggestions } = emojiPlugin;

class ChatEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = { editorState: EditorState.createEmpty() };
        this.onChange = (editorState) => this.setState({ editorState });
        currentEditorInstance = this;
    }
    oneReturnKey = e => {
        if (!this.suggestionsAreOpen && !e.shiftKey) {
            this.props.onSubmit(this.state.editorState.getCurrentContent().getPlainText());
            this.reset();
            return 'handled';
        }
        return 'not-handled';
    };
    onOpen = () => {
        this.suggestionsAreOpen = true;
    };
    onClose= () => {
        this.suggestionsAreOpen = false;
    };
    reset = () => {
        const editorState = EditorState.push(this.state.editorState, ContentState.createFromText(''));
        this.setState({ editorState });
    };
    onEmojiPicked = emoji => {
        this.onChange(addEmoji(this.state.editorState, emoji.unicode));
    };
    render() {
        return (
            <div className="full-width">
                <Editor editorState={this.state.editorState} onChange={this.onChange}
                        onFocus={currentInputInstance.hideEmojiPicker}
                        handleReturn={this.oneReturnKey} plugins={plugins} />
                <EmojiSuggestions onOpen={this.onOpen} onClose={this.onClose} />
            </div>
        );
    }
}

@observer
class MessageInput extends React.Component {
    @observable text = '';
    @observable emojiPickerVisible = false;

    constructor() {
        super();
        currentInputInstance = this;
        if (!cachedPicker) {
            cachedPicker = (
                <EmojiPicker onPicked={onEmojiPicked} />
            );
        }
    }

    handleSubmit = data => {
        data = data.trim(); // eslint-disable-line no-param-reassign
        if (data === '') return;
        // this shortnameToUnicode catches pasted shortnames and emoticons
        this.props.onSend(emojione.shortnameToUnicode(data));
    };

    toggleEmojiPicker = () => {
        this.emojiPickerVisible = !this.emojiPickerVisible;
    };

    hideEmojiPicker = () => {
        this.emojiPickerVisible = false;
    };

    render() {
        if (!this.props.show) return null;
        return (
            <div className="message-input">
                <Snackbar location="chat" priority="1" />
                <IconMenu icon="add_circle_outline">
                    <MenuItem value="share" caption="Share from files" disabled />
                    <MenuItem value="upload" caption="Upload to DM" disabled />
                </IconMenu>
                <ChatEditor onSubmit={this.handleSubmit} />
                <IconButton icon="mood" onClick={this.toggleEmojiPicker} />
                {this.text === ''
                    ? <IconButton icon="thumb_up" onClick={this.props.onAck} className="color-brand" />
                    : null }

                {this.emojiPickerVisible ? cachedPicker : null }
            </div>
        );
    }
}
module.exports = MessageInput;
