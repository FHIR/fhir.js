(function() {
    var utils = require("./utils");
    var resolve = require('./resolve');
    var queryBuider = require('./query');
    var auth = require('./middlewares/auth');

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

    // TODO work better with promises
    var ContentLocation = Operation(function(h){
        return function(args){
            var success = args.success;
            args.success = function(data, status, headers, config){
                var uri = headers('Content-Location');
                success(uri, status, headers, config);
            };
            return h(args);
        };
    });

    var toJson = function(x){
        return (utils.type(x) == 'object') ? JSON.stringify(x) : x;
    };

    var JsonData = Attribute('data', function(args){
        var data = args.bundle || args.data || args.resource;
        return data && toJson(data);
    });

    var BundleRelUrl =  function(rel){
        return Attribute('url', function(args){
            var matched = function(x){return x.rel && x.rel === rel;};
            var res =  args.bundle && (args.bundle.link || []).filter(matched)[0];
            if(res && res.href){ return res.href; }
            else{ throw new Error("No " + rel + " link found in bundle");}
        });
    };

    var CatchErrors = Operation(function(h){
        return function(args){
            try{
                return h(args);
            }catch(e){
               var error = args.error;
               console.log('Error', e.message);
               console.log(e.stack);
               if(error){ error(e); };
               return null;
            }
      };
    });

    var InjectConfig = function(cfg){
        return Operation(function(h){
            return function(args){
                args.baseUrl = cfg.baseUrl;
                args.cache = cache;
                args.auth = args.auth || cfg.auth;
                return h(args);
            };
        });
    };


    var Http = function(cfg, adapter){
        return function(args){
            return (args.http || adapter.http  || cfg.http)(args);
        };
    };

    var searchParams = Attribute('url', function(args){
        var url = args.url;
        var queryStr = queryBuider.query(args.query);
        return url + "?" + queryStr;
    });

    var fhir = function(cfg, adapter){
        var Defaults = InjectConfig(cfg)
                .and(CatchErrors)
                .and(auth.Basic)
                .and(auth.Bearer);

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
            "delete": DELETE.and(resourcePath).end(http),
            create: POST.and(resourceTypePath).and(ContentLocation).and(JsonData).end(http),
            validate: POST.and(resourceTypePath.slash("_validate")).and(ContentLocation).and(JsonData).end(http),
            search: GET.and(searchPath).and(searchParams).and(MagicParams).end(http),
            update: PUT.and(resourcePath).and(ContentLocation).and(JsonData).end(http),
            nextPage: GET.and(BundleRelUrl("next")).end(http),
            prevPage: GET.and(BundleRelUrl("prev")).end(http),
            resolve: GET.and(Operation(resolve.resolve)).end(http)
        };

    };
    module.exports = fhir;
}).call(this);
