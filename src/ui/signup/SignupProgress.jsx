const React = require('react');
const { Component } = require('react');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const T = require('~/ui/shared-components/T');

@observer class SignupProgress extends Component {
    render() {
        const { step, count } = this.props;
        const items = [];
        for (let i = 1; i <= count; ++i) {
            const current = i === step ? <div className="current-step" /> : null;
            items.push(<div key={`step_${i}`} className="signup-step">{current}</div>);
            (i < count) && items.push(<div key={`divider_${i}`} className="signup-step-divider" />);
        }
        return (
            <div className="signup-step-header">
                <div className="signup-step-title">{this.props.title}</div>
                <div className="signup-step-indicator">
                    {items}
                </div>
            </div>
        );
    }
}

module.exports = SignupProgress;
