import React from 'react';
import { observer } from 'mobx-react';
import { Switch } from 'peer-ui';
import uiStore from '~/stores/ui-store';

@observer
class Dev extends React.Component {
    onPrereleaseChange(ev) {
        uiStore.sharedPrefs.prereleaseUpdatesEnabled = ev.target.checked;
    }

    render() {
        return (
            <div>
                <section>
                    <Switch
                        checked={uiStore.sharedPrefs.prereleaseUpdatesEnabled}
                        label="Enable pre-release updates (requires app restart)"
                        onChange={this.onPrereleaseChange}
                    />
                </section>
            </div>
        );
    }
}

export default Dev;
