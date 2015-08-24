(function() {
    var utils = require("./utils");
    var resolve = require('./resolve');
    var query = require('./query');
    var auth = require('./middlewares/auth');
    var transport = require('./middlewares/http');
    var errors = require('./middlewares/errors');
    var config = require('./middlewares/config');
    var bundle = require('./middlewares/bundle');
    var header = require('./middlewares/header');
    var pt = require('./middlewares/patient');

    var cache = {};

    var M = require('./operation');

    var fhir = function(cfg, adapter){
        var Operation = M.Operation;
        var CatchErrors = Operation(errors);

        var Defaults = Operation(config(cfg, adapter))
                .and(CatchErrors)
                .and(auth.Basic)
                .and(auth.Bearer)
                .and(header('Accept', 'application/json'))
                .and(header('Content-Type', 'application/json'));

        var Method = M.Method;
        var GET = Defaults.and(Method('GET'));
        var POST = Defaults.and(Method('POST'));
        var PUT = Defaults.and(Method('PUT'));
        var DELETE = Defaults.and(Method('DELETE'));


        var http = transport.Http(cfg, adapter);

        var Path = M.Path;
        var BaseUrl = Path(cfg.baseUrl);
        var resourceTypePath = BaseUrl.slash(function(x){return x.type || (x.resource && x.resource.resourceType);});
        var searchPath = resourceTypePath.slash("_search");
        var _idPath = function(x){return x.id || (x.resource && x.resource.id);};
        var resourceTypeHxPath = resourceTypePath.slash("_history");
        var resourcePath = resourceTypePath.slash(_idPath);
        var resourceHxPath = resourcePath.slash("_history");
        var resourceVersionPath = resourceHxPath.slash(":versionId");

        var ReturnHeader = Operation(header('Prefer', 'return=representation'));
        var JsonData = transport.JsonData;

        var BundleRelUrl =  bundle.BundleRelUrl;
        var MagicParams = Operation(query.MagicParams);

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
            search: GET.and(searchPath).and(pt.withPatient).and(query.SearchParams).and(MagicParams).end(http),
            update: PUT.and(resourcePath).and(ReturnHeader).and(JsonData).end(http),
            nextPage: GET.and(BundleRelUrl("next")).end(http),
            prevPage: GET.and(BundleRelUrl("prev")).end(http),
            resolve: GET.and(Operation(resolve.resolve)).end(http)
        };

    };
    module.exports = fhir;
}).call(this);
