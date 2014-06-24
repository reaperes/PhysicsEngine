module.exports = function (grunt) {

  var srcFiles = [
      'src/nextphysics/intro.js',
      'src/nextphysics/NextPhysics.js',
      'src/nextphysics/npengine/*.js',
      'src/nextphysics/npengine/force/*.js',
      'src/nextphysics/npobjects/*.js',
      'src/nextphysics/npobjects/core/base/*.js',
      'src/nextphysics/npobjects/core/*.js',
      'src/nextphysics/npobjects/sample/*.js',
      'src/nextphysics/renderers/*.js'
//    'src/npengine/NPEngine.js',
//    'src/npengine/util/*.js',
//    'src/npengine/core/*.js',
//    'src/npengine/design/*.js',
//    'src/npengine/display/*.js',
//    'src/npengine/display/object/*.js',
//    'src/npengine/display/object/base/*.js',
//    'src/npengine/display/object/npobject/*.js',
//    'src/npengine/display/background/*.js',
//    'src/npengine/renderer/*.js'
  ];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      build: {
        src: ['bin/*']
      }
    },

    concat: {
      dist: {
        src: srcFiles,
        dest: 'bin/nextphysics.dev.js'
      }
    },

    uglify: {
      build: {
        options: {
          beautify: true
        },
        files: {
          'bin/npengine.js': ['bin/nextphysics.dev.js']
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
