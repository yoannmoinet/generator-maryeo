'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

function MaryoGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.argument('subappname', {
        desc: 'The name of your sub-app.',
        required: false,
        optional: true,
        type: String,
        default: path.basename(process.cwd())
    });
};

util.inherits(MaryoGenerator, yeoman.generators.Base);

MaryoGenerator.prototype.initializing = function () {
    this.pkg = require('../../package.json');
};

MaryoGenerator.prototype.prompting = function () {
    var done = this.async();
    var prompts = [];

    if (this.subappname === undefined) {
        prompts.push({
            type: 'input',
            name: 'subappname',
            message: 'What is the name of your sub-app?',
            default: this.subappname
        });
    }

    prompts.push({
        type: 'checkbox',
        name: 'included',
        message: 'What do you need with it?',
        choices: ['Model', 'Collection', 'View', 'i18n'],
        default: ['Model', 'Collection', 'View', 'i18n']
    });

    this.prompt(prompts, function (props) {
        var included = function (name) {
            return props.included.indexOf(name) >= 0;
        };
        this.preferences = {};
        this.preferences.subappname = props.name || this.subappname;
        this.preferences.model = included('Model');
        this.preferences.collection = included('Collection');
        this.preferences.view = included('View');
        this.preferences.i18n = included('i18n');
        done();
    }.bind(this));
};

MaryoGenerator.prototype.writing = {
    app: function () {
        var name = this.preferences.subappname;
        this.preferences.subappnametoLower = name.toLowerCase();

        this.destinationRoot('app/scripts/apps/' + name);

        this.template('SubAppController.js', name + 'Controller.js', this.preferences);
        this.template('SubApp.js', name + '.js', this.preferences);
        this.template('config.json', 'config.json', this.preferences);

        if (this.preferences.model) {
            this.directory('models', 'models');
        }

        if (this.preferences.collection) {
            this.directory('collections', 'collections');
        }

        if (this.preferences.view) {
            this.directory('views', 'views');
            this.directory('templates', 'templates');
        }

        if (this.preferences.i18n) {
            this.directory('locales', 'locales');
        }
    }
};

module.exports = MaryoGenerator;