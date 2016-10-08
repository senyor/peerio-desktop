// @flow
const React = require('react');
//eslint-disable-next-line
class App extends React.Component {
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
