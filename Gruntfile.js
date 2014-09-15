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
        module: {loaders: [{ test: /\.coffee$/, loader: "coffee-loader" }]},
        resolve: {
          extensions: ["", ".webpack.js", ".web.js", ".js", ".coffee"],
        },

      },
      ngfhir: {
        entry: "./src/adapters/angularjs.coffee",
        output: {
          path: __dirname + "/dist",
          filename: "ngFhir.js",
          library: "ng-fhir",
          libraryTarget: "umd"
        },
        module: {loaders: [{ test: /\.coffee$/, loader: "coffee-loader" }]},
        resolve: {
          extensions: ["", ".webpack.js", ".web.js", ".js", ".coffee"],
        },

      },
      jqfhir: {
        entry: "./src/adapters/jquery.coffee",
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
        module: {loaders: [{ test: /\.coffee$/, loader: "coffee-loader" }]},
        resolve: {
          extensions: ["", ".webpack.js", ".web.js", ".js", ".coffee"],
        },

      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-webpack');
  grunt.registerTask('default', ['clean', 'webpack']);
};
