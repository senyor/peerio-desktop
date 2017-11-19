// @ts-check
const { Plugin } = require('prosemirror-state');

const MAX_MATCH = 500;

/**
 * Like ProseMirror's provided inputRules plugin, but doesn't support the use of the
 * "undoInputRule" command. Either the rule is applied, or the input is undone.
 */
function ensuredInputRules(/** @type {{ rules : any[] }} */{ rules }) {
    return new Plugin({
        props: {
            handleTextInput(view, from, to, text) {
                const { state } = view;
                const $from = state.doc.resolve(from);
                const textBefore = $from.parent.textBetween(
                    Math.max(0, $from.parentOffset - MAX_MATCH),
                    $from.parentOffset,
                    null, '\ufffc'
                ) + text;

                for (let i = 0; i < rules.length; i++) {
                    const match = rules[i].match.exec(textBefore);
                    if (match) {
                        const tr = rules[i].handler(state, match, from - (match[0].length - text.length), to);
                        if (tr) {
                            view.dispatch(tr);
                            return true;
                        }
                    }
                }
                return false;
            }
        }
    });
}

module.exports = { ensuredInputRules };
