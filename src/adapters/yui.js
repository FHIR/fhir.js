(function() {
    var mkFhir = require('../fhir');

    var yui = YUI();

    var adapter = {
        http: function(args) {
            return yui.use('io', function(Y) {
                args.on = {
                    success: function(id, data, args) {
                        var headersFn = function(headerName) {return data.getResponseHeader(headerName);};
                        return args.success({data: JSON.parse(data.responseText), status: data.status, headers: headersFn, config: args});
                    },
                    failure: function(id, args) {
                        return args.error(null, args);
                    }
                };
                return Y.io(args.url, args);
            });
        }
    };

    module.exports = function(config) {
        return mkFhir(config, adapter);
    };

}).call(this);
