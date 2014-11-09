require([
    'application',
    'handlebars',
    'libs/i18n',
    'apps/Example/Example'
], function (App, Handlebars, i18n) {
    'use strict';

    //I18N Helper.
    Handlebars.registerHelper('i18n',
        function (str) {
            if (typeof str === 'string') {
                return (i18n !== undefined ? i18n.t(str) : str);
            }
            return 'can\'t translate this.';
        });

    App.start();

    return App;
});