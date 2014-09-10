module.exports = function (grunt) {
  grunt.initConfig({
    clean: ['dist/*.js'],
    webpack: {
      fhir: {
        entry: "./src/fhir.coffee",
        node: {
          buffer: "mock"
        },
        externals: {
          "jquery": "jQuery"
        },
        output: {
          path: __dirname + "/dist",
          filename: "fhir.js",
          library: "fhir",
          libraryTarget: "umd"
        },
        module: {loaders: [{ test: /\.coffee$/, loader: "coffee-loader" }]}
      },
      ngfhir: {
        entry: "./src/adapters/ngFhir.coffee",
        output: {
          path: __dirname + "/dist",
          filename: "ngFhir.js",
          library: "ng-fhir",
          libraryTarget: "umd"
        },
        module: {loaders: [{ test: /\.coffee$/, loader: "coffee-loader" }]}
      },
      jqfhir: {
        entry: "./src/adapters/jqFhir.coffee",
        node: {
          buffer: "mock"
        },
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
