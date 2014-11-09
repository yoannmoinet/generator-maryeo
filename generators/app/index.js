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

    if (this.appname === undefined) {
        var prompts = [{
            type: 'input',
            name: 'appname',
            message: 'What is the name of your app?',
            default: path.basename(process.cwd())
        }];

        this.prompt(prompts, function (props) {
            this.appname = props.name;
            this.i18n = true;
            done();
        }.bind(this));
    } else {
        done();
    }
};

MarYeoGenerator.prototype.writing = {
    app: function () {
        this.directory('app', 'app');
    },

    projectfiles: function () {
        this.src.copy('editorconfig', '.editorconfig');
        this.src.copy('jshintrc', '.jshintrc');
        this.src.copy('bowerrc', '.bowerrc');
        this.src.copy('jsbeautifyrc', '.jsbeautifyrc');
        this.src.copy('Gruntfile.js', 'Gruntfile.js');

        this.src.copy('_package.json', 'package.json');
        this.src.copy('_bower.json', 'bower.json');
    }
};

MarYeoGenerator.prototype.end = function () {
    this.installDependencies();
};

module.exports = MarYeoGenerator;