const { observable, action } = require('mobx');
const { setLocale } = require('peerio-translator');
const normalizeError = require('~/icebear').errors.normalize;
const db = require('~/stores/tiny-db');
const fs = require('fs');
const path = require('path');
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

    @action changeLanguage(code) {
        try {
            const jsonPath = path.join(
                electron.app.getAppPath(),
                `/build/static/locales/${code.replace('-', '_')}.json`);
            const translation = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
            setLocale(code, translation);
            this.language = code;
            db.set('language', code);
            console.log(`Language changed to ${code}`);
        } catch (err) {
            console.error(`Failed switch language to: ${code} ${normalizeError(err)}`);
        }
    }

    @action loadSavedLanguage() {
        const lang = db.get('language');
        this.changeLanguage(lang || 'en');
    }
}


module.exports = new LanguageStore();
