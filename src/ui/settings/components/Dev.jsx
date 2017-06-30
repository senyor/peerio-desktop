const React = require('react');
const { observer } = require('mobx-react');
const { Switch } = require('~/react-toolbox');
const uiStore = require('~/stores/ui-store');

@observer
class Dev extends React.Component {
    onPrereleaseChange = (value) => {
        uiStore.sharedPrefs.prereleaseUpdatesEnabled = value;
    };
    render() {
        return (
            <div>
                <section>
                    <Switch checked={uiStore.sharedPrefs.prereleaseUpdatesEnabled}
                        label="Enable pre-release updates (requires app restart)"
                        onChange={this.onPrereleaseChange} />
                </section>
            </div>
        );
    }
}

module.exports = Dev;
