// @ts-check

/*
 * See documentation for the Suggestions plugin for discussion of this component
 * structure.
 */

const React = require('react');
const { observable, runInAction } = require('mobx');
const { observer } = require('mobx-react');
const css = require('classnames');
const { Plugin } = require('prosemirror-state');
const { isEmpty } = require('~/helpers/chat/prosemirror/chat-schema');


class FormattingToolbar {
    @observable
    enabled = false;

    constructor() {
        this.plugin = makePlugin(this);
    }

    Component = observer((props) => {
        const { enabled } = this;

        return (<div
            className={css('formatting-toolbar', { 'formatting-toolbar-visible': enabled })}
        >
            {props.children}
        </div>);
    });
}

function makePlugin(/** @type {FormattingToolbar} */self) {
    return new Plugin({
        view() {
            return {
                update({ state }) {
                    runInAction(() => { self.enabled = !isEmpty(state.doc); });
                }
            };
        }
    });
}

module.exports = FormattingToolbar;
