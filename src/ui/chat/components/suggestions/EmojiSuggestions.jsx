// @ts-check
const React = require('react');
const Suggestions = require('./Suggestions');
const { emojiByAllShortnames, pngFolder } = require('~/helpers/chat/emoji');
const { chatSchema } = require('~/helpers/chat/prosemirror/chat-schema');

const { EditorView } = require('prosemirror-view'); // eslint-disable-line no-unused-vars, (for typechecking)
const { Node } = require('prosemirror-model'); // eslint-disable-line no-unused-vars, (for typechecking)


const shortnames = Object.keys(emojiByAllShortnames);

/**
 * @param {() => EditorView} getView
 */
function makeEmojiSuggestions(getView) {
    return new Suggestions({
        // Match (but don't include) the start of the input, or any kind of
        // whitespace, or the unicode object replacement character (which we use
        // in the Suggestions to replace leaf nodes that don't contain text),
        // then the start of an emoji shortname (a colon and two or more
        // characters.)
        matchers: [/(?<=^|\s|\u{fffc})(:[a-zA-Z0-9_+]{2,})$/u],
        source(matchData) {
            // TODO: use emoji index or split shortname by "_" instead of startsWith; maybe selecta-style matching?
            return shortnames
                .filter(name => name.startsWith(matchData.match[1].toLowerCase()))
                .map(name => ({ emoji: emojiByAllShortnames[name], name }));
        },
        formatter: data => (
            <span>
                <img
                    className="emojione"
                    alt={data.emoji.characters}
                    src={`${pngFolder}${data.emoji.unicode}.png`}
                    style={{ marginRight: 8 }}
                />
                {data.name}
            </span>
        ),
        keySource: 'name',
        onAcceptSuggestion: (matchData, acceptedSuggestion) => {
            const view = getView();
            if (view) {
                view.dispatch(view.state.tr.replaceWith(
                    matchData.from,
                    matchData.to,
                    chatSchema.node('emoji', { shortname: acceptedSuggestion.emoji.shortname })
                ));
            }
        }
    });
}

module.exports = makeEmojiSuggestions;
