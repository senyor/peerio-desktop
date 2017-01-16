const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { Tab, Tabs } = require('~/react-toolbox');

@observer class Settings extends React.Component {
    @observable index = 0;

    componentWillMount() {
        if (this.index === 0) {
            window.router.push('/app/settings/profile');
        }
    }
    handleTabChange = (index) => {
        this.index = index;
        this.index === 1 ?
            window.router.push('/app/settings/preferences') :
            window.router.push('/app/settings/security');
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
                          // TODO remove style tag. Move into settings.scss
                          // TODO look into css grid
                          style={{ width: '1024px' }}
                          className="tabs">
                        {/* <Tab label="Profile"> Profile content</Tab> */}
                        <Tab label="Profile">
                            {this.props.children}
                        </Tab>
                        <Tab label="Security">
                            {this.props.children}
                        </Tab>
                        <Tab label="Preferences">
                            {this.props.children}
                        </Tab>
                    </Tabs>
                </div>
            </div>
        );
    }
}

module.exports = Settings;
