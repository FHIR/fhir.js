module.exports = function (grunt) {
  grunt.initConfig({
    clean: ['fhir.js'],
    coffee: {
      main: {
        options: {
          join: true
        },
        files: {
          'fhir.js': 'coffee/**/*.coffee'
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-coffee');

  grunt.registerTask('default', ['clean', 'coffee']);
};
