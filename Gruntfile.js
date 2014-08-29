module.exports = function (grunt) {
  grunt.initConfig({
    clean: ['dist/*.js'],
    webpack: {
      fhir: {
        entry: "./coffee/fhir.js",
        output: {
          path: __dirname + "/dist",
          filename: "fhir.js",
          library: "fhir",
          libraryTarget: "umd"
        },
        module: {loaders: [{ test: /\.coffee$/, loader: "coffee-loader" }]}
      },
      ngfhir: {
        entry: "./coffee/adapters/ngFhir.js",
        output: {
          path: __dirname + "/dist",
          filename: "ngFhir.js",
          library: "ng-fhir",
          libraryTarget: "umd"
        },
        module: {loaders: [{ test: /\.coffee$/, loader: "coffee-loader" }]}
      },
      jqfhir: {
        entry: "./coffee/adapters/jqFhir.js",
        output: {
          path: __dirname + "/dist",
          filename: "jqFhir.js",
          library: "jqFhir",
          libraryTarget: "umd"
        },
        externals: {
          "jquery": "jQuery"
        },
        module: {loaders: [{ test: /\.coffee$/, loader: "coffee-loader" }]}
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.registerTask('default', ['clean', 'webpack']);
};
