const { observable, action } = require('mobx');
const { User } = require('~/icebear');
const { getListOfFiles } = require('~/helpers/file');

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
        if (!User.current || !ev.dataTransfer.files.length) return;
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
        if (!User.current || !ev.dataTransfer.files.length) return;
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
            this._subscribers.forEach(handler => { handler(this._hoveringFiles); });
        }
    };

    _onOver = (ev) => {
        // console.log('over', this._counter, ev.dataTransfer.files.length);
        ev.preventDefault();
        if (!User.current || !ev.dataTransfer.files.length) {
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
