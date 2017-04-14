const React = require('react');
// const AutoUpdateDialog = require('~/ui/AutoUpdateDialog');
const languageStore = require('~/stores/language-store');
const { reaction } = require('mobx');
const deepForceUpdate = require('react-deep-force-update');
const isDevEnv = require('~/helpers/is-dev-env');
const config = require('~/config');
const { setStringReplacement } = require('peerio-translator');
const theme = require('~/react-toolbox/theme.js');
const ThemeProvider = require('react-toolbox/lib/ThemeProvider').default;
const { ProgressBar } = require('~/react-toolbox');
const DropTarget = require('./shared-components/DropTarget');
const { ipcRenderer } = require('electron');
const { socket } = require('~/icebear');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');
const SystemWarningDialog = require('~/ui/shared-components/SystemWarningDialog');


@observer
class Root extends React.Component {

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
        // updater
        ipcRenderer.on('updater', console.log.bind(console));
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


    componentWillUnmount() {
        this.onLanguageChange();
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <div>
                    <div className={`status-bar ${socket.connected ? '' : 'visible'}`}>
                        {socket.connected ? null : <ProgressBar type="circular" mode="indeterminate" />}
                        {t('connecting')}
                    </div>
                    {this.props.children}
                    {/* <AutoUpdateDialog />*/}
                    {this.devtools}
                    <DropTarget />
                    <SystemWarningDialog />
                </div>
            </ThemeProvider>
        );
    }
}

Root.propTypes = {
    children: React.PropTypes.element.isRequired
};

module.exports = Root;
