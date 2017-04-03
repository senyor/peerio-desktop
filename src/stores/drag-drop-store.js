const { observable } = require('mobx');
const { User } = require('~/icebear');

class DragDropStore {
    @observable hovering;
    @observable hoveringFileCount = 0;
    _counter = 0;
    _subscribers = [];

    _onEnter = (ev) => {
        ev.preventDefault();
        if (!User.current || !ev.dataTransfer.files.length) return;
        this._counter++;
        if (this._counter === 1) {
            this.hovering = true;
            this.hoveringFileCount = ev.dataTransfer.files.length;
        }
    };

    _onLeave = (ev) => {
        ev.preventDefault();
        if (!User.current || !ev.dataTransfer.files.length) return;
        if (this._counter > 0) this._counter--;
        if (this._counter === 0) this.hovering = false;
    };

    _onDrop = (ev) => {
        ev.preventDefault();
        if (!User.current) return;
        this._counter = 0;
        this.hovering = false;
        this.hoveringFileCount = 0;
        const files = [];
        for (let i = 0; i < ev.dataTransfer.files.length; i++) {
            files.push(ev.dataTransfer.files[i].path);
        }
        if (files.length && this._subscribers.length) {
            this._subscribers.forEach(handler => { handler(files); });
        }
    };

    _onOver = (ev) => {
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
