const React = require('react');
const AutoUpdateDialog = require('../components/AutoUpdateDialog');
const languageStore = require('../stores/language-store');
const { reaction } = require('mobx');

class App extends React.Component {

    constructor() {
        super();
        languageStore.loadSavedLanguage();
        this.onLanguageChange = reaction(
            () => languageStore.language,
            () => {
                this.forceUpdate();
            }
        );
    }

    componentWillUnmount() {
        this.onLanguageChange();
    }

    render() {
        return (
            <div>
                {this.props.children}
                <AutoUpdateDialog />
            </div>
        );
    }
}

App.propTypes = {
    children: React.PropTypes.element.isRequired
};

module.exports = App;
