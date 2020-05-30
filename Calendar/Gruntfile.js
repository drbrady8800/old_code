module.exports = function(grunt) {

    grunt.initConfig({
      copy: {
            js: {
                src: 'src/js_object_test.js',
                //src: 'src/js.js',
                dest: 'build/js.js'
            },
            css: {
                src: 'src/css.css',
                dest: 'build/css.css'
            },
            html: {
                src: 'src/index.html',
                dest: 'build/index.html'
            },
            default: {
                tasks: ['build:js', 'build:css', 'build:html',]
            }
        
        },
        connect: {
            server: {
                options: {
                    hostname: 'localhost',
                    livereload: true,
                    base: 'build',
                    open: true,
                }
            }
        },
        watch: {
            options: {
                livereload: true
            },
            script: {
                files: ['src/js_object_test.js'],
                //files: ['src/js.js'],
                tasks: ['copy:js']
            },
            css: {
                files: ['src/css.css'],
                tasks: ['copy:css']
            },
            index: {
                files: ['src/index.html'],
                tasks: ['copy:html']
            }
        }
    });

    grunt.registerTask('build', [
        'copy'
    ]);

    grunt.registerTask('watch', [
        'watch'
    ]);

    grunt.registerTask('serve', [
        'connect:server',
        'watch'
    ]);
  
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-connect');


  
    grunt.registerTask('default', ['copy']);
  
  };