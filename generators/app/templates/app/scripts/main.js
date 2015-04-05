require([
    'application',
    'handlebars'<% if (i18n) { %>,
    'libs/i18n'<% } %><% if (example) { %>,
    'apps/Example/Example'<% } %>
], function (App, Handlebars<% if (i18n) { %>, i18n<% } %>) {
    'use strict';
<% if (i18n) { %>
    //I18N Helper.
    Handlebars.registerHelper('i18n',
        function (str) {
            if (typeof str === 'string') {
                return (i18n !== undefined ? i18n.t(str) : str);
            }
            return 'can\'t translate this.';
        });
<% } %>

    App.start();

    return App;
});