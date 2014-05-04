module.exports = function (grunt) {

  var srcFiles = [
    'src/npengine/NPEngine.js',
    'src/npengine/FPS.js',
    'src/npengine/math/*.js',
    'src/npengine/core/*.js',
    'src/npengine/database/*.js',
    'src/npengine/display/*.js',
    'src/npengine/display/background/*.js',
    'src/npengine/display/object/core/*.js',
    'src/npengine/display/object/*.js',
    'src/npengine/simulation/*.js',
    'src/npengine/renderer/*.js'
  ];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    concat: {
      dist: {
        src: srcFiles,
        dest: 'bin/npengine.dev.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('build', ['concat']);
}
