const React = require('react');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const { warnings } = require('~./icebear');
const WarningDisplayBase = require('./WarningDisplayBase');
const css = require('classnames');

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
                    {w ? t(w.content, w.data) : ''}
                </div>
            </div>
        );
    }
}

module.exports = Snackbar;
