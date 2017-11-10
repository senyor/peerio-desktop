// @ts-check
const { Plugin } = require('prosemirror-state');
const { DOMParser } = require('prosemirror-model');
const cheerio = require('cheerio');
const debounce = require('lodash/debounce');

const { chatSchema } = require('~/helpers/chat/prosemirror/chat-schema');
const { emojiByAllShortnames } = require('~/helpers/chat/emoji');
const emojione = require('~/static/emoji/emojione');


const parser = DOMParser.fromSchema(chatSchema);

/**
 * This plugin replaces emoji in three separate cases:
 * - when input from an emoji keyboard or other IME that supports unicode (in
 *   the handleTextInput method below)
 * - when pasted from a plaintext source (via clipboardTextParser method)
 * - when pasted from an HTML source (via transformPastedHTML method).
 *
 * The latter two don't attempt to override ProseMirror's DOM parsing or create
 * their own PM nodes -- instead they just manipulate the HTML string that's
 * passed to the parser.
 */
function emojiPlugin() {
    // ProseMirror's handleTextInput prop seems to always work with surrogate
    // halves, so an IME that inserts an emoji may call it twice or more with
    // meaningless characters each time.
    //
    // As a solution, we accumulate characters with a short debounce, and check
    // them all on the trailing edge.
    let charAccumulator;
    let _from;

    function resetCharacterCheck() {
        charAccumulator = '';
        _from = Number.MAX_VALUE;
    }
    resetCharacterCheck();

    // TODO: verify if we need a debounce time in any scenarios or if the
    // nextTick-like default behaviour is always sufficient.
    const checkCharacters = debounce(view => {
        const emoji = emojiByAllShortnames[emojione.toShort(charAccumulator)];
        if (emoji) {
            const state = view.state;
            view.dispatch(state.tr.replaceWith(
                _from,
                _from + charAccumulator.length,
                state.schema.node('emoji', { shortname: emoji.shortname })
            ));
        }

        resetCharacterCheck();
    });

    return new Plugin({
        props: {
            // Using Cheerio here is maybe not the most optimal solution, but it
            // works reliably and allows us to do a quick replacement on HTML
            // without worrying that we're eg. invalidating the HTML by replacing
            // inside an attribute value.
            transformPastedHTML(html) {
                // @ts-ignore bad typings
                const $ = cheerio.load(html);
                $('*').contents().filter((i, el) => el.type === 'text').each((i, el) => {
                    const wrapped = $(el);
                    // HACK: emojione.unicodeToImage() doesn't always recognize
                    // combined/composite emoji and will only replace the final
                    // character in the sequence (for example, this happens with
                    // "👨‍👩‍👧" as of emojione 3.1.2). but getting the
                    // shortname for the combined sequence works, so we convert
                    // to the image in two steps.
                    const replacement = emojione.shortnameToImage(emojione.toShort(wrapped.text()));
                    wrapped.replaceWith(replacement);
                });
                return $.html();
            },
            clipboardTextParser(text) {
                const dom = document.createElement('div');
                text.trim().split(/(?:\r\n?|\n)+/).forEach(block => {
                    // HACK: see note above about emojione.unicodeToImage.
                    const replaced = emojione.shortnameToImage(emojione.toShort(block));
                    dom.appendChild(document.createElement('p')).innerHTML = replaced;
                });
                return parser.parseSlice(dom);
            },
            // Handle unicode input directly from keyboard.
            handleTextInput(view, from, to, text) {
                charAccumulator += text;
                _from = Math.min(_from, from);
                checkCharacters(view);
                return false;
            }
        }
    });
}

module.exports = { emojiPlugin };
