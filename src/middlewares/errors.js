module.exports = function(h){
    return function(args){
        try{
            return h(args);
        }catch(e){
            if(args.debug){
                console.log("\nDEBUG: (Error middle ware)");
                console.log(e.message);
                console.log(e.stack);
                throw e;
            }
            var deff = args.defer();
            deff.reject(e);
            return deff.promise;
        }
    };
};
