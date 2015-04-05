module.exports = function (grunt) {
    'use strict';
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    // show elapsed time at the end
    require('time-grunt')(grunt);

    // configurables
    var config = {
        app: 'app',
        build: 'dist',
        sassImagePath: '../images'
    };

    config.jshintInclude = [
        '<%= config.app %>/scripts/{,**/}*.js',
        'Gruntfile.js'
    ];
    config.jshintExclude = [
        '<%= config.app %>/scripts/bower/{,**/}*.js',
    ];

    grunt.initConfig({
        config: config,
        jshint: {
            options: {
                jshintrc: true,
                reporter: require('jshint-stylish'),
                files: {
                    src: config.jshintInclude,
                    ignores: config.jshintExclude
                }
            }
        },
        connect: {
            server: {
                options: {
                    hostname: '127.0.0.1',
                    open: true,
                    livereload: true,
                    port: 1234,
                    keepalive: true,
                    base: '<%= config.app %>'
                }
            }
        },
        watch: {
            js: {
                files: [
                    '<%= config.app %>/scripts/{,**/}*.js'
                ],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            css: {
                files: [
                    '<%= config.app %>/css/*.css'
                ],
                options: {
                    livereload: true
                }
            },
            sass: {
                files: [
                    '<%= config.app %>/sass/{,**/}*.{scss,sass}'
                ],
                tasks: ['sass']
            },
            configFiles: {
                files: ['Gruntfile.js'],
                options: {
                    reload: true
                },
                tasks: ['jshint', 'sass']
            },
            handlebars: {
                files: [
                    '<%= config.app %>/scripts/apps/**/templates/{,**/}*.hbs'
                ],
                options: {
                    livereload: true
                }
            }
        },

        sass: {
            options: {
                outputStyle: 'compressed',
                sourceMap: true,
                imagePath: config.sassImagePath,
                includePaths: [
                    './node_modules/sass-list-maps'
                ]
            },
            dev: {
                files: {
                    '<%= config.app %>/css/styles.css': '<%= config.app %>/sass/styles.scss',
                }
            }
        },

        clean: {
            build: [
                '.tmp',
                '<%= config.build %>/css',
                '<%= config.build %>/fonts',
                '<%= config.build %>/images',
                '<%= config.build %>/scripts'
            ]
        },

        // require
        requirejs: {
            build: {
                // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
                options: {
                    baseUrl: '<%= config.app %>/scripts',
                    mainConfigFile: '<%= config.app %>/scripts/init.js',
                    name: 'main',
                    optimize: 'uglify2',
                    deps: ['almond'],
                    out: '<%= config.build %>/scripts/main.js',
                    preserveLicenseComments: false,
                    useStrict: false,
                    generateSourceMaps: true
                }
            }
        },

        copy: {
            build: {
                files: [{
                    cwd: '<%= config.app %>',
                    dest: '<%= config.build %>',
                    src: 'images/*',
                    expand: true
                }, {
                    cwd: '<%= config.app %>/scripts/bower/font-awesome/fonts',
                    dest: '<%= config.build %>/fonts',
                    src: '**/*',
                    expand: true
                }, {
                    src: '<%= config.app %>/favicon.ico',
                    dest: '<%= config.build %>/favicon.ico'
                }]
            }
        },

        concurrent: {
            dev: {
                tasks: ['watch', 'connect'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    grunt.registerTask('default', [
        'sass',
        'concurrent:dev'
    ]);

    grunt.registerTask('build', [
        'clean',
        'sass',
        'copy',
        'requirejs'
    ]);
};