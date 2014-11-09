/*jslint vars:true*/
/*global define, console*/

define(function (require) {
    'use strict';

    //Dependencies
    var $ = require('jquery');
    var Backbone = require('backbone');
    require('libs/localStoragePoly');

    //Libs
    var Hub = require('libs/hub');
    <% if (i18n) { %>var i18n = require('libs/i18n');<% } %>

    //Application's files
    var template = require('hbs!apps/_root/templates/app');
    var AppRouter = require('apps/_root/Router');
    var AppController = require('apps/_root/Controller');
    var config = require('json!apps/_root/config.json');

    <% if (i18n) { %>//Languages
    var en = require('json!apps/_root/locales/en.json');
    var fr = require('json!apps/_root/locales/fr.json');

    //Register locales
    i18n.addLocales('en', en);
    i18n.addLocales('fr', fr);
    <% } %>
    var ls = window.localStorage;

    //Random 10 characters string.
    //http://stackoverflow.com/a/19964557/488325
    Hub.reply('random', function () {
        new Array(11)
            .join((Math.random().toString(36) + '00000000000000000')
                .slice(2, 18))
            .slice(0, 10);
    });

    //Instanciation
    var App = new Backbone.Marionette.Application({
        controller: new AppController(),
        subApps: [],
        options: config
    });

    //Add application regions here */
    App.addRegions({
        contentView: '#content'
    });

    App.ready = $.Deferred();

    //App Start
    //Add initializers here
    App.addInitializer(function () {
        document.body.innerHTML = template();

        this.lang = 0;

        <% if (i18n) { %>
        //Get localStored stuff
        //like lang
        if (ls.getItem('lang')) {
            this.lang = +ls.getItem('lang');
        } else {
            ls.setItem('lang', this.lang);
        }

        Hub.command('switchLang', this.lang);

        <% } %>
        App.router = new AppRouter({
            controller: App.controller
        });

        //When everything is ready
        //we start.
        App.ready.resolve();
    });

    App.ready.done(function () {
        if (Backbone.history) {
            Backbone.history.start();
        }
    });

    //Listeners
    //When a route is added
    Hub.on('route:added', function (route) {
        var subApps = App.subApps;
        subApps.push(route);
    });

    //Accessors
    Hub.reply('options', function (arg) {
        var options = App.options;
        if (arg !== undefined && typeof arg === 'string') {
            options = options[arg];
        }
        return options;
    });
    <% if (i18n) { %>
    Hub.reply('lang', function () {
        return App.options.langs[ls.getItem('lang')];
    });
    <% } %>
    Hub.reply('module', function (name) {
        return App.module(name);
    });
    Hub.reply('currentApp', function () {
        return App.currentApp;
    });
    Hub.reply('toggleOption', function (option, current) {
        if (App.options[option]) {
            current += 1;
            if (!App.options[option][current]) {
                current = 0;
            }
        }
        return current;
    });

    //Commands
    Hub.comply('startSubApp', App.controller.startSubApp, App);
    Hub.comply('switchLang', App.controller.switchLang, App);
    Hub.comply('show', function (view) {
        App.contentView.show(view);
    });
    Hub.comply('redirect', function (where, trigger) {
        trigger = trigger === undefined ? true : trigger;
        where = where === undefined ? '' : where;

        App.router.navigate(where, {
            trigger: true
        });
    });
    Hub.comply('createSubApp', App.controller.createRoute, App);
    Hub.comply('addRoutes', App.controller.addRoutes, App);

    return App;
});