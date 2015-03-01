/*global describe, beforeEach, it*/
'use strict';

var path = require('path');
var fs = require('fs');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('maryeo:app', function () {
    describe('with no includes', function () {
        before(function (done) {
            this.context = helpers.run(path.join(__dirname, '../generators/app'))
                .inDir(path.join(os.tmpdir(), './temp-test'))
                .withOptions({ 'skip-install': true })
                .withPrompt({
                    appname: 'Web App',
                    bootstrap: false,
                    i18n: false,
                    fontawesome: false,
                    example: false
                })
                .on('end', done);
        });

        it('gets options', function () {
            var prefs = this.context.generator.preferences;
            assert.equal(prefs.appname, 'Web App');
            assert.equal(prefs.bootstrap, false);
            assert.equal(prefs.i18n, false);
            assert.equal(prefs.fontawesome, false);
            assert.equal(prefs.example, false);
        });

        it('creates files that are needed', function () {
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
          assert.file(files);
        });

        it('doesn\'t create files that are not needed', function () {
            var noFiles = [
                'app/scripts/libs/i18n.js',
                'app/scripts/apps/Example/Example.js',
                'app/scripts/apps/Example/views/ExampleView.js',
                'app/scripts/apps/Example/views/template/example.hbs',
                'app/scripts/apps/Example/locales/en.json',
                'app/scripts/apps/Example/locales/fr.json'
            ];
            assert.noFile(noFiles);
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
    });
});
