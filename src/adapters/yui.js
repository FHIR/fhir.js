(function() {
  var mkFhir = require('../fhir');

  var yui = YUI();

  var adapter = {
    http: function(args) {
      return yui.use('io', function(Y) {
        args.headers = args.headers || {};
        args.headers["Accept"] = "application/json";
        args.headers["Content-Type"] = "application/json; charset=utf-8";
        args.on = {
          success: function(id, data, args) {
            var headersFn = function(headerName) {return data.getResponseHeader(headerName);};
            return args.success(JSON.parse(data.responseText), data.status, headersFn);
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
