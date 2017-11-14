// @ts-check
const { Plugin } = require('prosemirror-state');
const { Node } = require('prosemirror-model'); // eslint-disable-line no-unused-vars, (for typechecking)

/**
 * A ProseMirror plugin that applies a CSS class to the editor view when the document is empty, as well as a
 * `data-placeholder` attribute containing the placeholder text.
 *
 * If you need to update the placeholder text, you can call `EditorState.reconfigure` with a new placeholder plugin.
 *
 * @param {string} text The placeholder text.
 * @param {Node} emptyState If the document state is equal to this state, the editor will be considered empty.
 * @param {string} [emptyClassName] The CSS class to apply to the editor view when the document is empty.
 */
function placeholder(text, emptyState, emptyClassName = 'ProseMirror-empty') {
    const placeholderPlugin = new Plugin({
        view(editorView) {
            // @ts-ignore (dom typed as Element instead of HTMLElement)
            editorView.dom.dataset.placeholder = text;
            if (editorView.state.doc.eq(emptyState)) {
                editorView.dom.classList.add(emptyClassName);
            }

            return {
                update(view) {
                    if (view.state.doc.eq(emptyState)) view.dom.classList.add(emptyClassName);
                    else view.dom.classList.remove(emptyClassName);
                },
                destroy() {
                    if (editorView && editorView.dom) {
                        editorView.dom.classList.remove(emptyClassName);
                        // @ts-ignore (dom typed as Element instead of HTMLElement)
                        delete editorView.dom.dataset.placeholder;
                    }
                }
            };
        }
    });

    return placeholderPlugin;
}

module.exports = {
    placeholder
};
