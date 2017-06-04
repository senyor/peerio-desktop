const React = require('react');
const Croppie = require('croppie');
const { IconButton, Button } = require('~/react-toolbox');
const { t } = require('peerio-translator');

class AvatarEditor extends React.Component {
    initCroppie = (el) => {
        if (!el) {
            if (this.croppie) this.croppie.destroy();
            return;
        }
        this.croppie = new Croppie(el, {
            url: this.props.file,
            boundary: { width: 420, height: 420 },
            viewport: { width: 350, height: 350, type: 'square' },
            enableOrientation: true
        });
    }
    rotateLeft = () => {
        this.croppie.rotate(-90);
    };
    rotateRight = () => {
        this.croppie.rotate(90);
    };

    handleSave = () => {
        // 224x224
        // 64x64
        // 40x40
        // 20x20
        const opts = { type: 'blob', size: { width: 350, height: 350 }, format: 'png', quality: 1, circle: false };
        const blobs = [];
        this.croppie.result(opts)
            .then(blob => {
                blobs.push(blob);
                opts.size = { width: 64, height: 64 };
                return this.croppie.result(opts);
            })
            .then(blob => {
                blobs.push(blob);
                opts.size = { width: 40, height: 40 };
                return this.croppie.result(opts);
            })
            .then(blob => {
                blobs.push(blob);
                opts.size = { width: 20, height: 20 };
                return this.croppie.result(opts);
            })
            .then(blob => {
                blobs.push(blob);
                this.props.onSave(blobs);
            });
    };
    handleCancel = () => {
        this.props.onClose();
    };
    render() {
        return (<div className="flex-row flex-align-center flex-jusify-between">
            <div ref={this.initCroppie} />
            <div style={{ width: '100%' }}>
                <IconButton style={{ zoom: 1.6 }} icon="rotate_left" onClick={this.rotateLeft} accent />
                <IconButton style={{ zoom: 1.6 }} icon="rotate_right" onClick={this.rotateRight} accent />
                <br />
                <br />
                <Button icon="save" label={t('button_save')} flat onClick={this.handleSave} />
                <br />
                <Button icon="cancel" label={t('button_cancel')} flat onClick={this.handleCancel} />
            </div>
        </div>);
    }

}

module.exports = AvatarEditor;
