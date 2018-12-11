import React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';
import css from 'classnames';

import { User, t } from 'peerio-icebear';
import { Button } from 'peer-ui';

import appState from '~/stores/app-state';
import routerStore from '~/stores/router-store';

const buttons = computed(() =>
    [
        {
            route: 'profile',
            label: 'title_settingsProfile',
            className: css('profile', {
                'tab-notify': !User.current.primaryAddressConfirmed
            })
        },
        {
            route: 'security',
            label: 'title_settingsSecurity'
        },
        {
            route: 'prefs',
            label: 'title_settingsPreferences'
        },
        {
            route: 'account',
            label: 'title_settingsAccount'
        },
        {
            route: 'about',
            label: 'title_About'
        },
        {
            route: 'help',
            label: 'title_help'
        },
        appState.devModeEnabled
            ? {
                  route: 'devSettings',
                  label: 'dev settings'
              }
            : null
    ].filter(b => b)
);

@observer
export default class Settings extends React.Component {
    render() {
        return (
            <div className="settings">
                <div className="tab-wrapper">
                    <div className="headline">{t('title_settings')}</div>
                    <div className="tabs">
                        {buttons.get().map(button => (
                            <Button
                                key={button.label}
                                label={t(button.label as any)}
                                className={button.className || button.route}
                                disabled={
                                    routerStore.currentRoute === routerStore.ROUTES[button.route]
                                }
                                onClick={() => {
                                    routerStore.navigateTo(routerStore.ROUTES[button.route]);
                                }}
                                theme="secondary"
                            />
                        ))}
                    </div>
                </div>
                {this.props.children}
            </div>
        );
    }
}
