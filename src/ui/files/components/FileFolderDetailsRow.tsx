import React from 'react';
import { observer } from 'mobx-react';
import { User, t } from 'peerio-icebear';
import moment from 'moment';

import { File, FileFolder } from 'peerio-icebear/dist/models';

type FileFolderDetailsRowProps =
    | {
          file: File;
      }
    | {
          folder: FileFolder;
      };

const isFileRow = (props: FileFolderDetailsRowProps): props is { file: File } =>
    (props as any).file != null;

@observer
export default class FileFolderDetailsRow extends React.Component<FileFolderDetailsRowProps> {
    render() {
        let owner: string;
        let timeStamp: string;
        if (isFileRow(this.props)) {
            owner = this.props.file.fileOwner;
            timeStamp = moment(this.props.file.uploadedAt).format('ll');
        } else {
            owner = this.props.folder.owner;
            timeStamp = moment(this.props.folder.createdAt).format('ll');
        }

        return (
            <div className="file-folder-details-row">
                <span className="owner">
                    {owner === User.current.username ? `${t('title_you')}` : owner}
                </span>
                <span className="updated-date">{timeStamp}</span>
            </div>
        );
    }
}
