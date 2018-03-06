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
              args.body = JSON.parse(args.data);
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
            if(args.debug){
                console.log('DEBUG[node]: (requrest)', args); 
            }
            request(args, function(err, response, body) {
                var headers = function(x) {return response.headers[x.toLowerCase()];};
                var resp = {data: body, status: response.statusCode, headers: headers, config: args};
                if(args.debug){
                    console.log('DEBUG[node]: (responce)', resp); 
                }
                if (err || response.statusCode > 399) {deff.reject(resp);} else {deff.resolve(resp);}
            }) ;
            return deff.promise;
        }
    };

    module.exports = function(config) {
        return mkFhir(config, adapter);
    };

}).call(this);
