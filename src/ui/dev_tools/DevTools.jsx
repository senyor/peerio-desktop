const React = require('react');

class DevTools extends React.Component {
    render() {
        return 'WOAH SO DEV TOOLS';
    }

    static open() {
        window.router.push('/dev-tools');
    }
}


module.exports = DevTools;
