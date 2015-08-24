(function() {
    var utils = require("../utils");

    var toJson = function(x){
        return (utils.type(x) == 'object') ? JSON.stringify(x) : x;
    };

    var JsonData = function(h){
        return function(args){
            var data = args.bundle || args.data || args.resource;
            if(data){
                args.data = toJson(data);
            }
            return h(args);
        };
    };

    var Http = function(cfg, adapter){
        return function(args){
            if(args.debug){
                console.log("\nDEBUG (request):", args.method, args.url, args);
            }
            var promise = (args.http || adapter.http  || cfg.http)(args);
            if (args.debug && promise && promise.then){
                promise.then(function(x){ console.log("\nDEBUG: (responce)", x);});
            }
            return promise;
        };
    };

    exports.Http = Http;
    exports.JsonData = JsonData;

}).call(this);
