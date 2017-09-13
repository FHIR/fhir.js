(function() {
    var mkFhir = require('../fhir'),

        yui = YUI(),

        io,Promise;

    yui.use('io', function(Y) {io = Y.io;});
    yui.use('promise', function(Y) {Promise = Y.Promise;});

    var defer = function(){
        var deff = {};
        var pr  = new Promise(function(res,rej){
            deff.resolve = res;
            deff.reject =  rej;
        });
        deff.promise = pr;
        return deff;
    },

    adapter = {
        http: function(args) {
            var deff = defer();
            args.on = {
                success: function(id, data, args) {
                    var headersFn = function(headerName) {return data.getResponseHeader(headerName);};
                    deff.resolve({data: data.responseText && JSON.parse(data.responseText), status: data.status, headers: headersFn, config: args});
                },
                failure: function(id, args) {
                    deff.reject(null, args);
                }
            };
            args.xdr = {
              use: "native",
              credentials: args.credentials === 'include'
            };
            io(args.url, args);
            return deff.promise;
        }
    },

    fhir = function(config) { return mkFhir(config, adapter); };
    fhir.defer = defer;
    module.exports = fhir;

}).call(this);
