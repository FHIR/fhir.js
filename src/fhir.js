(function() {
    var utils = require("./utils"),
        M = require('./middlewares/core'),
        query = require('./middlewares/search'),
        auth = require('./middlewares/auth'),
        transport = require('./middlewares/http'),
        errors = require('./middlewares/errors'),
        config = require('./middlewares/config'),
        bundle = require('./middlewares/bundle'),
        pt = require('./middlewares/patient'),
        refs = require('./middlewares/references'),
        url = require('./middlewares/url'),
        decorate = require('./decorate'),
        cache = {};


    var fhir = function(cfg, adapter){
        var Middleware = M.Middleware,
            $$Attr = M.$$Attr;

        var $$Method = function(m){ return $$Attr('method', m);},
            $$Header = function(h,v) {return $$Attr('headers.' + h, v);};

        var  $Errors = Middleware(errors),
             Defaults = Middleware(config(cfg, adapter))
                .and($Errors)
                .and(auth.$Basic)
                .and(auth.$Bearer)
                .and(auth.$Credentials)
                .and(transport.$JsonData)
                .and($$Header('Accept', (cfg.headers && cfg.headers['Accept']) ? cfg.headers['Accept'] : 'application/json'))
                .and($$Header('Content-Type', (cfg.headers && cfg.headers['Content-Type']) ? cfg.headers['Content-Type'] : 'application/json'));

        var GET = Defaults.and($$Method('GET')),
            POST = Defaults.and($$Method('POST')),
            PUT = Defaults.and($$Method('PUT')),
            DELETE = Defaults.and($$Method('DELETE')),
            PATCH = Defaults.and($$Method('PATCH'));

        var http = transport.Http(cfg, adapter);

        var Path = url.Path,
            BaseUrl = Path(cfg.baseUrl),
            resourceTypePath = BaseUrl.slash(":type || :resource.resourceType"),
            searchPath = resourceTypePath,
            resourceTypeHxPath = resourceTypePath.slash("_history"),
            resourcePath = resourceTypePath.slash(":id || :resource.id"),
            resourceHxPath = resourcePath.slash("_history"),
            vreadPath =  resourceHxPath.slash(":versionId || :resource.meta.versionId"),
            resourceVersionPath = resourceHxPath.slash(":versionId || :resource.meta.versionId");

        var ReturnHeader = $$Header('Prefer', 'return=representation'),

            $Paging = Middleware(query.$Paging);

        return decorate({
            conformance: GET.and(BaseUrl.slash("metadata")).end(http),
            "document": POST.and(BaseUrl.slash("Document")).end(http),
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
            search: GET.and(resourceTypePath).and(pt.$WithPatient).and(query.$SearchParams).and($Paging).end(http),
            update: PUT.and(resourcePath).and(ReturnHeader).end(http),
            nextPage: GET.and(bundle.$$BundleLinkUrl("next")).end(http),
            // For previous page, bundle.link.relation can either have 'previous' or 'prev' values
            prevPage: GET.and(bundle.$$BundleLinkUrl("previous")).and(bundle.$$BundleLinkUrl("prev")).end(http),
            resolve: GET.and(refs.resolve).end(http),
            patch: PATCH.and(resourcePath).and($$Header('Content-Type', 'application/json-patch+json')).end(http)
        }, adapter);
    };
    module.exports = fhir;
}).call(this);
