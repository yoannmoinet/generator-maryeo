'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

function MarYeoGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.argument('appname', {
        desc: 'The name of your app.',
        optional: true,
        required: false,
        type: String,
        default: path.basename(process.cwd())
    });
};

util.inherits(MarYeoGenerator, yeoman.generators.Base);

MarYeoGenerator.prototype.initializing = function () {
    this.pkg = require('../../package.json');
};

MarYeoGenerator.prototype.prompting = function () {
    var done = this.async();

    this.log(yosay(
        'Welcome to the impressive MarYeo generator!'
    ));
    var prompts = [{
        type: 'input',
        name: 'appname',
        message: 'The name of your app',
        default: this.appname || path.basename(process.cwd())
    }, {
        type: 'checkbox',
        name: 'includes',
        message: 'Do you need',
        choices: [{
            name: 'Bootstrap',
            value: 'bootstrap',
            checked: true
        }, {
            name: 'Font Awesome',
            value: 'fontawesome',
            checked: true
        }, {
            name: 'Internationalization (i18n)',
            value: 'i18n',
            checked: true
        }, {
            name: 'An example sub-app to kickstart yours',
            value: 'example',
            checked: false
        }]
    }];

    this.prompt(prompts, function (answers) {
        var hasMod = function hasMod (mod) {
            if (!answers.includes) {
                return false;
            }
            return answers.includes.indexOf(mod) !== -1;
        };
        this.preferences = {};
        this.preferences.appname = answers.appname;
        this.preferences.bootstrap = hasMod('bootstrap');
        this.preferences.fontawesome = hasMod('fontawesome');
        this.preferences.i18n = hasMod('i18n');
        this.preferences.example = hasMod('example');
        done();
    }.bind(this));
};

var apps = 'app/scripts/apps';
var libs = 'app/scripts/libs';
MarYeoGenerator.prototype.writing = {
    app: function () {
        var prefs = this.preferences;
        this.template('app/sass/styles.scss', 'app/sass/styles.scss', prefs);
        this.template(apps + '/_root/templates/app.hbs', apps + '/_root/templates/app.hbs', prefs);
        this.template(apps + '/_root/Application.js', apps + '/_root/Application.js', prefs);
        this.template(apps + '/_root/config.json', apps + '/_root/config.json', prefs);
        this.template(apps + '/_root/Controller.js', apps + '/_root/Controller.js', prefs);
        this.template(apps + '/_root/Router.js', apps + '/_root/Router.js', prefs);
        this.template('app/scripts/init.js', 'app/scripts/init.js', prefs);
        this.template('app/scripts/main.js', 'app/scripts/main.js', prefs);
        this.template('app/index.html', 'app/index.html', prefs);
        this.copy('app/favicon.ico');
        if (!prefs.i18n) { return; }
        this.template(apps + '/_root/locales/en.json', apps + '/_root/locales/en.json', prefs);
        this.template(apps + '/_root/locales/fr.json', apps + '/_root/locales/fr.json', prefs);
    },
    configs: function () {
        var prefs = this.preferences;
        this.template('editorconfig', '.editorconfig', prefs);
        this.template('jshintrc', '.jshintrc', prefs);
        this.template('bowerrc', '.bowerrc', prefs);
        this.template('jsbeautifyrc', '.jsbeautifyrc', prefs);
        this.copy('Gruntfile.js');
        this.template('_package.json', 'package.json', prefs);
        this.template('_bower.json', 'bower.json', prefs);
    },
    libs: function () {
        var prefs = this.preferences;
        this.template(libs + '/hub.js', libs + '/hub.js', prefs);
        this.template(libs + '/localStoragePoly.js', libs + '/localStoragePoly.js', prefs);
        if (!prefs.i18n) { return; }
        this.template(libs + '/i18n.js', libs + '/i18n.js', prefs);
    },
    example: function () {
        var prefs = this.preferences;
        if (!prefs.example) { return; }
        this.template(apps + '/Example/templates/example.hbs', apps + '/Example/templates/example.hbs', prefs);
        this.template(apps + '/Example/views/ExampleView.js', apps + '/Example/views/ExampleView.js', prefs);
        this.template(apps + '/Example/Example.js', apps + '/Example/Example.js', prefs);
        if (!prefs.i18n) { return; }
        this.template(apps + '/Example/locales/en.json', apps + '/Example/locales/en.json', prefs);
        this.template(apps + '/Example/locales/fr.json', apps + '/Example/locales/fr.json', prefs);
    }
};

MarYeoGenerator.prototype.end = function () {
    if (!this.options['skip-install']) {
        this.installDependencies();
    }
};

module.exports = MarYeoGenerator;