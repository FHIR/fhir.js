exports.$$BundleLinkUrl =  function(rel){
    return function(h) {
        return function(args){
            var matched = function(x){return x.relation && x.relation === rel;};
            var res =  args.bundle && (args.bundle.link || []).filter(matched)[0];
            if(res && res.url){
                args.url = res.url;
                args.data = null;
                return h(args);
            }
            else{
                throw new Error("No " + rel + " link found in bundle");
            }
        };
    };
};
