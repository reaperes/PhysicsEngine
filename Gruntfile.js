module.exports = function(grunt) {
  grunt.initConfig({
    pkg : grunt.file.readJSON('package.json'),
    
    concat : {
      dist : {
        src : ['src/npengine/renderer/*.js'],
	dest: 'bin/npengine.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('build', ['concat']);
}
