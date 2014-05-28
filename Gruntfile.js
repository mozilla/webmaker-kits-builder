module.exports = function( grunt ) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON( 'package.json' ),

    jshint: {
      // Options set based on http://mozweb.readthedocs.org/en/latest/js-style.html
      options: {
        strict: true,
        curly: true,
        newcap: true,
        quotmark: 'single',
        camelcase: true,
        undef: true,
        eqeqeq: true,
        node: true,
        browser: true
      },
      files: [
        'Gruntfile.js',
        'asset/js/**/*.js'
      ]
    },

    less: {
      development: {
        options: {
          paths: [ 'public/css' ],
          compress: true,
          sourceMap: true,
          sourceMapBasepath: '/',
          sourceMapRootpath: '/'
        },
        files: {
          'public/css/style.css': 'public/less/style.less'
        }
      }
    },

    watch: {
      files: [ 'public/js/*.js', 'public/less/*.less' ],
      tasks: [ 'jshint', 'less' ]
    },

    connect: {
      server: {
        options: {
          port: 1111,
          useAvailablePort: true,
          base: 'public/'
        }
      }
    }
  });

  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
  grunt.loadNpmTasks( 'grunt-contrib-connect' );
  grunt.loadNpmTasks( 'grunt-contrib-less' );
  grunt.loadNpmTasks( 'grunt-contrib-watch' );
  grunt.registerTask( 'default', [ 'jshint', 'less', 'connect', 'watch' ] );
};
