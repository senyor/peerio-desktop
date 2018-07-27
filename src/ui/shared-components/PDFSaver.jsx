const React = require('react');
const electron = require('electron').remote;
const fs = require('fs');

const style = { display: 'inline-flex', width: 0, height: 0, flex: '0 1' };

// Props:
// template  - path to html file (pdf template)
//
//
class PDFSaver extends React.Component {
    handler = null;

    setWebViewRef = ref => {
        this.webViewRef = ref;
    };

    /**
     * Initiates PDF save (user still needs to accept).
     * @param {?Object} templateVars - key-value(string) object to fill template placeholders with data.
     *                                 It will take elements by html id and replace innerHTML with value provided.
     * @memberof PDFSaver
     */
    save = (templateVars, defaultPath) => {
        if (this.handler)
            throw new Error(
                'PDFSaver#save is called again before previous call is finished'
            );
        this.handler = () => this._transformTemplate(templateVars, defaultPath);
        this.webViewRef.addEventListener('dom-ready', this.handler);
        this.webViewRef.reload();
    };

    _transformTemplate = (templateVars, defaultPath) => {
        this.webViewRef.removeEventListener('dom-ready', this.handler);
        this.handler = null;
        let js = '';
        if (templateVars) {
            for (const key in templateVars) {
                js += `document.getElementById('${key}').innerHTML = '${templateVars[
                    key
                ] || ''}';\n`;
            }
        }
        this.webViewRef.executeJavaScript(js, true, () => {
            const win = electron.getCurrentWindow();
            electron.dialog.showSaveDialog(
                win,
                { defaultPath },
                this._printToPdf
            );
        });
    };

    _printToPdf = filePath => {
        if (!filePath) return;
        this.webViewRef.printToPDF(
            { printBackground: true, landscape: false },
            (er, data) => {
                fs.writeFileSync(filePath, data);
            }
        );
    };

    render() {
        return (
            <webview
                ref={this.setWebViewRef}
                src={this.props.template}
                style={style}
            />
        );
    }
}

module.exports = PDFSaver;
