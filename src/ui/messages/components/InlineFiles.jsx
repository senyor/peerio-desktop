const React = require('react');
const { fileStore } = require('~/icebear');
const { FontIcon, ProgressBar } = require('~/react-toolbox');
const { downloadFile } = require('~/helpers/file');
const { observer } = require('mobx-react');

@observer
class InlineFiles extends React.Component {
    download(ev) {
        const attr = ev.currentTarget.attributes['data-id'];
        if (!attr) return;
        const file = fileStore.getById(attr.value);
        if (!file || file.downloading) return;
        downloadFile(file);
        console.log(ev.currentTarget.attributes['data-id'].value);
    }
    render() {
        if (!this.props.files.map) return null;
        return (
            <div className="inline-files">
                {
                    this.props.files.map(f => {
                        const file = fileStore.getById(f);
                        if (!file) return <div className="invalid-file" key={f}>invalid file record</div>;
                        return (<div className="file" key={f} data-id={f} onClick={this.download}>
                            <div className="flex-row flex-align-center">
                                <FontIcon value="file_download" /> {file ? file.name : f}
                            </div>

                            {file.downloading
                                ? <ProgressBar type="linear" mode="determinate" value={file.progress}
                                               max={file.progressMax} />
                                : null
                            }
                        </div>);
                    })
                }
            </div>
        );
    }
}

module.exports = InlineFiles;
