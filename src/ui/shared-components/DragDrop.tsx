import React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import _ from 'lodash';

import { User } from 'peerio-icebear';

import { getFileTree, getFileList, FileTree, FileList } from '~/helpers/file';

interface DragDropStoreProps {
    onDrop: (list: FileList, trees: FileTree[]) => void;
    children: (props: { hovering: boolean; preparingForUpload: boolean }) => JSX.Element;
}

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// There's currently a bug in electron that has broken the normal flow of this component
// https://github.com/electron/electron/issues/9840
// Some features have been disabled here and in DropTarget.jsx
// until it's fixed
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

@observer
export default class DragDrop extends React.Component<DragDropStoreProps> {
    @observable preparingForUpload = false;
    @observable hovering = false;
    @observable hoveringFileCount = 0;
    @observable hoveringFileSize = 0;

    protected _counter = 0;
    // protected _hoveringFiles = null;

    componentDidMount() {
        window.addEventListener('drop', this._onWindowDrop, false);
        window.addEventListener('dragenter', this._onWindowEnter, false);
        window.addEventListener('dragleave', this._onWindowLeave, false);
        window.addEventListener('dragover', this._onWindowOver, false);
    }

    componentWillUnmount() {
        window.removeEventListener('drop', this._onWindowDrop, false);
        window.removeEventListener('dragenter', this._onWindowEnter, false);
        window.removeEventListener('dragleave', this._onWindowLeave, false);
        window.removeEventListener('dragover', this._onWindowOver, false);
    }

    @action.bound
    _onWindowEnter(ev: DragEvent) {
        // console.log('enter', this._counter, ev.dataTransfer.files.length);
        ev.preventDefault();

        // if (!User.current || !ev.dataTransfer.files.length) return;
        // restore this line ^ after bug is fixed in electron
        if (
            !User.current ||
            !ev.dataTransfer.items.length ||
            Array.prototype.slice.call(ev.dataTransfer.items).filter(it => it.kind === 'file')
                .length === 0
        ) {
            return;
        }
        // remove this condition ^ after electron bug is fixed
        this._counter++;
        if (this._counter === 1) {
            // let list = Array.prototype.slice.call(ev.dataTransfer.files);
            // list = list.map(this._extractPath).map(getFileTree);  // TODO: getFileTree is now async
            // console.debug(`Hovering ${list.success.length} files of ${list.successBytes} bytes`);
            this.hovering = true;
            // this.hoveringFileCount = list.success.length;
            // this.hoveringFileSize = list.successBytes;
            // this._hoveringFiles = list;
        }
    }

    @action.bound
    _onWindowLeave(ev: DragEvent) {
        //  console.log('leave', this._counter, ev.dataTransfer.files.length);
        ev.preventDefault();
        if (this._counter > 0) this._counter--;
        if (this._counter === 0) {
            this.hovering = false;
            this.hoveringFileCount = 0;
            this.hoveringFileSize = 0;
        }
    }

    @action.bound
    async _onWindowDrop(ev: DragEvent) {
        // console.log('drop', this._counter, ev.dataTransfer.files.length);
        ev.preventDefault();
        if (!User.current) return;
        this._counter = 0;
        this.hovering = false;
        this.hoveringFileCount = 0;
        this.hoveringFileSize = 0;
        this.preparingForUpload = true;
        try {
            const paths = [...ev.dataTransfer.files].map(file => file.path);

            const list = await getFileList(paths);
            const trees: FileTree[] = [];

            for (let i = 0; i < paths.length; i++) {
                trees.push(await getFileTree(paths[i]));
            }

            _.remove(trees, item => !item);

            this.props.onDrop(list, trees);
        } finally {
            this.preparingForUpload = false;
        }
    }

    _onWindowOver = (ev: DragEvent) => {
        // console.log('over', this._counter, ev.dataTransfer.files.length);
        ev.preventDefault();
        // if (!User.current || !ev.dataTransfer.files.length) {
        // restore this line ^ after electron bug is fixed
        if (
            !User.current ||
            !ev.dataTransfer.items.length ||
            Array.prototype.slice.call(ev.dataTransfer.items).filter(it => it.kind === 'file')
                .length === 0
        ) {
            // remove these two lines ^ after electron bug is fixed
            ev.dataTransfer.dropEffect = 'none';
            ev.dataTransfer.effectAllowed = 'none';
        } else {
            ev.dataTransfer.dropEffect = 'copy';
            ev.dataTransfer.effectAllowed = 'copy';
        }
    };

    render() {
        const { hovering, preparingForUpload } = this;
        return this.props.children({ hovering, preparingForUpload });
    }
}
