import Keys from "./langKeys.js";

class Lang {
    constructor() {
        this.currentLang = "en";

        this._supportedLanguages = ["de", "en"];
    }

    /**
     * Returns the translation for the current language for a lang key
     *
     * @param {String} key The lang key
     * @param {String} value A value to replace placeholders with
     *
     * @return Locale of the key in current language or a string indicating that
     *         key or translation for this key does not exist in current language
     */
    get(key, value) {
        let locale;

        if (!Keys[key]) {
            return `Unknown key ${key}`;
        }

        locale = Keys[key][this.currentLang] ||
                 `Missing translation for ${key} in language ${this.currentLang}!`;

        if (value) {
            locale = locale.replace("<X>", value);
        }

        return locale;
    }

    /**
     * Set the current language to use
     */
    setLang(lang) {
        if (this.getSupportedLanguages().indexOf(lang) === -1) {
            throw new Error(`Lang: "${lang}" is not a supported language!`);
        }
        this.currentLang = lang;
    }

    /**
     * Get the current language
     */
    getLang() {
        return this.currentLang;
    }

    /**
     * Get all supported languages
     */
    getSupportedLanguages() {
        return this._supportedLanguages;
    }
}

export default new Lang();
