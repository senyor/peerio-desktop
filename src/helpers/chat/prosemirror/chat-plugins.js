// @ts-check
const os = require('os');

const { exitCode, toggleMark, chainCommands, baseKeymap } = require('prosemirror-commands');
const { keymap } = require('prosemirror-keymap');
const { undo, redo } = require('prosemirror-history');
const { undoInputRule, inputRules, InputRule } = require('prosemirror-inputrules');
const { history } = require('prosemirror-history');
const { dropCursor } = require('prosemirror-dropcursor');
const { gapCursor } = require('prosemirror-gapcursor');

const { chatSchema } = require('~/helpers/chat/prosemirror/chat-schema');
const { emojiByAllShortnames, emojiByAsciiSequences } = require('~/helpers/chat/emoji');
const { emojiPlugin } = require('~/helpers/chat/prosemirror/emoji-plugin');
const { ensuredInputRules } = require('~/helpers/chat/prosemirror/ensured-input-rules');


// eslint-disable-next-line no-unused-vars, (for typechecking)
const { EditorState, Transaction } = require('prosemirror-state');


// We want most of the keys from the base keymap but filter a few out
const { Enter, ...passthroughKeys } = baseKeymap;

/* eslint-disable quote-props */
/* eslint-disable dot-notation */
const chatKeys = {
    ...passthroughKeys,
    'Shift-Enter': chainCommands(
        exitCode,
        (/** @type {EditorState} */state, /** @type {(tr : Transaction) => void} */dispatch) => {
            if (dispatch) {
                dispatch(state.tr.replaceSelectionWith(chatSchema.nodes.hard_break.create()).scrollIntoView());
            }
            return true;
        }
    ),
    'Mod-b': toggleMark(chatSchema.marks.strong),
    'Mod-i': toggleMark(chatSchema.marks.em),
    'Mod-5': toggleMark(chatSchema.marks.strike),
    'Backspace': chainCommands(undoInputRule, baseKeymap['Backspace']),
    'Mod-Backspace': baseKeymap['Mod-Backspace'],
    'Delete': baseKeymap['Delete'],
    'Mod-Delete': baseKeymap['Mod-Delete'],
    'Mod-a': baseKeymap['Mod-a'],
    'Mod-z': undo,
    'Shift-Mod-z': redo
};

chatKeys['Mod-Enter'] = chatKeys['Shift-Enter'];

if (os.type() !== 'Darwin') {
    chatKeys['Mod-y'] = chatKeys['Shift-Mod-z'];
} else {
    chatKeys['Ctrl-h'] = chatKeys['Backspace'];
    chatKeys['Alt-Backspace'] = chatKeys['Mod-Backspace'];
    chatKeys['Ctrl-d'] = chatKeys['Delete'];
    chatKeys['Ctrl-Alt-Backspace'] = chatKeys['Mod-Delete'];
    chatKeys['Alt-Delete'] = chatKeys['Mod-Delete'];
    chatKeys['Alt-d'] = chatKeys['Mod-Delete'];
    chatKeys['Ctrl-Enter'] = chatKeys['Shift-Enter'];
}
/* eslint-enable dot-notation */
/* eslint-enable quote-props */

const chatKeymap = keymap(chatKeys);


// Match (but don't include) the start of the input, or any kind of whitespace,
// or the unicode object replacement character (used by InputRule to replace
// leaf nodes that don't contain text), then @something followed by whitespace.
// TODO: we may also want to break on things other than whitespace but still apply the rule?
const mentionInputRulePattern = /(?<=^|\s|\u{fffc})@([a-zA-Z0-9_]{1,32})(\s)$/u;
const mentionInputRule = new InputRule(mentionInputRulePattern, (state, match, start, end) => {
    const s = state.schema;

    const replacement = [
        s.node('mention', { username: match[1].toLowerCase() }),
        s.text(match[2]) // use the same kind of trailing whitespace in the replacement.
    ];

    return state.tr.replaceWith(start, end, replacement);
});


// Match (but don't include) the start of the input, or any kind of whitespace,
// or the unicode object replacement character (used by InputRule to replace
// leaf nodes that don't contain text), then a candidate emoji shortname (we
// check its validity in the rule.)
// TODO: is this an exhaustive list of valid characters in shortnames?
const emojiShortnameInputRulePattern = /(?<=^|\s|\u{fffc})(:[a-zA-Z0-9_+]{2,}:)$/u;
const emojiShortnameInputRule = new InputRule(emojiShortnameInputRulePattern, (state, match, start, end) => {
    const emoji = emojiByAllShortnames[match[1].toLowerCase()];
    if (!emoji) return null;
    return state.tr.replaceWith(
        start,
        end,
        state.schema.node('emoji', { shortname: emoji.shortname })
    );
});


const asciiPattern = Object.keys(emojiByAsciiSequences) // take all the ascii sequences we can match...
    .map(seq => seq.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&')) // ...and escape all their regex-meaningful characters...
    .join('|'); // ...then join them as a single regex-able match pattern.

// Match (but don't include) the start of the input, or any kind of whitespace,
// or the unicode object replacement character (used by InputRule to replace
// leaf nodes that don't contain text), then any of the ascii emoji sequences,
// followed by whitespace.
const emojiAsciiInputRulePattern = new RegExp(
    `(?<=^|\\s|\u{fffc})(${asciiPattern})(\\s)$`,
    'u'
);
const emojiAsciiInputRule = new InputRule(emojiAsciiInputRulePattern, (state, match, start, end) => {
    const emoji = emojiByAsciiSequences[match[1]];
    if (!emoji) return null;

    const s = state.schema;
    const replacement = [
        s.node('emoji', { shortname: emoji.shortname }),
        s.text(match[2]) // use the same kind of trailing whitespace in the replacement.
    ];

    return state.tr.replaceWith(start, end, replacement);
});


module.exports = {
    chatPlugins: [
        chatKeymap,
        dropCursor(),
        gapCursor(),
        history(),
        inputRules({ rules: [emojiShortnameInputRule, emojiAsciiInputRule] }),
        ensuredInputRules({ rules: [mentionInputRule] }),
        emojiPlugin()
    ]
};
