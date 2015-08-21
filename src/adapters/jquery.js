(function() {
    var mkFhir = require('../fhir');

    var defer = function(){
        pr = jQuery.Deferred();
        pr.promise = pr.promise();
        return pr;
    };
    var adapter = {
        defer: defer,
        http: function(args) {
            var ret = jQuery.Deferred();
            var opts = {
                type: args.method,
                url: args.url,
                headers: args.headers,
                dataType: "json",
                contentType: "application/json",
                data: args.data || args.params
            };
            jQuery.ajax(opts)
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
