const React = require('react');
const { observer } = require('mobx-react');
const { computed } = require('mobx');
const { warnings, warningStates } = require('~/icebear');

@observer
class WarningDisplayBase extends React.Component {
    @computed get isVisible() {
        const w = warnings.current;
        return !!(w && w.level === this.level && w.state === warningStates.SHOWING);
    }

    constructor(level) {
        super();
        this.level = level;
    }


    dismiss = () => {
        warnings.current.dismiss();
    }
}

module.exports = WarningDisplayBase;
