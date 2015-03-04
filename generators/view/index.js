'use strict';
var util = require('util');
var fs = require('fs');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var _ = require('underscore');
var cwd = process.cwd();

function MaryoGenerator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    this.argument('viewname', {
        desc: 'The name of your view.',
        required: false,
        type: String,
        default: 'View'
    });
};

function getDirectories (srcPath) {
    var dir = fs.readdirSync(srcPath).filter(function (file) {
        return fs.statSync(path.join(srcPath, file)).isDirectory();
    });
    var obj = [];
    _.each(dir, function (d) {
        obj.push({
            name: d,
            last_modified: +new Date(fs.statSync(path.join(srcPath, d)).mtime)
        });
    });
    return _.sortBy(obj, function (o) {
        return -o.last_modified;
    });
}

util.inherits(MaryoGenerator, yeoman.generators.Base);

MaryoGenerator.prototype.initializing = function () {
    this.pkg = require('../../package.json');
};

MaryoGenerator.prototype.prompting = function () {
    var done = this.async();
    var prompts = [];
    var subapps = getDirectories(cwd + '/app/scripts/apps/');

    if (this.viewname === undefined) {
        prompts.push({
            type: 'input',
            name: 'viewname',
            message: 'What is the name of your view?',
            default: 'View'
        });
    }
    prompts.push({
        type: 'list',
        name: 'subapp',
        message: 'For which subapp?',
        choices: _.pluck(subapps, 'name'),
        default: _.pluck(subapps, 'name')[0]
    });
    prompts.push({
        type: 'list',
        name: 'viewtype',
        message: 'What type of view?',
        choices: ['ItemView', 'LayoutView', 'CollectionView', 'CompositeView'],
        default: 'ItemView'
    });
    prompts.push({
        type: 'checkbox',
        name: 'included',
        message: 'Here\'s what we\'ll create for you :',
        choices: ['Model', 'Collection', 'ChildView', 'ChildViewTemplate', 'ViewTemplate', 'i18n'],
        when: function (answers) {

        }
    });
    prompts.push({
        type: 'input',
        name: 'emmetKickstart',
        message: 'Do you want to kickstart your view with Emmet?',
        default: 'div'
    });
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
    app: function () {}
};

module.exports = MaryoGenerator;