/*jslint vars:true*/
/*global define*/

define(function (require) {
    'use strict';

    var Backbone = require('backbone');
    var Marionette = require('backbone.marionette');
    var Hub = require('libs/hub');
    var _ = require('underscore');

    return Marionette.AppRouter.extend({
        appRoutes: {},
        route: function (route, name, callback) {
            var self = this;
            var control = self.options.controller;
            var preRoute = self.preRoute;

            // Wrap the callback.
            var newCallback = function () {
                preRoute.call(self, route, control, callback);
            };

            Marionette.AppRouter.prototype.route.call(this, route, name, newCallback);
        },
        refresh: function (routes) {
            var fragment = Backbone.history.fragment || '',
                self = this,
                redirect = '',
                needsRefresh = false;

            //Check if we currently are on a route being defined
            _.each(routes, function (route, index, routes) {
                _.map(
                    route,
                    function (value, key) {
                        if (fragment === key) {
                            needsRefresh = true;
                        }
                    }
                );
            });

            //HACKY refresh
            if (needsRefresh) {
                //Avoid root duplicate
                if (redirect === fragment) {
                    redirect = Hub.request('random');
                    redirect += '';
                }
                self.navigate(redirect, {
                    trigger: false
                });
                self.navigate(fragment, {
                    trigger: true
                });
            }
        },
        preRoute: function (route, control, method) {
            var self = this;
            var fragment = Backbone.history.fragment;
            var args;

            //Get the fragment.
            if (!_.isRegExp(route)) {
                route = this._routeToRegExp(route);
            }
            args = self._extractParameters(route, fragment);

            //And go to the good route.
            if (method && typeof method === 'function') {
                method.apply(this, args);
            }

            //Apply a postRoute.
            this.postRoute.apply(this, arguments);
            Hub.trigger('router:' + method + ':before');
        },
        postRoute: function (route, control, method) {
            Hub.trigger('router:' + method + ':after');
        }
    });
});