const { observable, action } = require('mobx');
const { setLocale } = require('peerio-translator');
const normalizeError = require('~/icebear').errors.normalize;
const db = require('~/icebear').TinyDb;
const { PhraseDictionaryCollection } = require('~/icebear');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const electron = require('electron').remote || require('electron');

class LanguageStore {
    @observable language = '';

    constructor() {
        this.changeLanguage = this.changeLanguage.bind(this);
    }
    // this is just a reference object (for language names)
    languages = {
        en: 'English',
        cs: 'Čeština',
        'zh-CN': '汉语',
        de: 'Deutsch',
        es: 'Español',
        fr: 'Francais',
        it: 'Italiano',
        ja: '日本語',
        hu: 'Magyar',
        'nb-NO': 'Norsk (Bokmål)',
        'pt-BR': 'Português (Brasileiro)',
        ru: 'Русский',
        tr: 'Türkçe'
    };
    // ui
    translationLangs = ['en', 'cs', 'zh-CN', 'de', 'es', 'fr', 'it', 'ja', 'hu', 'nb-NO', 'pt-BR', 'ru', 'tr'];
    // passphrases
    dictionaryLangs = ['en', 'cs', 'zh-CN', 'de', 'es', 'fr', 'it', 'ja', 'hu', 'nb-NO', 'pt-BR', 'ru', 'tr'];

    get translationLangsDataSource() {
        if (!this._translationLangsCache) {
            this._translationLangsCache = this.translationLangs.map(code => {
                return { value: code, label: this.languages[code] };
            });
        }
        return this._translationLangsCache;
    }

    get dictionaryLangsDataSource() {
        if (!this._dictionaryLangsCache) {
            this._dictionaryLangsCache = this.dictionaryLangs.map(code => {
                return { value: code, label: this.languages[code] };
            });
        }
        return this._dictionaryLangsCache;
    }

    buildDictionary() {
        const txtPath = path.join(
            electron.app.getAppPath(),
            `/build/static/locales/dict/${this.language}.txt`);
        const dict = fs.readFileSync(txtPath, 'utf8');
        PhraseDictionaryCollection.addDictionary(this.language, dict);
        PhraseDictionaryCollection.selectDictionary(this.language);
    }

    @action changeLanguage(code) {
        try {
            const jsonPath = path.join(
                electron.app.getAppPath(),
                `/build/static/locales/${code.replace('-', '_')}.json`);
            const translation = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
            setLocale(code, translation);
            this.language = code;
            // save to local storage
            db.system.setValue('language', code);
            // load correct passphrase dictionary
            this.buildDictionary();
            // set locale for dates
            moment.locale(code);
            console.log(`Language changed to ${code}`);
        } catch (err) {
            console.error(`Failed switch language to: ${code} ${normalizeError(err)}`);
        }
    }

    @action loadSavedLanguage() {
        db.system.getValue('language')
            .then(lang => this.changeLanguage(lang || 'en'));
    }
}


module.exports = new LanguageStore();
