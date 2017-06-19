const React = require('react');
// const AutoUpdateDialog = require('~/ui/AutoUpdateDialog');
const languageStore = require('~/stores/language-store');
const deepForceUpdate = require('react-deep-force-update');
const isDevEnv = require('~/helpers/is-dev-env');
const config = require('~/config');
const { setStringReplacement } = require('peerio-translator');
const theme = require('~/react-toolbox/theme.js');
const ThemeProvider = require('react-toolbox/lib/ThemeProvider').default;
const { ProgressBar, Button } = require('~/react-toolbox');
const DropTarget = require('./shared-components/DropTarget');
const { ipcRenderer } = require('electron');
const { socket, clientApp, chatStore, warnings } = require('~/icebear');
const { computed, reaction, observable } = require('mobx');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const SystemWarningDialog = require('~/ui/shared-components/SystemWarningDialog');
const Snackbar = require('~/ui/shared-components/Snackbar');
const routerStore = require('~/stores/router-store');
const appState = require('~/stores/app-state');

@observer
class Root extends React.Component {

    @computed get snackbarVisible() {
        return !routerStore.currentRoute.startsWith(routerStore.ROUTES.chats);
    }

    @observable showOfflineNotification = false;

    constructor() {
        super();

        // replace config-specific strings
        config.translator.stringReplacements.forEach((replacementObject) => {
            setStringReplacement(replacementObject.original, replacementObject.replacement);
        });
        // UI language handling
        languageStore.loadSavedLanguage();
        this.onLanguageChange = reaction(
            () => languageStore.language,
            () => {
                deepForceUpdate(this);
            }
        );
        // events from main process
        ipcRenderer.on('warning', (ev, key) => warnings.add(key));
        ipcRenderer.on('update-will-restart', () => {
            alert(t('title_updateWillRestart'));
            ipcRenderer.send('install-update');
        });
        ipcRenderer.on('console_log', (ev, arg) => console.log(arg));

        reaction(() => socket.connected, (connected) => {
            if (connected) {
                this.showOfflineNotification = false;
                return;
            }
            setTimeout(() => {
                this.showOfflineNotification = !socket.connected;
            }, 5000);
        }, { fireImmediately: true });

        // Dev tools ---------->
        this.devtools = null;
        if (isDevEnv) {
            const MobxTools = require('mobx-react-devtools').default; //eslint-disable-line
            this.devtools = null;// <MobxTools />;
            window.hideMobxTools = () => {
                this.devtools = null;
                this.forceUpdate();
            };
            window.showMobxTools = () => {
                this.devtools = <MobxTools />;
                this.forceUpdate();
            };
        }
        // <--------- Dev tools
    }

    componentWillMount() {
        clientApp.isFocused = appState.isFocused;
        reaction(() => appState.isFocused, (focused) => {
            clientApp.isFocused = focused;
        });
    }

    componentWillUnmount() {
        this.onLanguageChange();
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <div>
                    <div className={`status-bar ${this.showOfflineNotification ? 'visible' : ''}`}>

                        {/* don't let invisible svg to always run */}
                        {this.showOfflineNotification ? <ProgressBar type="circular" mode="indeterminate" /> : null}
                        #{socket.reconnectAttempt}&nbsp;{t('error_connecting')}&nbsp;
                        {socket.reconnectTimer.counter}&nbsp;
                        {<Button className="reconnect" flat inverse label={t('button_retry')}
                            onClick={socket.resetReconnectTimer} />}
                    </div>
                    {this.props.children}

                    {/* <AutoUpdateDialog />*/}
                    {this.devtools}
                    {this.snackbarVisible ? <Snackbar /> : null}
                    <SystemWarningDialog />
                    <DropTarget />
                </div>
            </ThemeProvider>
        );
    }
}

module.exports = Root;
