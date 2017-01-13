const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { Switch } = require('~/react-toolbox');

@observer class Preferences extends React.Component {

    render() {
        return (
            <div>
                <section className="section-divider">
                    <div className="title">Notifications</div>
                    <p>Email you when ...</p>
                    <Switch checked="true" label="Never" />
                    <Switch checked="false" label="You receive a new message" />
                    <Switch checked="false" label="You receive a new file" />
                    <Switch checked="false" label="You receive a contact request" />
                </section>

                <section>
                    <div className="title">Privacy</div>
                    <p>Other users can find you ...</p>
                    <Switch checked="true" label="Never" />
                    <Switch checked="false" label="By name" />
                    <Switch checked="false" label="By username" />
                    <Switch checked="false" label="By email" />
                </section>
            </div>
        );
    }
  }

module.exports = Preferences;
