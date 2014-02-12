module.exports = function (grunt) {

  var srcFiles = [
    'src/npengine/*.js',
    'src/npengine/database/*.js',
    'src/npengine/display/*.js',
    'src/npengine/display/background/*.js',
    'src/npengine/display/object/*.js',
    'src/npengine/renderer/*.js',
    'src/npengine/math/*.js'
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
