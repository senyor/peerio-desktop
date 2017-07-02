const React = require('react');
const { fileStore } = require('~/icebear');
const { FontIcon, ProgressBar } = require('~/react-toolbox');
const { downloadFile } = require('~/helpers/file');
const { observable } = require('mobx');
const { observer } = require('mobx-react');
const { t } = require('peerio-translator');

// this is temporary, until we rework files
const gaveUpMap = {};

@observer
class InlineFiles extends React.Component {
    // give up waiting for file object to appear in store
    @observable giveUp = false;

    startTimer() {
        if (this.timer) return;
        this.timer = setTimeout(() => {
            this.giveUp = true;
            this.props.files.forEach(f => {
                if (gaveUpMap[f]) return;
                if (!fileStore.getById(f)) gaveUpMap[f] = true;
            });
        }, 10000);
    }

    componentWillUnmount() {
        if (this.timer) clearTimeout(this.timer);
    }

    download(ev) {
        const attr = ev.currentTarget.attributes['data-id'];
        if (!attr) return;
        const file = fileStore.getById(attr.value);
        if (!file || file.downloading) return;
        downloadFile(file);
    }

    render() {
        if (!this.props.files.map) return null;
        return (
            <div className="inline-files">
                {
                    this.props.files.map(f => {
                        const file = fileStore.getById(f);
                        if (!file) {
                            if (!gaveUpMap[f]) this.startTimer();
                            return (<div className="invalid-file" key={f}>
                                {t((this.giveUp || gaveUpMap[f]) ? 'error_fileRemoved' : 'title_processing')}
                                {this.giveUp || gaveUpMap[f]
                                    ? null
                                    : <ProgressBar type="linear" mode="indeterminate" />
                                }
                            </div>);
                        }
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
