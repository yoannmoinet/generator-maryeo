/*global describe, beforeEach, afterEach, it*/
'use strict';

var path = require('path');
var fs = require('fs');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');
var files = [
    'app/sass/styles.scss',
    'app/scripts/apps/_root/Application.js',
    'app/scripts/apps/_root/config.json',
    'app/scripts/apps/_root/Controller.js',
    'app/scripts/apps/_root/Router.js',
    'app/scripts/libs/hub.js',
    'app/scripts/libs/localStoragePoly.js',
    'app/scripts/init.js',
    'app/scripts/main.js',
    'app/index.html',
    'app/favicon.ico',
    'bower.json',
    'package.json',
    '.bowerrc',
    '.editorconfig',
    '.jsbeautifyrc',
    '.jshintrc'
];
var noFiles = [
    'app/scripts/libs/i18n.js',
    'app/scripts/apps/Example/Example.js',
    'app/scripts/apps/Example/views/ExampleView.js',
    'app/scripts/apps/Example/views/template/example.hbs',
    'app/scripts/apps/Example/locales/en.json',
    'app/scripts/apps/Example/locales/fr.json'
];

describe('maryeo:app', function () {
    var filesI18n = [].concat(files),
        filesNoIncludes = [].concat(files),
        filesExample = [].concat(files),
        filesExampleI18n = [].concat(files);
    var noFilesI18n = [].concat(noFiles),
        noFilesNoIncludes = [].concat(noFiles),
        noFilesExample = [].concat(noFiles),
        noFilesExampleI18n = [].concat(noFiles);

    filesI18n.push(noFilesI18n.shift(0, 1));
    filesExample.concat(noFilesExample.slice(1, 4));
    noFilesExample = noFilesExample.slice(0, 1).concat(noFilesExample.slice(4));
    filesExampleI18n.concat(noFilesExampleI18n);
    noFilesExampleI18n = [];

    var datas = {
        'with no includes': { opts: { includes: [], appname: 'Web App with no includes' }, regEx: /(i18n|bootstrap|font ?awesome)/gi, files: filesNoIncludes, noFiles: noFilesNoIncludes },
        'with i18n': { opts: { includes: ['i18n'], appname: 'Web App with i18n' }, regEx: /(bootstrap|font ?awesome)/gi, files: filesI18n, noFiles: noFilesI18n },
        'with fontawesome': { opts: { includes: ['fontawesome'], appname: 'Web App with Font Awesome' }, regEx: /(bootstrap|i18n)/gi, files: files, noFiles: noFiles },
        'with bootstrap': { opts: { includes: ['bootstrap'], appname: 'Web App with Bootstrap' }, regEx: /(font ?awesome|i18n)/gi, files: files, noFiles: noFiles },
        'with example': { opts: { includes: ['example'], appname: 'Web App with Example' }, regEx: /(font ?awesome|i18n)/gi, files: filesExample, noFiles: noFilesExample },
        'with example and I18N': { opts: { includes: ['example', 'i18n'], appname: 'Web App with Example and I18N' }, regEx: /(font ?awesome)/gi, files: filesExampleI18n, noFiles: noFilesExampleI18n },
        'with everything': { opts: { includes: ['example', 'i18n'], appname: 'Web App with Everything' }, regEx: null, files: filesExampleI18n, noFiles: noFilesExampleI18n }
    };

    var testWithData = function (name, data) {
        describe(name, function () {
            before(function (done) {
                var self = this;

                fs.rmdir(path.join(os.tmpdir(), './temp-test'), function () {
                    self.context = helpers.run(path.join(__dirname, '../generators/app'))
                        .inDir(path.join(os.tmpdir(), './temp-test'))
                        .withOptions({ 'skip-install': true })
                        .withPrompt(data.opts)
                        .on('end', done);
                });
            });

            it('gets options', function () {
                var prefs = this.context.generator.preferences;
                assert.equal(prefs.appname, data.opts.appname);
                assert.equal(prefs.bootstrap, data.opts.includes.indexOf('bootstrap') > -1);
                assert.equal(prefs.i18n, data.opts.includes.indexOf('i18n') > -1);
                assert.equal(prefs.fontawesome, data.opts.includes.indexOf('fontawesome') > -1);
                assert.equal(prefs.example, data.opts.includes.indexOf('example') > -1);
            });

            it('creates files that are needed', function () {
                assert.file(data.files);
            });

            it('doesn\'t create files that are not needed', function () {
                assert.noFile(data.noFiles);
            });

            it('applies options', function (done) {
                var prefs = this.context.generator.preferences;
                fs.readFile('package.json', function (err, data) {
                    var pack = JSON.parse(data);
                    assert.equal(err, null);
                    assert.notEqual(data, null);
                    assert.equal(pack.name, prefs.appname);
                    fs.readFile('bower.json', function (err, data) {
                        var bower = JSON.parse(data);
                        assert.equal(err, null);
                        assert.notEqual(data, null);
                        assert.equal(bower.name, prefs.appname);
                        done();
                    });
                });
            });

            it('doesn\'t use inexistant inclusion', function () {
                if(data.regEx) {
                    var filesContent = [];
                    data.files.forEach(function (st) {
                        filesContent.push([st, data.regEx]);
                    })
                    assert.noFileContent(filesContent);
                } else {
                    assert.equal(true, true);
                }
            });
        });
    };

    for (var i in datas) {
        testWithData(i, datas[i]);
    }
})
