const { observable, action } = require('mobx');
const { User } = require('~/icebear');
const { getListOfFiles } = require('~/helpers/file');

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// There's currently a bug in electron that has broken the normal flow of this store
// https://github.com/electron/electron/issues/9840
// Some features have been disabled here and in DropTarget.jsx
// until it's fixed
// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
class DragDropStore {
    @observable hovering;
    @observable hoveringFileCount = 0;
    @observable hoveringFileSize = 0;
    _counter = 0;
    _subscribers = [];
    _hoveringFiles = null;

    _extractPath(dropFile) {
        return dropFile.path;
    }
    @action.bound _onEnter(ev) {
        // console.log('enter', this._counter, ev.dataTransfer.files.length);

        ev.preventDefault();

        // if (!User.current || !ev.dataTransfer.files.length) return;
        // restore this line ^ after bug is fixed in electron
        if (!User.current || !ev.dataTransfer.items.length ||
            Array.prototype.slice.call(ev.dataTransfer.items).filter(it => it.kind === 'file').length === 0) {
            return;
        }
        // remove this condition ^ after electron bug is fixed
        this._counter++;
        if (this._counter === 1) {
            let list = Array.prototype.slice.call(ev.dataTransfer.files);
            list = getListOfFiles(list.map(this._extractPath));
            // console.debug(`Hovering ${list.success.length} files of ${list.successBytes} bytes`);
            this.hovering = true;
            this.hoveringFileCount = list.success.length;
            this.hoveringFileSize = list.successBytes;
            this._hoveringFiles = list;
        }
    }

    _onLeave = (ev) => {
        //  console.log('leave', this._counter, ev.dataTransfer.files.length);
        ev.preventDefault();
        if (this._counter > 0) this._counter--;
        if (this._counter === 0) {
            this.hovering = false;
            this.hoveringFileCount = 0;
            this.hoveringFileSize = 0;
        }
    };

    _onDrop = (ev) => {
        // console.log('drop', this._counter, ev.dataTransfer.files.length);
        ev.preventDefault();
        if (!User.current) return;
        this._counter = 0;
        this.hovering = false;
        this.hoveringFileCount = 0;
        this.hoveringFileSize = 0;
        if (this._subscribers.length) {
            // this._subscribers.forEach(handler => { handler(this._hoveringFiles); });
            // restore this line ^ after electron bug is fixed
            this._subscribers.forEach(handler => { handler(getListOfFiles(Array.prototype.slice.call(ev.dataTransfer.files).map(this._extractPath))); });
            // remove this line ^ after electron bug is fixed
        }
    };

    _onOver = (ev) => {
        // console.log('over', this._counter, ev.dataTransfer.files.length);
        ev.preventDefault();
        // if (!User.current || !ev.dataTransfer.files.length) {
        // restore this line ^ after electron bug is fixed
        if (!User.current || !ev.dataTransfer.items.length ||
            Array.prototype.slice.call(ev.dataTransfer.items).filter(it => it.kind === 'file').length === 0) {
            // remove these two lines ^ after electron bug is fixed
            ev.dataTransfer.dropEffect = 'none';
            ev.dataTransfer.effectAllowed = 'none';
        } else {
            ev.dataTransfer.dropEffect = 'copy';
            ev.dataTransfer.effectAllowed = 'copy';
        }
    }

    /**
     * Subscribe handler to files dropped event
     * @param {Function<Array<string>>} handler
     */
    onFilesDropped(handler) {
        if (!this._subscribers.includes(handler)) this._subscribers.push(handler);
    }
}

const store = new DragDropStore();
window.addEventListener('drop', store._onDrop, false);
window.addEventListener('dragenter', store._onEnter, false);
window.addEventListener('dragleave', store._onLeave, false);
window.addEventListener('dragover', store._onOver, false);

module.exports = store;
