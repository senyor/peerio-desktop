const React = require('react');
const { Dialog } = require('~/react-toolbox');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const { warnings } = require('~/icebear');
const WarningDisplayBase = require('./WarningDisplayBase');

@observer
class SystemWarningDialog extends WarningDisplayBase {
    constructor() {
        super('severe');
    }

    render() {
        const w = warnings.current;

        return (
            <Dialog className="dialog-warning"
                active={this.isVisible}
                title={w ? t(w.title) : ''}
                actions={[{ label: t('button_ok'), onClick: this.dismiss }]}>
                {w ? t(w.content, w.data) : ''}
            </Dialog>
        );
    }

}

module.exports = SystemWarningDialog;
