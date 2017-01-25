const React = require('react');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { Tab, Tabs } = require('~/react-toolbox');
const { t } = require('peerio-translator');

const url = ['/app/settings/profile', '/app/settings/security', '/app/settings/preferences'];

@observer class Settings extends React.Component {
    @observable index;

    handleTabChange = (index) => {
        this.index = index;
        window.router.push(url[index]);
    };

    handleRouteChange = () => {
        const currentLocation = window.router.getCurrentLocation();

        switch (currentLocation.pathname) {
            case '/app/settings/security':
                this.index = 1;
                break;
            case '/app/settings/preferences':
                this.index = 2;
                break;
            default:
                this.index = 0;
        }
    }
    componentWillMount() {
        this.handleRouteChange();
    }

    componentWillUpdate() {
        this.handleRouteChange();
    }

    render() {
        return (
            <div className="flex-row flex-justify-center settings">
                <div className="tab-wrapper">
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
                        <Tab label={t('profile')}>
                            {this.props.children}
                        </Tab>
                        <Tab label={t('security')}>
                            {this.props.children}
                        </Tab>
                        <Tab label={t('preferences')}>
                            {this.props.children}
                        </Tab>
                    </Tabs>
                </div>
            </div>
        );
    }
}

module.exports = Settings;
