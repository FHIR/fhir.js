(function() {
    var request = require('request');
    var mkFhir = require('../fhir');
    var Q = require('q');

    var adapter = {
        defer: Q.defer,
        http: function(args) {
            var deff = Q.defer();
            if(args.data && typeof args.data === "string") {
              // Setting args.json requires args.body to be a JSON as per request docs.
              try {
                args.body = JSON.parse(args.data);
              }
              catch (e) {
                throw new Error('Failed to parse. Expected JSON data...');
              }
            }
            else if (args.data) {
              args.body = args.data;
            }
            // url should be relative to baseUrl.
            if(args.url) {
                args.url = args.url.replace(args.baseUrl, '');
            }
            if(args.url === '') {
              args.url = '/';
            }
            args.json = true;
            if(args.debug) {
                console.log('DEBUG[node]: (request)', args);
            }
            request(args, function(err, response, body) {
                var headers = function(x) {return response.headers[x.toLowerCase()];};
                var statusCode = response ? response.statusCode : 500; // in case host is unreachable

                var resp = {data: body, status: statusCode, headers: headers, config: args};

                if(args.debug){
                    console.log('DEBUG[node]: (response)', resp);
                }
                if (err || statusCode > 399) {deff.reject(resp);} else {deff.resolve(resp);}
            }) ;
            return deff.promise;
        }
    };

    module.exports = function(config) {
        return mkFhir(config, adapter);
    };

}).call(this);
