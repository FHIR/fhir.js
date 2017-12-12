(function () {
    var request = require('request');
    var mkFhir = require('../fhir');
    var Q = require('q');

    var adapter = {
        defer: Q.defer,
        http: function (args) {
            var deff = Q.defer();

            if (args.resource != undefined) {
                args.body = args.resource
            }
            // url should be relative to baseUrl.
            if (args.url) {
                args.url = args.url.replace(args.baseUrl, '');
            } 
            // does not like that for a transaction
            if (args.url == "") {
                args.url = "/";
            }
            args.json = true;
            if (args.debug) {
                console.log('DEBUG[node]: (request)', args);
            }
            request(args, function (err, response, body) {
                // making headers congruent to native.js
                var headers = undefined;
                var statusCode = undefined;
                if (response != undefined) {
                    headers = {
                        resp: response.headers,
                        get: function get(x) {
                            return this.resp[x.toLowerCase()]
                        }
                    }
                    statusCode = response.statusCode;
                }
                var resp = { data: body, status: statusCode, headers: headers, config: args };
                if (args.debug) {
                    console.log('DEBUG[node]: (response)', resp);
                }
                if (err || response.statusCode > 399) { deff.reject(resp); } else { deff.resolve(resp); }
            });
            return deff.promise;
        }
    };

    module.exports = function (config) {
        return mkFhir(config, adapter);
    };

}).call(this);