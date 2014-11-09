define(function (require) {
    'use strict';

    var App = require('application');
    var Marionette = require('backbone.marionette');
    <% if (view) { %>var View = require('apps/<%= subappname %>/views/View');<% } %>

    var Hub = require('libs/hub');

    return Marionette.Controller.extend({
        index: function (args) {
            var self = this;

            <% if (view) { %>self.view = new View(<% if (collection) { %>{
                collection: self.collection
            }<% } %>);<% } %>
            <% if (collection) { %>
            self.collection.fetch();<% } %>
            <% if (view) { %>Hub.command('show', self.view);<% } %>
        }<% if (i18n) { %>,
        changeLang: function () {
            var self = this;
            <% if (view) { %>if (self.view) {
                self.view.render();
            }<% } %>
        }<% } %>
    });
});