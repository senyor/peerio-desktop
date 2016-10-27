const React = require('react');
const { Layout } = require('react-toolbox');
const AppNav = require('../components/AppNav');

class App extends React.Component {

    render() {
        return (
            <Layout className="rt-light-theme">
                <AppNav/>
                {this.props.children}
            </Layout>
        );
    }
}


module.exports = App;
