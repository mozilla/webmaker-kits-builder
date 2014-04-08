module.exports = function( grunt ) {
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON( 'package.json' ),

    less: {
      development: {
        options: {
          paths: ['./asset/css'],
          yuicompress: false
        },
        files: {
          './asset/css/style.css': './asset/less/style.less'
        }
      }
    },

    jshint: {
      // Options set based on http://mozweb.readthedocs.org/en/latest/js-style.html
      options: {
        strict: true,
        curly: true,
        newcap: true,
        quotmark: 'single',
        camelcase: true,
        undef: true,
        unused: true,
        eqeqeq: true,
        node: true,
        browser: true
      },
      files: [
        'Gruntfile.js',
        'asset/js/**/*.js'
      ]
    },

    watch: {
      files: './asset/less/*.less',
      tasks: ['less']
    }
  });

  grunt.loadNpmTasks( 'grunt-contrib-jshint' );
  grunt.loadNpmTasks( 'grunt-contrib-less' );
  grunt.loadNpmTasks( 'grunt-contrib-watch' );
  grunt.registerTask( 'default', [ 'less:development', 'jshint' ] );
};
