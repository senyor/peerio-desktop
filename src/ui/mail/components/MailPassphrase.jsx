const React = require('react');
const { Tooltip, IconButton } = require('~/react-toolbox');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');

const TooltipIcon = Tooltip()(IconButton); //eslint-disable-line

@observer class MailPassphrase extends React.Component {

    copyPassphrase = () => {
        const range = document.createRange();
        const selection = document.getSelection();
        selection.removeAllRanges();
        range.selectNode(this.passphrase);
        selection.addRange(range);
        document.execCommand('copy');
        selection.removeAllRanges();
    };

    render() {
        return (
            <div>
                <p>{t('ghost_passphraseExplanation')}</p>
                <div className="dark-label">{t('ghost_passphrase')}</div>
                <div className="passphrase">
                    <span ref={(pp) => { this.passphrase = pp; }}>{ this.props.ghost.passphrase }</span>
                    <TooltipIcon
                        tooltip="copy"
                        tooltipDelay={500}
                        tooltipPosition="bottom"
                        icon="content_copy"
                        onClick={this.copyPassphrase} />
                </div>
            </div>
        );
    }
}

module.exports = MailPassphrase;
