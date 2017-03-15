const React = require('react');
const AutoUpdateDialog = require('~/ui/AutoUpdateDialog');
const languageStore = require('~/stores/language-store');
const { reaction } = require('mobx');
const deepForceUpdate = require('react-deep-force-update');
const isDevEnv = require('~/helpers/is-dev-env');
const config = require('~/config');
const { setStringReplacement } = require('peerio-translator');
const theme = require('~/react-toolbox/theme.js');
const ThemeProvider = require('react-toolbox/lib/ThemeProvider').default;
const DropTarget = require('./shared-components/DropTarget');
const { ipcRenderer } = require('electron');

class Root extends React.Component {

    constructor() {
        super();

        // replace config-specific strings
        config.stringReplacements.forEach((replacementObject) => {
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
                    {this.props.children}
                    {/* <AutoUpdateDialog />*/}
                    {this.devtools}
                    <DropTarget />
                </div>
            </ThemeProvider>
        );
    }
}

Root.propTypes = {
    children: React.PropTypes.element.isRequired
};

module.exports = Root;
