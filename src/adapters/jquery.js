(function() {
    var mkFhir = require('../fhir');
    var jquery = window['_jQuery'] || window['jQuery'];

    var defer = function(){
        pr = jquery.Deferred();
        pr.promise = pr.promise();
        return pr;
    };
    var adapter = {
        defer: defer,
        http: function(args) {
            var ret = jquery.Deferred();
            var opts = {
                type: args.method,
                url: args.url,
                headers: args.headers,
                dataType: "json",
                contentType: "application/json",
                data: args.data || args.params,
                withCredentials: args.credentials === 'include',
            };
            jquery.ajax(opts)
                .done(function(data, status, xhr) {ret.resolve({data: data, status: status, headers: xhr.getResponseHeader, config: args});})
                .fail(function(err) {ret.reject({error: err, data: err, config: args});});
            return ret.promise();
        }
    };

    var fhir = function(config) {
        return mkFhir(config, adapter);
    };
    fhir.defer = defer;
    module.exports = fhir;

}).call(this);
