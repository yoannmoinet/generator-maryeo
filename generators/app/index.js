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

MarYeoGenerator.prototype.writing = function () {
    var apps = 'app/scripts/apps';
    var libs = 'app/scripts/libs';
    var prefs = this.preferences;
    if (prefs.i18n) {
        this.directory(apps + '/_root/locales', apps + '/_root/locales');
        this.fs.copyTpl(
            this.templatePath(libs + '/i18n.js'),
            this.destinationPath(libs + '/i18n.js'),
            prefs
        );
    }
    if (prefs.example) {
        this.directory(apps + '/Example/templates', apps + '/Example/templates');
        this.directory(apps + '/Example/views', apps + '/Example/views');
        this.fs.copyTpl(
            this.templatePath(apps + '/Example/Example.js'),
            this.destinationPath(apps + '/Example/Example.js'),
            prefs
        );
        if (prefs.i18n) {
            this.directory(apps + '/Example/locales', apps + '/Example/locales');
            this.fs.copyTpl(
                this.templatePath(libs + '/i18n.js'),
                this.destinationPath(libs + '/i18n.js'),
                prefs
            );
        }
    }
    this.directory('app/sass', 'app/sass');
    this.directory(apps + '/_root/templates', apps + '/_root/templates');
    this.fs.copyTpl(
        this.templatePath(apps + '/_root/Application.js'),
        this.destinationPath(apps + '/_root/Application.js'),
        prefs
    );
    this.fs.copyTpl(
        this.templatePath(apps + '/_root/config.json'),
        this.destinationPath(apps + '/_root/config.json'),
        prefs
    );
    this.fs.copyTpl(
        this.templatePath(apps + '/_root/Controller.js'),
        this.destinationPath(apps + '/_root/Controller.js'),
        prefs
    );
    this.fs.copyTpl(
        this.templatePath(apps + '/_root/Router.js'),
        this.destinationPath(apps + '/_root/Router.js'),
        prefs
    );
    this.fs.copyTpl(
        this.templatePath(libs + '/hub.js'),
        this.destinationPath(libs + '/hub.js'),
        prefs
    );
    this.fs.copyTpl(
        this.templatePath(libs + '/localStoragePoly.js'),
        this.destinationPath(libs + '/localStoragePoly.js'),
        prefs
    );
    this.fs.copyTpl(
        this.templatePath('app/scripts/init.js'),
        this.destinationPath('app/scripts/init.js'),
        prefs
    );
    this.fs.copyTpl(
        this.templatePath('app/scripts/main.js'),
        this.destinationPath('app/scripts/main.js'),
        prefs
    );
    this.fs.copyTpl(
        this.templatePath('app/index.html'),
        this.destinationPath('app/index.html'),
        prefs
    );
    this.fs.copyTpl(
        this.templatePath('app/favicon.ico'),
        this.destinationPath('app/favicon.ico'),
        prefs
    );
    this.fs.copyTpl(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig'),
        prefs
    );
    this.fs.copyTpl(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc'),
        prefs
    );
    this.fs.copyTpl(
        this.templatePath('bowerrc'),
        this.destinationPath('.bowerrc'),
        prefs
    );
    this.fs.copyTpl(
        this.templatePath('jsbeautifyrc'),
        this.destinationPath('.jsbeautifyrc'),
        prefs
    );
    this.fs.copy(
        this.templatePath('Gruntfile.js'),
        this.destinationPath('Gruntfile.js')
    );

    this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        prefs
    );
    this.fs.copyTpl(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json'),
        prefs
    );
};

MarYeoGenerator.prototype.end = function () {
    if (!this.options['skip-install']) {
        this.installDependencies();
    }
};

module.exports = MarYeoGenerator;