const React = require('react');
const store = require('~/stores/drag-drop-store');
const { observer } = require('mobx-react');
const { FontIcon } = require('~/react-toolbox');

@observer
class DropTarget extends React.Component {
    render() {
        if (!store.hovering) return null;
        return (
            <div className="global-drop-target">
                <div className="drop-content">
                    <FontIcon value="cloud_upload" />
                    <div>
                        Drop {store.hoveringFileCount} files to upload
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = DropTarget;
