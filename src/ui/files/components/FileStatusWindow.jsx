const React = require('react');
const { observer } = require('mobx-react');

@observer
class FileStatusWindow extends React.Component {
    render() {
        return (
            <div className="file-status-window">
                <div className="title-bar">
                    "File status (43 files)"
                </div>
                test
            </div>
        );
    }
}

module.exports = FileStatusWindow;
