const React = require('react');
const languageStore = require('../stores/language-store');
const { reaction } = require('mobx');
const { setLocale } = require('../icebear');  // eslint-disable-line

class App extends React.Component {

    constructor() {
        super();
        languageStore.language = 'en';
        this.languageChangeReaction = reaction(
            () => languageStore.language,
            () => { this.forceUpdate(); }
        );
    }

    componentWillUnmount() {
        this.languageChagneReaction();
    }

    render() {
        return (
          <div>
            {this.props.children}
          </div>
     );
    }
}

App.propTypes = {
    children: React.PropTypes.element.isRequired
};

module.exports = App;
