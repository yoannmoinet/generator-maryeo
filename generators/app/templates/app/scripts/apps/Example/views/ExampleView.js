define(function (require) {
    'use strict';

    var App = require('application');
    var template = require('hbs!apps/Example/templates/example');

    App.module('AppEx.AppExView',
        function (View, App, Backbone, Marionette, $, _) {

            View.View = Marionette.ItemView.extend({
                tagName: 'div',
                id: 'example',
                className: 'example',
                template: template,
                initialize: function () {
                    console.log('initialize an Example View');
                },
                onDestroy: function () {
                    console.log('destroy an Example View');
                }
            });

            View.ExampleView = Marionette.ItemView.extend({
                tagName: 'div',
                id: 'example',
                className: 'class',
                template: '<div><h1>Hello from the route <b>/#example</b>.</h1></div>',
                initialize: function () {
                    console.log('initialize a ExampleView');
                },
                onDestroy: function () {
                    console.log('destroy a ExampleView');
                }
            });

        }
    );
    return App.AppEx.AppExView;
});