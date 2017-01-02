const React = require('react');
const { AppBar, Menu, MenuItem, MenuDivider, FontIcon, Chip } = require('react-toolbox');
const { User, socket, util } = require('~/icebear');
const { observable } = require('mobx');
const { observer } = require('mobx-react');

@observer
class DevTools extends React.Component {
    @observable menuActive = false;
    toggleMenu = () => {
        this.menuActive = !this.menuActive;
    };
    hideMenu = () => {
        this.menuActive = false;
    };
    quit() {
        if (User.current) {
            window.router.push('/app');
        } else {
            window.router.push('/');
        }
    }
    gotoDashboard() {
        window.router.push('/dev-tools');
    }
    gotoKegEditor() {
        window.router.push('/dev-tools/kegs');
    }

    render() {
        return (
            <div className="dev-tools-root">
                <link key="dev_tools_style" rel="stylesheet" href="./dev-tools-style.css" />
                <AppBar fixed leftIcon="menu" rightIcon="close" title="Developer tools"
                        onLeftIconClick={this.toggleMenu} onRightIconClick={this.quit}>
                    <Menu className="menu" position="topLeft" menuRipple active={this.menuActive}
                          onHide={this.hideMenu}>
                        <MenuItem icon="dashboard" caption="Dashboard" onClick={this.gotoDashboard} />
                        <MenuItem icon="grid_on" caption="Keg Editor" onClick={this.gotoKegEditor} />
                        <MenuDivider />
                        <MenuItem icon="close" caption="Close" onClick={this.quit} />
                    </Menu>
                    <FontIcon value="file_upload" /> {util.formatBytes(socket.bytesSent)}&nbsp;&nbsp;&nbsp;
                    <FontIcon value="file_download" /> {util.formatBytes(socket.bytesReceived)}
                    <div className="separator" />
                    {
                        socket.connected
                            ? <Chip className="good-bg">connected</Chip>
                            : <Chip className="bad-bg">disconnected</Chip>
                    }
                    {
                        socket.authenticated
                            ? <Chip className="good-bg">authenticated</Chip>
                            : <Chip className="bad-bg">not authenticated</Chip>
                    }
                    <div className="separator" />
                </AppBar>
                {this.props.children}
            </div>
        );
    }

}


module.exports = DevTools;
