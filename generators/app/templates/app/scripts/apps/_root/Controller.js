/*jslint vars:true*/
/*global define, console*/

define(function (require) {
    'use strict';

    var Marionette = require('backbone.marionette');
    var Hub = require('libs/hub');
    var _ = require('underscore');
    <% if (i18n) { %>
    var i18n = require('libs/i18n');
    <% } %>

    var ls = window.localStorage;

    return Marionette.Controller.extend({
        startSubApp: function (appName, args) {
            var currentApp = Hub.request('module', appName);
            var App = this;

            //If already started we return
            if (currentApp === App.currentApp) {
                return;
            }

            //If there is another one loaded, we stop it
            if (App.currentApp) {
                App.currentApp.stop();
            }

            App.currentApp = currentApp;
            currentApp.start(args);
        },
        createRoute: function (app) {
            var App = this;
            var appRoutes = [],
                route, url, handler;

            //NameSpace our routes.
            var ns = Hub.request('random');

            _.map(app.routes, function (routes) {
                _.map(routes, function (value, key) {
                    route = {};
                    url = key;
                    handler = ns + '.' + (app.root || app.moduleName) + '.' + key;

                    //To be able to start the subApp and load its index.
                    //Asynchronously declared.
                    (function (routes, key, handler, value, app) {
                        App[handler] = function () {
                            Hub.command('startSubApp', app.moduleName);
                            app.controller[value].apply(app, arguments);
                        };
                    }(routes, key, handler, value, app));

                    route[url] = ns + '.' + (app.root || app.moduleName) + '.' + key;
                    appRoutes.push(route);
                });
            });

            Hub.command('addRoutes', appRoutes);
        },
        addRoutes: function (route, controller) {
            var App = this;
            var toAdd = {};
            controller = controller || App;
            var add = function (sub) {
                App.router.processAppRoutes(controller, sub);
            };
            var loop = function (sub, auth) {
                var key;
                for (key in sub) {
                    if (sub.hasOwnProperty(key)) {
                        toAdd[key] = sub[key];
                    }
                }
            };

            if (typeof route === 'object') {
                if (route.length) {
                    var i, max;
                    for (i = 0, max = route.length; i < max; i += 1) {
                        loop(route[i], route[i].auth);
                    }
                } else {
                    loop(route, route.auth);
                }
                add(toAdd);
            } else {
                throw ('"route" must be an "object" or an "array".');
            }

            //Refresh the router in case we're on the route it's defining.
            App.router.refresh(route);
        },
        <% if (i18n) { %>
        switchLang: function (lang) {
            var langs = Hub.request('options', 'langs');
            ls.setItem('lang', lang);
            i18n.lng = langs[lang].toLowerCase();
            Hub.trigger('change:lang', lang);
        },
        <% } %>
        addHeader: function () {
            var App = this;
            if (!App.headerVisible) {
                App.HeaderApp.view = new App.HeaderApp.HeaderView.Layout({
                    model: Hub.request('Header.menus')
                });
                App.headerView.show(App.HeaderApp.view);
                App.headerVisible = true;
            }
        },
        removeHeader: function () {
            var App = this;
            if (App.headerVisible === true) {
                App.headerView.reset();
                App.headerVisible = false;
            }
        }
    });
});