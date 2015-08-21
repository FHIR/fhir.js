// header middleware constructor
module.exports = function(header, value){
    return function(h){
        return function(args){
            args.headers = args.headers || {};
            var current = args.headers[header];
            if(current && args.debug){console.log("Attempt to rewrite header " + header + " " + current + " with " + value);}
            args.headers[header] = value;
            return h(args);
        };
    };
};
