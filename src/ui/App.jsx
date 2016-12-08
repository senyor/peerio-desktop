const React = require('react');
const AppNav = require('./AppNav');
const Snackbar = require('./shared-components/Snackbar');

class App extends React.Component {

    render() {
        return (
            <div className="flex-row app-root">
                <AppNav />
                {this.props.children}
                <Snackbar location="app" />
            </div>
        );
    }
}

module.exports = App;
