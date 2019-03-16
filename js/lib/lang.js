import Keys from "./langKeys.js";

class Lang {
    constructor() {
        this.currentLang = "en";
    }

    /**
     * Returns the translation for the current language for a lang key
     *
     * @param {String} key The lang key
     *
     * @return Locale of the key in current language or a string indicating that
     *         key or translation for this key does not exist in current language
     */
    get(key) {
        if (!Keys[key]) {
            return `Unknown key ${key}`;
        }

        return Keys[key][this.currentLang] ||
               `Missing translation for ${key} in language ${this.currentLang}!`;
    }

    /**
     * Set the current language to use
     */
    setLang(lang) {
        this.currentLang = lang;
    }

    /**
     * Get the current language
     */
    getLang() {
        return this.currentLang;
    }
}

export default new Lang();
