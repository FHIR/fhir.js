(function() {
    var utils = require("./utils");
    var resolve = require('./resolve');
    var queryBuider = require('./query');
    var auth = require('./middlewares/auth');
    var errors = require('./middlewares/errors');
    var header = require('./middlewares/header');
    var pt = require('./middlewares/patient');

    var cache = {};

    var constantly = function(x){return function(){return x;};};

    var M = require('./operation');
    var Operation = M.Operation;
    var Path = M.Path;
    var Method = M.Method;
    var Attribute = M.Attribute;

    var MagicParams = Attribute('params', function(args){
        var params = args.params || {};
        if(args.since){params._since = args.since;}
        if(args.count){params._count = args.count;}
        return params;
    });

    var toJson = function(x){
        return (utils.type(x) == 'object') ? JSON.stringify(x) : x;
    };

    var JsonData = Attribute('data', function(args){
        var data = args.bundle || args.data || args.resource;
        return data && toJson(data);
    });

    var BundleRelUrl =  function(rel){
        return Operation(function(h) {
            return function(args){
                var matched = function(x){return x.rel && x.rel === rel;};
                var res =  args.bundle && (args.bundle.link || []).filter(matched)[0];
                if(res && res.href){
                    args.url = res.href;
                    return h(args);
                }
                else{
                    throw new Error("No " + rel + " link found in bundle");
                }
            };
        });
    };

    var CatchErrors = Operation(errors);
    var ReturnHeader = Operation(header('Prefer', 'return=representation'));

    var copyAttr = function(from, to, attr){
        var v =  from[attr];
        if(v && !to[attr]) {to[attr] = v;}
        return from;
    };

    var InjectConfig = function(cfg, adapter){
        return Operation(function(h){
            return function(args){
                copyAttr(cfg, args, 'baseUrl');
                copyAttr(cfg, args, 'cache');
                copyAttr(cfg, args, 'auth');
                copyAttr(cfg, args, 'patient');
                copyAttr(cfg, args, 'debug');
                copyAttr(adapter, args, 'defer');
                copyAttr(adapter, args, 'http');
                return h(args);
            };
        });
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

    var searchParams = Attribute('url', function(args){
        var url = args.url;
        var queryStr = queryBuider.query(args.query);
        return url + "?" + queryStr;
    });

    var fhir = function(cfg, adapter){
        var Defaults = InjectConfig(cfg, adapter)
                .and(CatchErrors)
                .and(auth.Basic)
                .and(auth.Bearer)
                .and(header('Accept', 'application/json'))
                .and(header('Content-Type', 'application/json'));

        var GET = Defaults.and(Method('GET'));
        var POST = Defaults.and(Method('POST'));
        var PUT = Defaults.and(Method('PUT'));
        var DELETE = Defaults.and(Method('DELETE'));

        var http = Http(cfg, adapter);

        var BaseUrl = Path(cfg.baseUrl);
        var resourceTypePath = BaseUrl.slash(function(x){return x.type || (x.resource && x.resource.resourceType);});
        var searchPath = resourceTypePath.slash("_search");
        var _idPath = function(x){return x.id || (x.resource && x.resource.id);};
        var resourceTypeHxPath = resourceTypePath.slash("_history");
        var resourcePath = resourceTypePath.slash(_idPath);
        var resourceHxPath = resourcePath.slash("_history");
        var resourceVersionPath = resourceHxPath.slash(":versionId");

        return {
            conformance: GET.and(BaseUrl.slash("metadata")).end(http),
            document: POST.and(BaseUrl.slash("Document")).end(http),
            profile:  GET.and(BaseUrl.slash("Profile").slash(":type")).end(http),
            transaction: POST.and(BaseUrl).and(JsonData).end(http),
            history: GET.and(BaseUrl.slash("_history")).and(MagicParams).end(http),
            typeHistory: GET.and(resourceTypeHxPath).and(MagicParams).end(http),
            resourceHistory: GET.and(resourceHxPath).and(MagicParams).end(http),
            read: GET.and(resourcePath).end(http),
            vread: GET.and(resourceHxPath).end(http),
            "delete": DELETE.and(resourcePath).and(ReturnHeader).end(http),
            create: POST.and(resourceTypePath).and(ReturnHeader).and(JsonData).end(http),
            validate: POST.and(resourceTypePath.slash("_validate")).and(JsonData).end(http),
            search: GET.and(searchPath).and(pt.withPatient).and(searchParams).and(MagicParams).end(http),
            update: PUT.and(resourcePath).and(ReturnHeader).and(JsonData).end(http),
            nextPage: GET.and(BundleRelUrl("next")).end(http),
            prevPage: GET.and(BundleRelUrl("prev")).end(http),
            resolve: GET.and(Operation(resolve.resolve)).end(http)
        };

    };
    module.exports = fhir;
}).call(this);
