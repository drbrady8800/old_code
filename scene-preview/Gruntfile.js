module.exports = function (grunt) {
  'use strict';

  var execSync = require('child_process').execSync;

  // grunt config namespace
  var config = {};

  // store package data
  config.pkg = grunt.file.readJSON('package.json');

  config.watch = {
    css: {
        files: ['src/**/*.less'],
        tasks: ['default']
      },
    html: {
      files: ['src/**/*.html'],
      tasks: ['default']
    },
    scripts: {
      files: ['src/**/*.js'],
      tasks: ['default']
    }
  };

  config.connect = {
      server: {
        options: {
          hostname: 'localhost',
          port: 8080,
          base: 'build/',
          useAvailablePort: false,
          open: true,
          keepalive: true
        }
      }
  };

  // clear build directory before each new build
  config.clean = [
    'build',
    'tmp'
  ];
  /**
   * Copy files that don't need any processing or have already been processed
   * and put in "tmp" directory
   */
   config.copy = {
     tmp: {
       files: [
         {
           cwd: 'src/',
           src: ['less/**'],
           dest: 'tmp/src',
           expand: true
         }
       ]
     },
     build: {
       files: [
         {
           cwd: 'src/',
           src: ['js/**/*', 'images/**/*', '*.json', 'index.html', 'favicon.ico'],
           dest: 'build',
           expand: true
         }
       ]
     }
   };

  /**
   * Compile LESS files
   */
  config.less = {
    build: {
      options: {
        paths: ['src/less']
      },
      files: {
        'build/css/main.css': [
          'src/less/main.less'
        ]
      }
    }
  };

  /**
   * Minify CSS created from compiling LESS files
   */
  config.cssmin = {
    build: {
      files: {
        'build/css/main.min.css': 'build/css/main.css'
      }
    }
  };

  /**
   * Configure Grunt
   */
   grunt.initConfig(config);

  // auto-load grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('server', [
    'connect:server'
  ]);

  grunt.loadNpmTasks('grunt-serve');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', '', function() {

    var tasks = [
      'clean',
      'copy:tmp',
      'copy:build',
      'less:build',
      'cssmin:build',
    ];

    grunt.task.run(tasks);

  });

};
