module.exports = function (grunt) {

  var srcFiles = [
    'src/npengine/NPEngine.js',
    'src/npengine/core/*.js',
    'src/npengine/display/*.js',
    'src/npengine/display/npobject/*.js',
    'src/npengine/display/npobject/base/*.js',
    'src/npengine/display/npobject/npobject/*.js',
    'src/npengine/display/background/*.js',
  ];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      build: {
        src: ['bin/npengine.dev.js']
      }
    },

    concat: {
      dist: {
        src: srcFiles,
        dest: 'bin/npengine.dev.js'
      }
    },

    uglify: {
      build: {
        files: {
          'bin/npengine.js': ['bin/npengine.dev.js']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask(
      'build',
      'Compiles all of the assets and copies the files to the build directory.',
      ['clean', 'concat', 'uglify']
  );
};
