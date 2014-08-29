module.exports = function (grunt) {
  grunt.initConfig({
    clean: ['dist/*.js'],
    webpack: {
      fhir: {
        entry: "./entry.js",
        output: {
          path: __dirname + "/dist",
          filename: "fhir.js",
          library: "fhir",
          libraryTarget: "umd"
        },
        module: {
          loaders: [
            { test: /\.coffee$/, loader: "coffee-loader" }
          ]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.registerTask('default', ['clean', 'webpack']);
};
