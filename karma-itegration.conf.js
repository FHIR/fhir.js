// Karma configuration
// Generated on Tue Aug 26 2014 15:55:24 GMT+0400 (MSK)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    //
    // NOTE: YUI loads JS files async in its own sandbox so we need
    // to preload all the resources into Karma because Karma context
    // cant async load.
    files: [
      'bower_components/angular/angular.min.js',
      'bower_components/jquery/dist/jquery.js',
      'bower_components/yui/build/yui/yui.js',
      'bower_components/yui/build/io-base/io-base.js',
      'bower_components/yui/build/event-custom-base/event-custom-base-min.js',
      'bower_components/yui/build/querystring-stringify-simple/querystring-stringify-simple-min.js',
      'bower_components/yui/build/datatype-xml-parse/datatype-xml-parse-min.js',
      'bower_components/yui/build/io-xdr/io-xdr-min.js',
      'bower_components/yui/build/event-base/event-base-min.js',
      'bower_components/yui/build/dom-core/dom-core-min.js',
      'bower_components/yui/build/dom-base/dom-base-min.js',
      'bower_components/yui/build/selector-native/selector-native-min.js',
      'bower_components/yui/build/selector/selector-min.js',
      'bower_components/yui/build/node-core/node-core-min.js',
      'bower_components/yui/build/dom-style/dom-style-min.js',
      'bower_components/yui/build/node-base/node-base-min.js',
      'bower_components/yui/build/io-form/io-form-min.js',
      'bower_components/yui/build/io-upload-iframe/io-upload-iframe-min.js',
      'bower_components/yui/build/queue-promote/queue-promote-min.js',
      'bower_components/yui/build/io-queue/io-queue-min.js',
      'bower_components/yui/build/oop/oop-min.js',
      'integration_test/**/*.coffee'
    ],

    // list of files to exclude
    exclude: [ '**/*.swp' ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor

    preprocessors: { '**/*.coffee': ['webpack', 'sourcemap'] },

    webpack: {
      cache: true,
      resolve: {
        extensions: ["", ".webpack.js", ".web.js", ".js", ".coffee"],
      },
      module: {
        loaders: [
          { test: /\.coffee$/, loader: "coffee-loader" }
        ]
      },
      devtool: "inline-source-map"
    },

    webpackServer: {
      stats: {
        colors: true
      }
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //browsers: ['PhantomJS'],
    browsers: ['PhantomJS_custom'],
    customLaunchers: {
      'PhantomJS_custom': {
        base: 'PhantomJS',
        options: {
          settings: {
            webSecurityEnabled: false
          }
        }
      }
    },

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
