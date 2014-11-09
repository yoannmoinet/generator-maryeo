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
            name: 'appname',
            message: 'What is the name of your sub-app?',
            default: this.appname
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
        this.subappname = props.name || this.subappname;
        this.model = included('Model');
        this.collection = included('Collection');
        this.view = included('View');
        this.i18n = included('i18n');
        done();
    }.bind(this));
};

MaryoGenerator.prototype.writing = {
    app: function () {
        var name = this.subappname;
        this.subappnametoLower = name.toLowerCase();

        this.destinationRoot('app/scripts/apps/' + name);

        this.template('SubAppController.js', name + 'Controller.js', this);
        this.template('SubApp.js', name + '.js', this);
        this.template('config.json', 'config.json', this);

        if (this.model) {
            this.directory('models', 'models');
        }

        if (this.collection) {
            this.directory('collections', 'collections');
        }

        if (this.view) {
            this.directory('views', 'views');
            this.directory('templates', 'templates');
        }

        if (this.i18n) {
            this.directory('locales', 'locales');
        }
    }
};

module.exports = MaryoGenerator;