define(function (require) {
    'use strict';

    var App = require('application');
    var Marionette = require('backbone.marionette');

    var template = require('hbs!apps/<%= subappname %>/templates/View');

    var Hub = require('libs/hub');

    return Marionette.ItemView.extend({
        <% if (tagName) { %>tagName: '<%= tagName %>',<% } %>
        <% if (className) { %>className: '<%= className %>',<% } %>
        id: function () {
            return 'view_' + Hub.request('random');
        },
        template: template,
        ui: {},
        events: {},
        modelEvents: {},
        initialize: function () {},
        onRender: function () {},
        onDestroy: function () {}
    });
});
