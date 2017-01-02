const React = require('react');
const AppNav = require('~/ui/AppNav');
const Snackbar = require('~/ui/shared-components/Snackbar');

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
