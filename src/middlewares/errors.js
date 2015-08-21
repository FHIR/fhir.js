module.exports = function(h){
    return function(args){
        try{
            return h(args);
        }catch(e){
            var error = args.error;
            if(error){ error(e); };
            if(!args.debug){
                console.log("\nDEBUG: (error in stack)");
                console.log(e.message);
                console.log(e.stack);
                throw e;
            }
            return null;
        }
    };
};
