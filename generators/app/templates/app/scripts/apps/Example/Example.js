define(function (require) {
    'use strict';
    // Require the application.
    var App = require('application');
    // The Hub.
    var Hub = require('libs/hub');
    // And the view(s).
    var ExampleView = require('apps/Example/views/ExampleView');
<% if (i18n) { %>
    // Locales of the subApp
    var en = require('json!apps/Example/locales/en.json');
    var fr = require('json!apps/Example/locales/fr.json');
    var i18n = require('libs/i18n');

    //Register locales
    i18n.addLocales('en', en);
    i18n.addLocales('fr', fr);
<% } %>

    // Declare the new module, and attach it to the solution.
    App.module('Example', {
        startWithParent: false,
        define: function (Example, App, Backbone, Marionette, $, _) {
            // Define the controller which will respond to the router.
            Example.Controller = Marionette.Controller.extend({
                index: function (args) {
                    if (Example.view) {
                        Example.view.destroy();
                    }
                    Example.view = new ExampleView.View();
                    // Show the view.
                    Hub.command('show', Example.view);
                },
                changeLang: function () {
                    if (Example.view) {
                        Example.view.render();
                    }
                },
                example: function (args) {
                    if (Example.view) {
                        Example.view.destroy();
                    }
                    Example.view = new ExampleView.ExampleView();
                    // Show the view.
                    Hub.command('show', Example.view);
                }
            });

            // Define the initializer.
            Example.addInitializer(function (args) {
                // The controller.
                Example.controller = new Example.Controller();
                <% if (i18n) { %>
                // Listent to lang changes
                Hub.on('change:lang', this.controller.changeLang);
                <% } %>
            });

            // When our subApp closes, we clean.
            Example.addFinalizer(function () {
                if (Example.controller) {
                    Example.controller.destroy();
                    delete Example.controller;
                }
                if (Example.view) {
                    Example.view.destroy();
                    delete Example.view;
                }
            });
        }
    });

    // Routes.
    App.Example.routes = [{
        '': 'index'
    }, {
        'example': 'example'
    }];

    //Register our new subApp once the App is ready.
    App.ready.done(function () {
        Hub.command('createSubApp', App.Example);
    });

    return App.Example;
});