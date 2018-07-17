// @ts-check

/*
 * See documentation for the Suggestions plugin for discussion of this component
 * structure.
 */

const os = require('os');
const React = require('react');
const {
    observable,
    runInAction
} = require('mobx');
const { observer } = require('mobx-react');
const css = require('classnames');

const {
    EditorView // eslint-disable-line no-unused-vars, (used for typechecking)
} = require('prosemirror-view');
const {
    MarkType // eslint-disable-line no-unused-vars, (used for typechecking)
} = require('prosemirror-model');
const {
    Plugin,
    Transaction, // eslint-disable-line no-unused-vars, (used for typechecking)
    EditorState // eslint-disable-line no-unused-vars, (used for typechecking)
} = require('prosemirror-state');
const { toggleMark } = require('prosemirror-commands');

const { chatSchema, isEmpty } = require('~/helpers/chat/prosemirror/chat-schema');


/**
 * @typedef FormattingConfig
 *
 * @property {MarkType} markType
 * @property {string} label
 * @property {(state: EditorState, dispatch: (tr: Transaction) => any) => any} onClick
 */

class FormattingButton {
    @observable
    active = false;

    /** @type {EditorView} */
    view;

    /**
     * @param {FormattingConfig} config
     */
    constructor(config) {
        const { markType, onClick, label } = config;
        this.markType = markType;
        this.onClick = onClick;
        this.label = label;
        this.plugin = makePlugin(this);
    }

    handleClick = () => {
        // Ignore clicks when buttons aren't visible (which is controlled by the
        // parent component, via state derived from the same isEmpty condition
        // below.) Unfortunately this hybrid plugin-component design makes it
        // way harder to share component state derived from ProseMirror state,
        // so this sort of stuff will be necessarily fragile and bug-prone...)
        if (!isEmpty(this.view.state.doc)) {
            this.onClick(this.view.state, this.view.dispatch);
            this.view.focus();
        }
    }

    Component = observer(() => {
        const { active, label, markType } = this;

        return (<div
            onClick={this.handleClick}
            className={css(
                'formatting-button',
                `formatting-button-${markType.name}`,
                { 'formatting-button-active': active }
            )}
        >
            {label}
        </div>);
    });
}

function makePlugin(/** @type {FormattingButton} */self) {
    return new Plugin({
        view() {
            return {
                update(view) {
                    if (self.view !== view) self.view = view; // terrible hack, but desperate times...
                    runInAction(() => { self.active = isMarkActive(view.state, self.markType); });
                }
            };
        }
    });
}

/**
 * Is the given mark active in the given editor state's selection set?
 * @param {EditorState} state
 * @param {MarkType} markType
 * @returns {boolean}
 */
function isMarkActive(state, markType) {
    const { from, $from, to, empty } = state.selection;
    if (empty) return markType.isInSet(state.storedMarks || $from.marks()) != null;
    return state.doc.rangeHasMark(from, to, markType);
}

const prefix = os.type() === 'Darwin' ? 'cmd' : 'ctrl';

const BoldButton = new FormattingButton({
    markType: chatSchema.marks.strong,
    label: `${prefix}-b`,
    onClick: toggleMark(chatSchema.marks.strong)
});

const ItalicButton = new FormattingButton({
    markType: chatSchema.marks.em,
    label: `${prefix}-i`,
    onClick: toggleMark(chatSchema.marks.em)
});

const StrikeButton = new FormattingButton({
    markType: chatSchema.marks.strike,
    label: `${prefix}-5`,
    onClick: toggleMark(chatSchema.marks.strike)
});

module.exports = {
    BoldButton,
    ItalicButton,
    StrikeButton
};
