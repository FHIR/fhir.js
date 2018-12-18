var wp = require('./webpack.config.js');
wp.externals = {
    './module': 'angular.module("formstamp")'
};

delete wp.entry;
delete wp.context;
delete wp.output;

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],

    // plugins
    plugins: ['karma-mocha', 'karma-webpack', 'karma-chrome-launcher'],


    // list of files / patterns to load in the browser
    //
    // NOTE: YUI loads JS files async in its own sandbox so we need
    // to preload all the resources into Karma because Karma context
    // cant async load.
    files: [
      'node_modules/jquery/dist/jquery.js',
      'node_modules/angular/angular.min.js',
      'node_modules/yui/yui/yui.js',
      'node_modules/yui/promise/promise.js',
      'node_modules/yui/io-base/io-base.js',
      'node_modules/yui/event-custom-base/event-custom-base-min.js',
      'node_modules/yui/querystring-stringify-simple/querystring-stringify-simple-min.js',
      'node_modules/yui/datatype-xml-parse/datatype-xml-parse-min.js',
      'node_modules/yui/io-xdr/io-xdr-min.js',
      'node_modules/yui/event-base/event-base-min.js',
      'node_modules/yui/dom-core/dom-core-min.js',
      'node_modules/yui/timers/timers.js',
      'node_modules/yui/dom-base/dom-base-min.js',
      'node_modules/yui/selector-native/selector-native-min.js',
      'node_modules/yui/selector/selector-min.js',
      'node_modules/yui/node-core/node-core-min.js',
      'node_modules/yui/dom-style/dom-style-min.js',
      'node_modules/yui/node-base/node-base-min.js',
      'node_modules/yui/io-form/io-form-min.js',
      'node_modules/yui/io-upload-iframe/io-upload-iframe-min.js',
      'node_modules/yui/queue-promote/queue-promote-min.js',
      'node_modules/yui/io-queue/io-queue-min.js',
      'node_modules/yui/oop/oop-min.js',
      'test/**/*.coffee',
      'integration_test/**/*.coffee'
    ],

    // list of files to exclude
    exclude: [ '**/*.swp', 'test/nodeAdapterSpec.coffee'],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor

    preprocessors: { '**/*.coffee': ['webpack'] },

    webpack: wp,

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
    browsers: ['ChromeNoSecurity'],
    customLaunchers: {
      ChromeNoSecurity: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-web-security',
          '--disable-extensions'
        ]
      }
    },
    /*
    browsers: ['PhantomJS_custom'],
    customLaunchers: {
      'PhantomJS_custom': {
        base: 'PhantomJS',
        options: {
          settings: {
            webSecurityEnabled: false,
            browserNoActivityTimeout: 40000
          }
        }
      }
    },
    */
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
