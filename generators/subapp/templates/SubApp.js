define(function (require) {
    'use strict';

    var App = require('application');
    var Controller = require('apps/<%= subappname %>/Controller');
    <% if (collection) { %>var Collection = require('apps/<%= subappname %>/collections/Collection');<% } %>

    var config = require('json!apps/<%= subappname %>/config.json');

    var Hub = require('libs/hub');

    <% if (i18n) { %>var en = require('json!apps/<%= subappname %>/locales/en.json');
    var fr = require('json!apps/<%= subappname %>/locales/fr.json');

    var i18n = require('libs/i18n');

    i18n.addLocales('en', en);
    i18n.addLocales('fr', fr);
    <% } %>
    // Declare the new module, and attach it to the solution.
    App.module('<%= subappname %>', {
        startWithParent: false,
        define: function (<%= subappname %>, App, Backbone, Marionette, $, _) {
            // Define the initializer.
            <%= subappname %>.addInitializer(function (args) {
                var self = this;

                self.config = config;
                self.controller = new Controller();
                <% if (collection) { %>self.collection = new Collection();<% } %>
                <% if (i18n) { %>
                Hub.on('change:lang', self.controller.changeLang, self);<% } %>
            });

            // When our subApp closes, we clean.
            <%= subappname %>.addFinalizer(function () {
                if (<%= subappname %>.controller) {
                    <%= subappname %>.controller.destroy();
                    delete <%= subappname %>.controller;
                }
                <% if (collection) { %>if (<%= subappname %>.collection) {
                    delete <%= subappname %>.collection;
                }<% } %>
                <% if (view) { %>if (<%= subappname %>.view) {
                    <%= subappname %>.view.destroy();
                    delete <%= subappname %>.view;
                }<% } %>
            });
        }
    });

    // Routes.
    App.<%= subappname %>.routes = [{
        '<%= subappnametoLower %>': 'index'
    }];

    // Notify the app that a new subApp has been created.
    App.started.done(function () {
        Hub.command('createSubApp', App.<%= subappname %>);
    });

    return App.<%= subappname %>;
});
