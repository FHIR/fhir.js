(function() {
    var utils = require("./utils");
    var M = require('./middlewares/core');
    var query = require('./middlewares/search');
    var auth = require('./middlewares/auth');
    var transport = require('./middlewares/http');
    var errors = require('./middlewares/errors');
    var config = require('./middlewares/config');
    var bundle = require('./middlewares/bundle');
    var pt = require('./middlewares/patient');
    var refs = require('./middlewares/references');
    var url = require('./middlewares/url');
    var decorate = require('./decorate');

    var cache = {};


    var fhir = function(cfg, adapter){
        var Middleware = M.Middleware;
        var $$Attr = M.$$Attr;

        var $$Method = function(m){ return $$Attr('method', m);};
        var $$Header = function(h,v) {return $$Attr('headers.' + h, v);};

        var $Errors = Middleware(errors);
        var Defaults = Middleware(config(cfg, adapter))
                .and($Errors)
                .and(auth.$Basic)
                .and(auth.$Bearer)
                .and(auth.$Credentials)
                .and(transport.$JsonData)
                .and($$Header('Accept', (cfg.headers && cfg.headers['Accept']) ? cfg.headers['Accept'] : 'application/json'))
                .and($$Header('Content-Type', (cfg.headers && cfg.headers['Content-Type']) ? cfg.headers['Content-Type'] : 'application/json'));

        var GET = Defaults.and($$Method('GET'));
        var POST = Defaults.and($$Method('POST'));
        var PUT = Defaults.and($$Method('PUT'));
        var DELETE = Defaults.and($$Method('DELETE'));
        var PATCH = Defaults.and($$Method('PATCH'));

        var http = transport.Http(cfg, adapter);

        var Path = url.Path;
        var BaseUrl = Path(cfg.baseUrl);
        var resourceTypePath = BaseUrl.slash(":type || :resource.resourceType");
        var searchPath = resourceTypePath;
        var resourceTypeHxPath = resourceTypePath.slash("_history");
        var resourcePath = resourceTypePath.slash(":id || :resource.id");
        var resourceHxPath = resourcePath.slash("_history");
        var vreadPath =  resourcePath.slash(":versionId || :resource.meta.versionId");
        var metaTarget = BaseUrl.slash(":target.resourceType || :target.type").slash(":target.id").slash(':target.versionId');

        var ReturnHeader = $$Header('Prefer', 'return=representation');

        var $Paging = Middleware(query.$Paging);

        return decorate({
            conformance: GET.and(BaseUrl.slash("metadata")).end(http),
            document: POST.and(BaseUrl.slash("Document")).end(http),
            profile:  GET.and(BaseUrl.slash("Profile").slash(":type")).end(http),
            transaction: POST.and(BaseUrl).end(http),
            history: GET.and(BaseUrl.slash("_history")).and($Paging).end(http),
            typeHistory: GET.and(resourceTypeHxPath).and($Paging).end(http),
            resourceHistory: GET.and(resourceHxPath).and($Paging).end(http),
            read: GET.and(pt.$WithPatient).and(resourcePath).end(http),
            vread: GET.and(vreadPath).end(http),
            "delete": DELETE.and(resourcePath).and(ReturnHeader).end(http),
            create: POST.and(resourceTypePath).and(ReturnHeader).end(http),
            validate: POST.and(resourceTypePath.slash("_validate")).end(http),
            meta: {
                add: POST.and(metaTarget.slash("$meta-add")).end(http),
                delete: POST.and(metaTarget.slash("$meta-delete")).end(http),
                read: GET.and(metaTarget.slash("$meta")).end(http)
            },
            search: GET.and(resourceTypePath).and(pt.$WithPatient).and(query.$SearchParams).and($Paging).end(http),
            update: PUT.and(resourcePath).and(ReturnHeader).end(http),
            conditionalUpdate: PUT.and(resourceTypePath).and(query.$SearchParams).and(ReturnHeader).end(http),
            conditionalDelete: DELETE.and(resourceTypePath).and(query.$SearchParams).and(ReturnHeader).end(http),
            nextPage: GET.and(bundle.$$BundleLinkUrl("next")).end(http),
            // For previous page, bundle.link.relation can either have 'previous' or 'prev' values
            prevPage: GET.and(bundle.$$BundleLinkUrl("previous")).and(bundle.$$BundleLinkUrl("prev")).end(http),
            getBundleByUrl: GET.and(Path(":url")).end(http),
            resolve: GET.and(refs.resolve).end(http),
            patch: PATCH.and(resourcePath).and($$Header('Content-Type', 'application/json-patch+json')).end(http)
        }, adapter);
    };
    module.exports = fhir;
}).call(this);
