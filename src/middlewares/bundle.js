exports.$$BundleLinkUrl =  function(rel){
    return function(h) {
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
    };
};
