(function() {
    var utils = require('../utils');

    var CONTAINED = /^#(.*)/;
    var resolveContained = function(ref, resource) {
        var cid = ref.match(CONTAINED)[1];
        var ret = (resource.contained || []).filter(function(r){
            return (r.id || r._id) == cid;
        })[0];
        return (ret && {content: ret}) || null;
    };

    var sync = function(arg) {
        var cache = arg.cache;
        var reference = arg.reference;
        var bundle = arg.bundle;
        var ref = reference;
        if (!ref.reference) {return null;}
        if (ref.reference.match(CONTAINED)) {return resolveContained(ref.reference, arg.resource);}
        var abs = utils.absoluteUrl(arg.baseUrl, ref.reference);
        var bundled = ((bundle && bundle.entry) || []).filter( function(e){
            return e.id === abs;
        })[0];
        return bundled || (cache != null ? cache[abs] : void 0) || null;
    };

    var resolve = function(h){
        return function(args) {
            var cacheMatched = sync(args);
            var ref = args.reference;
            var def = args.defer();
            if (cacheMatched) {
                if(!args.defer){ throw new Error("I need promise constructor 'adapter.defer' in adapter"); }
                def.resolve(cacheMatched);
                return def.promise;
            }
            if (!ref) {
                throw new Error("No reference found");
            }
            if (ref && ref.reference.match(CONTAINED)) {
                throw new Error("Contained resource not found");
            }
            args.url = utils.absoluteUrl(args.baseUrl, ref.reference);
            args.data = null;
            return h(args);
        };
    };

    module.exports.sync = sync;
    module.exports.resolve = resolve;

}).call(this);
