const React = require('react');
const { observer } = require('mobx-react');
const { TooltipIconButton } = require('~/react-toolbox');
const { User } = require('peerio-icebear');

@observer
class UsageCloud extends React.Component {
    render() {
        const cloudFillPercent = 22 + (79 - 22) * (User.current.fileQuotaUsedPercent / 100);
        return (
            <div className="usage">
                <TooltipIconButton style={{
                    position: 'absolute',
                    clipPath: `polygon(0 0, ${cloudFillPercent}% 0, ${cloudFillPercent}% 100%, 0% 100%)`
                }} icon="cloud" />
                <TooltipIconButton
                    onClick={this.props.onClick}
                    tooltip={`${User.current.fileQuotaUsedFmt} / ${User.current.fileQuotaTotalFmt}`}
                    tooltipPosition="right"
                    icon="cloud_queue" />
                <div>{User.current.fileQuotaUsedPercent}%</div>
            </div>
        );
    }
}

module.exports = UsageCloud;
