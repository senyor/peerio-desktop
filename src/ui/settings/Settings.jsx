const React = require('react');
const { observable, autorunAsync } = require('mobx');
const { observer } = require('mobx-react');
const { Button, IconButton, Tooltip, IconMenu, MenuItem, MenuDivider, Dialog, Tab, Tabs } = require('~/react-toolbox');
const { User, contactStore, chatStore } = require('~/icebear');
const css = require('classnames');
const app = require('electron').remote.app;
const sounds = require('~/helpers/sounds');
const appControl = require('~/helpers/app-control');
const SecuritySettings = require('./components/SecuritySettings');
const Preferences = require('./components/Preferences');

@observer class Settings extends React.Component {
    @observable index = 0;

    handleTabChange = (index) => {
        this.index = index;
    };
    render() {
        return (
            <div className="flex-row flex-justify-center settings">
                <div>
                    <div className="headline">
                        {/* <IconButton value="back" /> */}
                        Settings
                    </div>
                    <Tabs index={this.index}
                          onChange={this.handleTabChange}
                          style={{ width: '1024px' }}
                          className="tabs">
                        {/* <Tab label="Profile"> Profile content</Tab> */}
                        <Tab label="Security">
                            <SecuritySettings />
                        </Tab>
                        <Tab label="Preferences">
                            <Preferences />
                        </Tab>
                    </Tabs>
                </div>
            </div>
        );
    }
}

module.exports = Settings;
