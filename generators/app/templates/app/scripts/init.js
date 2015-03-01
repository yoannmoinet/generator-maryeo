require.config({
    deps: [
        'backbone.marionette',
        'libs/localStoragePoly',
        <% if (bootstrap) { %>'bootstrap',<% } %>
        'main'
    ],
    shim: {
        'backbone.marionette': {
            deps: ['backbone']
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },<% if (bootstrap) { %>
        bootstrap: {
            deps: ['jquery'],
            exports: '$'
        },
        <% } %>underscore: {
            exports: '_'
        }
    },
    paths: {
        application: 'apps/_root/Application',
        jquery: './bower/jquery/jquery',
        backbone: './bower/backbone/backbone',
        underscore: './bower/underscore/underscore',
        almond: './bower/almond/almond',
        <% if (bootstrap) { %>bootstrap: './bower/sass-bootstrap/dist/js/bootstrap',<% } %>

        /* alias all marionette libs */
        'backbone.marionette': './bower/backbone.marionette/lib/core/backbone.marionette',
        'backbone.wreqr': './bower/backbone.wreqr/lib/backbone.wreqr',
        'backbone.radio': './bower/backbone.radio/build/backbone.radio',
        'backbone.babysitter': './bower/backbone.babysitter/lib/backbone.babysitter',

        text: './bower/requirejs-plugins/lib/text',
        json: './bower/requirejs-plugins/src/json',

        /* handlebars from the require handlerbars plugin below */
        handlebars: './bower/handlebars/handlebars',
        'handlebars-compiler': './bower/requirejs-hbs/example/assets/lib/handlebars-runtime'
    },
    packages: [{
        name: 'hbs',
        location: './bower/requirejs-hbs',
        compilerPath: './bower/requirejs-hbs/example/assets/lib/handlebars-runtime',
        main: 'hbs'
    }]
});