const React = require('react');
const { observer } = require('mobx-react');
const { warnings } = require('~./icebear');
const WarningDisplayBase = require('./WarningDisplayBase');
const css = require('classnames');
const T = require('~/ui/shared-components/T');

@observer
class Snackbar extends WarningDisplayBase {
    constructor() {
        super('medium');
    }

    render() {
        const w = warnings.current;
        return (
            <div className={css(this.props.className, 'snackbar-wrapper', { show: this.isVisible })}
                onClick={this.dismiss}>
                <div className="snackbar">
                    {w ? <T k={w.content}>{w.data}</T> : null}
                </div>
            </div>
        );
    }
}

module.exports = Snackbar;
