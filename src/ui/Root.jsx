const React = require('react');
const AutoUpdateDialog = require('./AutoUpdateDialog');
const languageStore = require('../stores/language-store');
const { reaction } = require('mobx');
const deepForceUpdate = require('react-deep-force-update');
const isDevEnv = require('../helpers/is-dev-env');
const Interweave = require('interweave').default;
const EmojiMatcher = require('interweave/matchers/Emoji').default;
const UrlMatcher = require('interweave/matchers/Url').default;
const EmailMatcher = require('interweave/matchers/Email').default;
// const {setStringReplacement} = require('peerio-translator');

class Root extends React.Component {

    constructor() {
        super();
        // setStringReplacement('Peerio', 'Expandoo');
        languageStore.loadSavedLanguage();
        this.onLanguageChange = reaction(
            () => languageStore.language,
            () => {
                deepForceUpdate(this);
            }
        );
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
        Interweave.addMatcher(
            new EmojiMatcher('emoji', { convertShortName: true, convertUnicode: true })
        );
        Interweave.addMatcher(new UrlMatcher('url'));
        Interweave.addMatcher(new EmailMatcher('email'));
        Interweave.configure({ emojiPath: '../node_modules/emojione/assets/png/{{hexcode}}.png' });
    }


    componentWillUnmount() {
        this.onLanguageChange();
    }

    render() {
        return (
            <div>
                {this.props.children}
                <AutoUpdateDialog />
                {this.devtools}
            </div>
        );
    }
}

Root.propTypes = {
    children: React.PropTypes.element.isRequired
};

module.exports = Root;
