const React = require('react');
const L = require('l.js');
const { fileStore } = require('~/icebear');
const { FontIcon, ProgressBar } = require('~/react-toolbox');
const { downloadFile } = require('~/helpers/file');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');

@observer
class InlineFiles extends React.Component {
    download(ev) {
        const attr = ev.currentTarget.attributes['data-id'];
        if (!attr) return;
        const file = fileStore.getById(attr.value);
        if (!file || file.downloading) return;
        downloadFile(file);
        L.info(ev.currentTarget.attributes['data-id'].value);
    }
    render() {
        if (!this.props.files.map) return null;
        return (
            <div className="inline-files">
                {
                    this.props.files.map(f => {
                        const file = fileStore.getById(f);
                        if (!file) return <div className="invalid-file" key={f}>{t('error_fileRemoved')}</div>;
                        return (<div className="shared-file" key={f} data-id={f} onClick={this.download}>
                            <div className="flex-row flex-align-center">
                                <div className="file-name"> {file ? file.name : f}</div>
                                <FontIcon value="file_download" />
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
