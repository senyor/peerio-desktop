import React from 'react';

export interface FileBeaconContextProps {
    firstReceivedFileId: string;
    firstListedFileId: string;
}

export const FileBeaconContext = React.createContext<FileBeaconContextProps>({
    firstListedFileId: '',
    firstReceivedFileId: ''
});
