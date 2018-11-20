import React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';

import { User, socket } from 'peerio-icebear';
import { Button, Chip, Divider, Menu, MenuItem, Dropdown } from 'peer-ui';

import languageStore from '~/stores/language-store';

@observer
export default class DevTools extends React.Component {
    @observable menuActive = false;

    @action.bound
    toggleMenu() {
        this.menuActive = !this.menuActive;
    }

    @action.bound
    hideMenu() {
        this.menuActive = false;
    }

    quit() {
        if (User.current) {
            window.router.push('/app/chats');
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
                <div className="top-bar">
                    <Menu icon="menu" className="menu" position="top-left">
                        <MenuItem
                            icon="dashboard"
                            caption="Dashboard"
                            onClick={this.gotoDashboard}
                        />
                        <MenuItem
                            icon="grid_on"
                            caption="Keg Editor"
                            onClick={this.gotoKegEditor}
                        />
                        <Divider />
                        <MenuItem icon="close" caption="Close" onClick={this.quit} />
                    </Menu>
                    <div className="separator" />
                    <Dropdown
                        label="Language"
                        options={[
                            // There's no list of available languages yet.
                            { value: 'en', label: 'English' },
                            { value: 'pseudo', label: 'Pseudo' }
                        ]}
                        onChange={val => languageStore.changeLanguage(val)}
                        value={languageStore.language}
                    />
                    <div className="separator" />
                    {socket.connected ? (
                        <Chip className="good-bg">connected</Chip>
                    ) : (
                        <Chip className="bad-bg">disconnected</Chip>
                    )}
                    {socket.authenticated ? (
                        <Chip className="good-bg">authenticated</Chip>
                    ) : (
                        <Chip className="bad-bg">not authenticated</Chip>
                    )}
                    <div className="separator" />
                    <Button icon="close" onClick={this.quit} />
                </div>
                {this.props.children}
            </div>
        );
    }
}
