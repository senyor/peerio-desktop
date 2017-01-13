const React = require('react');
const { observable, autorunAsync } = require('mobx');
const { observer } = require('mobx-react');
const { Button, IconButton, Tooltip, IconMenu, MenuItem, MenuDivider, Dialog, Tab, Tabs } = require('~/react-toolbox');
const { User, contactStore, chatStore } = require('~/icebear');
const css = require('classnames');
const app = require('electron').remote.app;
const sounds = require('~/helpers/sounds');
const appControl = require('~/helpers/app-control');


@observer class Settings extends React.Component {
    @observable index = 0;

    handleTabChange = (index) => {
        this.index = index;
    };
    render() {
        return (
            <div className="flex-row flex-justify-center settings">
                <Tabs index={this.index}
                      onChange={this.handleTabChange}
                      style={{ width: '1024px' }}
                      className="tabs">
                    {/* <Tab label="Profile"> Profile content</Tab> */}
                    <Tab label="Security">
                        <div>
                            <div className="title" style={{ margin: '32px 0 40px' }}>Device Password
                                <Button label="update" flat primary />
                            </div>

                            <div className="title">Two factor authentication (2FA)
                                <Button label="activate" flat primary />
                            </div>
                        </div>
                    </Tab>
                    <Tab label="Preferences"> Preferences content</Tab>
                </Tabs>
            </div>
        );
    }
}

module.exports = Settings;
