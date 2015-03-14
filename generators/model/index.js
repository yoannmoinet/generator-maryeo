'use strict';
var util = require('util');
var yeoman = require('yeoman-generator');

util.inherits(MaryoGenerator, yeoman.generators.Base);

MaryoGenerator.prototype.initializing = function () {
    this.pkg = require('../../package.json');
};

MaryoGenerator.prototype.prompting = function () {
    var done = this.async();
    var prompts = [];
    this.prompt(prompts, function (props) {
        var included = function (name) {
            return props.included.indexOf(name) >= 0;
        };
        this.preferences = {};
        done();
    }.bind(this));
};

MaryoGenerator.prototype.writing = {
    app: function () {}
};

module.exports = MaryoGenerator;