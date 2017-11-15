// @ts-check

/** @type {{
        byCanonicalShortname : { [shortname : string] : Emoji }
        byAllShortnames : { [shortname : string] : string }
        byAscii : { [ascii : string] : string }
        byCategory : { [category : string] : string[] }
    }} */
// @ts-ignore (doesn't recognize json files)
const emojiJson = require('~/static/emoji/emoji.json');


const pngFolder = './static/emoji/png/';


/**
 * @typedef {Object} Emoji
 * @property {string} name eg. "face with tears of joy"
 * @property {string} category
 * @property {string} shortname eg. ":joy:"
 * @property {string} index concatenation of names/shortnames/aliases for filtering in the picker
 * @property {string} aliases additional shortnames, as a string separated by double-spaces,
                              for use in the picker to show hints
 * @property {string} ascii ascii sequence aliases for the emoji, as a string separated by double-spaces,
 *                          for use in the picker to show hints
 * @property {string} filename the path to the png image for this emoji
 * @property {string} characters emoji string, as fully-qualified ready-to-use characters
 * @property {string} className the CSS classname
 */

/**
 * @typedef {Object} EmojiMap
 * @property {Emoji[]} people
 * @property {Emoji[]} nature
 * @property {Emoji[]} food
 * @property {Emoji[]} activity
 * @property {Emoji[]} travel
 * @property {Emoji[]} objects
 * @property {Emoji[]} symbols
 * @property {Emoji[]} flags
 */

/**
 * The original categories from the processed emoji data. Note that the dynamic
 * "recent" category in the emoji picker component is not included here.
 * @type {{ id : keyof EmojiMap, name : string  }[]}
 */
const emojiCategories = [
    { id: 'people', name: 'Smileys & People' },
    { id: 'nature', name: 'Animals & Nature' },
    { id: 'food', name: 'Food & Drink' },
    { id: 'activity', name: 'Activity' },
    { id: 'travel', name: 'Travel & Places' },
    { id: 'objects', name: 'Objects' },
    { id: 'symbols', name: 'Symbols' },
    { id: 'flags', name: 'Flags' }
];


/**
 * Maps a _unique_ shortname to each emoji; no aliases (alternate shortnames) are included in this object.
 * @type {{ [shortname : string] : Emoji}}
 */
const emojiByCanonicalShortname = emojiJson.byCanonicalShortname;

// -----------------
// byCanonicalShortname has all the emoji data, but everything else in the JSON file has to be denormalized.
Object.values(emojiJson.byCategory).forEach(emojiList => {
    for (let i = 0; i < emojiList.length; i++) {
        // @ts-ignore (assigning a new type)
        emojiList[i] = emojiByCanonicalShortname[emojiList[i]];
    }
});

Object.keys(emojiJson.byAllShortnames).forEach(alias => {
    // @ts-ignore (assigning a new type)
    emojiJson.byAllShortnames[alias] = emojiByCanonicalShortname[emojiJson.byAllShortnames[alias]];
});

Object.keys(emojiJson.byAscii).forEach(ascii => {
    // @ts-ignore (assigning a new type)
    emojiJson.byAscii[ascii] = emojiByCanonicalShortname[emojiJson.byAscii[ascii]];
});
// -----------------


/**
 * Maps categories to arrays of emoji.
 * @type {EmojiMap}
 */
// @ts-ignore (assigning the new type to the denormalized data)
const emojiByCategories = emojiJson.byCategory;

/**
 * Maps _all_ shortnames (including aliases) to emoji. Useful for completions and lookups.
 * @type {{ [shortname : string] : Emoji }}
 */
// @ts-ignore (assigning the new type to the denormalized data)
const emojiByAllShortnames = emojiJson.byAllShortnames;

/**
 * Maps _all_ shortnames (including aliases) to emoji. Useful for completions and lookups.
 * @type {{ [ascii : string] : Emoji }}
 */
// @ts-ignore (assigning the new type to the denormalized data)
const emojiByAsciiSequences = emojiJson.byAscii;

module.exports = {
    emojiByCanonicalShortname,
    emojiByAllShortnames,
    emojiByAsciiSequences,
    emojiByCategories,
    emojiCategories,
    pngFolder
};
