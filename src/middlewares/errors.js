module.exports = function(h){
    return function(args){
        try{
            return h(args);
        }catch(e){
            if(args.debug){
               console.log("\nDEBUG: (ERROR in middleware)");
               console.log(e.message);
               console.log(e.stack);
            }
            if(!args.defer) {
                console.log("\nDEBUG: (ERROR in middleware)");
                console.log(e.message);
                console.log(e.stack);
                throw new Error("I need adapter.defer");
            }
            var deff = args.defer();
            deff.reject(e);
            return deff.promise;
        }
    };
};
