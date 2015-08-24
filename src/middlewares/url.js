(function() {
    var utils = require("../utils");
    var core = require("./core");

    var id = function(x){return x;};
    var constantly = function(x){return function(){return x;};};

    var get_in = function(obj, path){
        return path.split('.').reduce(function(acc,x){
            if(acc == null || acc == undefined) { return null; }
            return acc[x];
        }, obj);
    };

    var evalPropsExpr = function(exp, args){
        var exps =  exp.split('||').map(function(x){return x.trim().substring(1);});
        for(var i = 0; i < exps.length; i++){
            var res = get_in(args, exps[i]);
            if(res){ return res; }
        }
        return null;
    };

    var evalExpr = function(exp, args){
        if (exp.indexOf(":") == 0){
            return evalPropsExpr(exp, args);
        } else {
            return exp;
        }
    };

    var buildPathPart = function(pth, args){
        var k = evalExpr(pth.trim(), args);
        if(k==null || k === undefined){ throw new Error("Parameter "+pth+" is required: " + JSON.stringify(args)); }
        return k;
    };

    // path chaining function
    // which return haldler wrapper: (h, cfg)->(args -> promise)
    // it's chainable Path("baseUrl").slash(":type").slash(":id").slash("_history")(id, {})({id: 5, type: 'Patient'})
    // and composable p0 = Path("baseUrl); p1 = p0.slash("path)
    var Path = function(tkn, chain){
        //Chainable
        var new_chain = function(args){
            return ((chain && (chain(args) + "/")) || "") +  buildPathPart(tkn, args);
        };
        var ch = core.Attribute('url', new_chain);
        ch.slash = function(tkn){
            return Path(tkn, new_chain);
        };
        return ch;
    };

    exports.Path = Path;
}).call(this);
