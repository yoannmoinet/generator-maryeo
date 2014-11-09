define(function (require) {
    'use strict';
    var lng = 'en';

    var I18n = function () {
        this.lng = lng;
        this.string = {
            en: {},
            fr: {}
        };
        this.addLocales = function (lang, locales) {
            var i;

            if (this.string[lang] === undefined) {
                this.string[lang] = {};
            }

            for (i in locales) {
                if (locales.hasOwnProperty(i)) {
                    this.string[lang][i] = locales[i];
                }
            }
        };
        this.t = function (key) {
            if (this.string[this.lng]) {
                if (this.string[this.lng][key]) {
                    return this.string[this.lng][key];
                }
            }
            return key;
        };
    };

    return new I18n();
});
