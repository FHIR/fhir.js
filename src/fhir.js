(function() {
    var wrap = require("./wrap");
    var utils = require("./utils");
    var resolve = require('./resolve');
    var merge = require('merge');
    var queryBuider = require('./query');
    var cache = {};
    var constantly = function(x){return function(){return x;};};

    var buildParams = function(args, params){
        params = params || {};
        if(args.since){params._since = args.since;}
        if(args.count){params._count = args.count;}
        return params;
    };

    //I do not like this
    var wrapContentLocation = function(h){
        return function(args){
            var success = args.success;
            args.success = function(data, status, headers, config){
                var uri = headers('Content-Location');
                success(uri, config);
            };
            return h(args);
        };
    };

    var errors = function(arg,keys){
        var k;
        var noerrors = true;
        var res = {};
        for(k in keys){
            if(!arg[k]){
                noerrors = false;
                res[k] = keys[k];
            }
        }
        if(noerrors){
           return null;
        }else{
           return res;
        }
    };

    var emptyFn = function(){};
    var fhir = function(cfg, adapter) {
        var middlewares = cfg.middlewares || {};
        var http = wrap(cfg, adapter.http, middlewares.http);
        var baseUrl = cfg.baseUrl;
        var toJson = function(resource){
            if(utils.type(resource) == 'object'){
                return JSON.stringify(resource);
            }else{
                return resource;
            }
        };
        var Operation = function(method, pathFn, withCache){
            if(!pathFn) { throw new Error("I need pathFn(args)"); }
            return function(arg){
                opts = {
                        method: method,
                        url: baseUrl + pathFn(arg),
                        params: buildParams(arg, arg.params),
                        success: arg.success || emptyFn,
                        error: arg.error || emptyFn
                    };
                var data = arg.bundle || arg.data;
                if(data){ opts.data = toJson(data); }
                if(withCache && cfg.cache){ opts.cache = cache[baseUrl];}
                return http(opts);
            };
        };

        var processPath = function(pth, args){
            if(pth.indexOf(":") > -1){
                var k = args[pth.substring(1)];
                if(k){
                    return k;
                }else{
                    throw new Error("Parameter "+pth+" is required: " + JSON.stringify(args));
                }
            }else{
                return pth;
            }
        };
        var path = function(h, pth){
            if(!pth){
                pth = h;
                h = false;
            }
            return function(args){
                return (h ? h(args) : "") + "/" + processPath(pth, args) ;
            };
        };
        var resourceTypePath = path(":type");
        var resourceTypeHxPath = path(resourceTypePath, "_history");
        var resourcePath = path(resourceTypePath, ":id");
        var resourceHxPath = path(resourcePath, "/_history");
        var resourceVersionPath = path(resourceHxPath, "/:versionId");

        var bundleRelPath =  function(rel){
            return function(args){
                var matched = function(x){return x.rel && x.rel == rel;}
                var res =  bundle && (bundle.link || []).find(matched)[0];
                if(res){
                    return res;
                }else{
                    throw new Error("No " + rel + " link found in bundle");
                }
            };
        };

        var searchPath =  function(args){
            var pth = resourceTypePath(args) + "/_search";
            var queryStr = queryBuider.query(args.query);
            return pth + "?" + queryStr;
        };

        return {
            conformance: Operation('GET', path('metadata')),
            document: Operation('POST', path('/Document')),
            profile: Operation('GET', path(path("Profile"), ":type")),
            transaction: Operation('POST', path('')),
            history: Operation('GET', path('_history')),
            typeHistory: Operation('GET', resourceTypeHxPath),
            resourceHistory: Operation('GET', resourceHxPath),
            read: Operation('GET', resourcePath),
            vread: Operation('GET', resourceVersionPath),
            "delete": Operation('DELETE', resourcePath),
            create: wrapContentLocation(Operation('POST', resourceTypePath)),
            validate: Operation('POST', path(resourceTypePath, "_validate")),
            // TODO fix wrap
            search: Operation('POST', searchPath),
            update: wrapContentLocation(Operation('PUT', resourcePath)),
            nextPage: Operation('POST', bundleRelPath("next")),
            prevPage: Operation('POST', bundleRelPath("prev")),
            resolve: function(opt) {
                return resolve.async(depsWithCache(opt));
            },
            resolveSync: function(opt) {
                return resolve.sync(depsWithCache(opt));
            }
        };
    };

    module.exports = fhir;

}).call(this);
