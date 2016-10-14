/* eslint-disable */
const postcss = require('postcss');
const modules = require('postcss-modules');
const path = require('path');
const fs = require('fs');
const cp = require('child_process');
var writeFile = require('writefile')

const src = './node_modules/react-toolbox/lib/';
const dst = './build/react-toolbox/';
function getJSONFromCssModules(cssFileName, json) {
    //cssFileName = cssFileName.substring(cssFileName.indexOf('/lib/')+4);
    writeFile(`${cssFileName.substring(0, cssFileName.length - 4)}.json`, JSON.stringify(json));
}

function compile(file) {
    const css = fs.readFileSync(src + file);
    postcss([
        require('postcss-import')(),
        require('postcss-mixins')(),
        require('postcss-each')(),
        require('postcss-cssnext')(),
        modules({getJSON: getJSONFromCssModules, generateScopedName: '[name]_[local]_[hash:base64:5]', scopeBehaviour: 'local'}),
        require('precss')(),
        require('postcss-reporter')()
    ]).process(css, {
        from: src + file,
        to: dst + file
    }).then((result) => {
        return writeFile(dst + file, result.css);
    });
}[
    'commons.css',
    'animations/slide-left.css',
    'animations/slide-right.css',
    'animations/zoom-in.css',
    'animations/zoom-out.css',
    'app_bar/theme.css',
    'autocomplete/theme.css',
    'avatar/theme.css',
    'input/theme.css',
    'button/theme.css',
    'card/theme.css',
    'checkbox/theme.css',
    'chip/theme.css',
    'date_picker/theme.css',
    'dialog/theme.css',
    'drawer/theme.css',
    'dropdown/theme.css',
    'layout/theme.css',
    'link/theme.css',
    'list/theme.css',
    'menu/theme.css',
    'navigation/theme.css',
    'overlay/theme.css',
    'progress_bar/theme.css',
    'radio/theme.css',
    'ripple/theme.css',
    'slider/theme.css',
    'snackbar/theme.css',
    'switch/theme.css',
    'table/theme.css',
    'tabs/theme.css',
    'time_picker/theme.css',
    'tooltip/theme.css'
].forEach(f => compile(f));
