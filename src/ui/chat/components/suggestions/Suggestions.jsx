// @ts-check

/*

This class is slightly strange -- you'll notice it's not a React component, but
it wraps one. We need to share some mutable state between the suggestions we're
rendering via React and the ProseMirror view, and after a few failed attempts to
make this sensible (as just a plugin that creates its own DOM elements for the
suggestions list, or as a React component that takes the ProseMirror view and
mutates its plugins on mount/unmount) this seems like the least clunky solution.

Consumers should use the 'plugin' and 'Component' fields instances of this class
exposes and mount them as a ProseMirror plugin and in the React rendering
hierarchy, respectively, and call 'cleanup' when unmounting.

*/

const React = require('react');
const {
    observable,
    autorun,
    action,
    computed,
    runInAction
} = require('mobx');
const { observer } = require('mobx-react');
const { Plugin } = require('prosemirror-state');

const { ResolvedPos } = require('prosemirror-model'); // eslint-disable-line no-unused-vars, (for typechecking)

/**
 * The maximum amount of leading text (before the cursor) we'll check when
 * matching against the suggestions regexes.
 */
const MATCH_BEFORE = 100; // TODO: consider making tunable in Suggestions constuctor


/**
 * @typedef MatchData
 *
 * @property {RegExpMatchArray} match
 *
 * @property {number} from
 *
 * @property {number} to
 *
 */

/**
 * @typedef SuggestionsConfig
 *
 * @property {RegExp[]} matchers Regular expressions against which the input
 * will be tested to see if we have a token for matching against our
 * suggestion source. The capture group is allowed to match an empty string.
 *
 * @property {(matchData : MatchData) => any[]} source Given an object with
 * a match from one of our matchers, return the actual object we can use in
 * the suggestions component.
 *
 * @property {(match : any) => string | JSX.Element} formatter Given the
 * object returned from our suggestions source, return a JSX element or
 * string formatted for display in our suggestions list.
 *
 * @property {string} keySource key of our returned object that we should
 * use when mapping the suggestion results in the React component.
 *
 * @property { (matchData : MatchData, acceptedSuggestion : any) => any } onAcceptSuggestion
 */


class Suggestions {
    @observable
    selectedIndex = 0;

    /** @type {MatchData | null} */
    @observable.shallow
    matchData = null;

    /* FIXME/TS: this class should be generic:
       'any'/'any[]' should be 'T'/'T[]', keySource should be 'keyof T'.
    */

    /**
     * @param {SuggestionsConfig} config
     */
    constructor(config) {
        const { matchers, source, formatter, keySource, onAcceptSuggestion } = config;
        this.matchers = matchers;
        this.source = source;
        this.formatter = formatter;
        this.keySource = keySource;
        this.onAcceptSuggestion = onAcceptSuggestion;

        this.plugin = makePlugin(this);

        this.disposer = autorun(() => {
            // Our selected index should always be in range.
            if (this.suggestions && this.suggestions.length > 0) {
                this.selectedIndex = Math.min(this.selectedIndex, this.suggestions.length - 1);
            }

            /** @type {any} */
            const el = document.querySelector(`.suggests>.suggest-item:nth-of-type(${this.selectedIndex + 1})`);
            if (el) el.scrollIntoViewIfNeeded(true);
        });
    }

    cleanup = () => {
        if (this.disposer) this.disposer();
    }

    @computed
    get visible() {
        return this.suggestions !== null;
    }

    // Three states:
    // null             => don't show
    // []               => "no suggestions."
    // [...suggestions] => render suggestions
    @computed
    get suggestions() {
        if (this.matchData == null) return null;
        return this.source(this.matchData);
    }

    @action.bound
    dismiss() {
        this.matchData = null;
    }

    @action.bound
    acceptSuggestion() {
        if (this.matchData && this.suggestions.length > 0) {
            this.onAcceptSuggestion(this.matchData, this.suggestions[this.selectedIndex]);
        }
        this.dismiss();
    }

    Component = observer(() => {
        if (!this.visible) return null;

        return (
            <div className="suggests-wrapper">
                <div className="suggests">
                    {this.suggestions.length === 0
                        ? <div className="suggest-item">No suggestions.</div>
                        : this.suggestions.map((s, i) => {
                            return (
                                <div
                                    className={`suggest-item ${i === this.selectedIndex ? 'selected' : ''}`}
                                    key={s[this.keySource]}
                                    onMouseDown={this.acceptSuggestion}
                                    onMouseOver={action(() => { this.selectedIndex = i; })}
                                >
                                    {this.formatter(s)}
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    });
}

function makePlugin(/** @type {Suggestions} */self) {
    return new Plugin({
        props: {
            handleKeyDown(view, ev) {
                switch (ev.key) {
                    case 'ArrowDown':
                        if (self.visible && self.suggestions.length > 0) {
                            runInAction(() => {
                                self.selectedIndex += 1;
                                if (self.selectedIndex >= self.suggestions.length) {
                                    self.selectedIndex = 0;
                                }
                            });
                            return true;
                        }
                        return false;
                    case 'ArrowUp':
                        if (self.visible && self.suggestions.length > 0) {
                            runInAction(() => {
                                self.selectedIndex -= 1;
                                if (self.selectedIndex < 0) {
                                    self.selectedIndex = self.suggestions.length - 1;
                                }
                            });
                            return true;
                        }
                        return false;
                    case 'Escape':
                        if (self.visible) {
                            self.dismiss();
                            return true;
                        }
                        return false;
                    case 'Enter':
                    case 'Tab':
                        if (self.visible && self.suggestions.length > 0) {
                            self.acceptSuggestion();
                            return true;
                        }
                        return false;
                    default:
                        return false;
                }
            }
        },
        view() {
            return {
                // It's important that we either update or remove the match data
                // whenever the doc changes: our match data contains document
                // positions, which will become invalid/stale if they stick
                // around when the doc is changed.
                update(view, lastState) {
                    const state = view.state;

                    if (lastState && lastState.doc.eq(state.doc)) {
                        // For any state update where the selection changed but the
                        // doc didn't, we want to dismiss the autocomplete. This
                        // should handle cases like moving the cursor left/right,
                        // clicking around, etc. without having to enumerate them
                        // manually in keydown/click handlers.
                        if (!lastState.selection.eq(state.selection)) {
                            self.dismiss();
                        }

                        // Regardless of whether the selection changed, if the
                        // doc hasn't changed nothing else here applies.
                        return;
                    }


                    // FIXME/TS: cast selection as TextSelection here instead of using index notation hack
                    /** @type {ResolvedPos} */
                    const cursor = view.state.selection['$cursor']; // eslint-disable-line dot-notation
                    if (cursor) {
                        // Adapted from logic in https://github.com/ProseMirror/prosemirror-inputrules
                        const textBefore = cursor.parent.textBetween(
                            Math.max(0, cursor.parentOffset - MATCH_BEFORE),
                            cursor.parentOffset,
                            null,
                            '\ufffc' // unicode object replacement character
                        );

                        for (let i = 0; i < self.matchers.length; i++) {
                            const match = self.matchers[i].exec(textBefore);

                            if (match) {
                                self.matchData = { match, from: cursor.pos - match[0].length, to: cursor.pos };
                                return;
                            }
                        }
                    }

                    // If the doc changed but our selection isn't a cursor OR we
                    // didn't match anything, dismiss the matches.
                    self.dismiss();
                }
            };
        }
    });
}

module.exports = Suggestions;
