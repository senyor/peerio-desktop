// @ts-check

/*
 * See documentation for the Suggestions plugin for discussion of this component
 * structure.
 */

const React = require('react');
const { observable, action, runInAction } = require('mobx');
const { observer } = require('mobx-react');
const css = require('classnames');
const { Plugin } = require('prosemirror-state');
const { isEmpty } = require('~/helpers/chat/prosemirror/chat-schema');

class FormattingToolbar {
    @observable enabled = false;

    @action.bound
    plugin(doc) {
        const self = this;
        self.enabled = !isEmpty(doc);
        return new Plugin({
            view() {
                return {
                    update({ state: newState }) {
                        runInAction(() => {
                            self.enabled = !isEmpty(newState.doc);
                        });
                    }
                };
            }
        });
    }

    Component = observer(props => {
        const { enabled } = this;

        return (
            <div
                className={css('formatting-toolbar', {
                    'formatting-toolbar-visible': enabled
                })}
            >
                {props.children}
            </div>
        );
    });
}

module.exports = FormattingToolbar;
