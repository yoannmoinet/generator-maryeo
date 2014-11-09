define(function (require) {
    'use strict';

    var App = require('application');
    var Marionette = require('backbone.marionette');

    var template = require('hbs!apps/<%= subappname %>/templates/View');

    var Hub = require('libs/hub');

    return Marionette.ItemView.extend({
        tagName: 'div',
        className: 'view',
        id: function () {
            return 'view_' + Hub.request('random');
        },
        template: template,
        ui: {},
        events: {},
        modelEvents: {},
        serializeData: function () {
            return this.model.toJSON();
        },
        initialize: function () {},
        onRender: function () {},
        onDestroy: function () {}
    });
});
