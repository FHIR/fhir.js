(function() {
    var utils = require("./utils");

    var id = function(x){return x;};
    var constantly = function(x){return function(){return x;};};

    var mwComposition = function(mw1, mw2){
        return function(h){ return mw1(mw2(h)); };
    };

    var Operation = function(mw){
        mw.and = function(nmw){
            return Operation(mwComposition(mw, nmw));
        };
        mw.end = function(h){
            return mw(h);
        };
        return mw;
    };

    var Attribute = function(attr, fn){
        return Operation(function(h){
            return function(args) {
                args[attr] = fn(args);
                return h(args);
            };
        });
    };

    var Method = function(method){
        return Attribute('method', constantly(method));
    };

    var buildPathPart = function(pth, args){
        var k = null;
        switch (utils.type(pth)) {
        case 'string':
            k = pth.indexOf(":") > -1 ? args[pth.substring(1)] : pth;
            break;
        case 'function':
            k = pth(args);
            break;
            defalut: k = pth;
        }
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
            return ((chain && chain(args)) || "") + "/"  + buildPathPart(tkn, args);
        };
        var ch = Attribute('url', new_chain);
        ch.slash = function(tkn){
            return Path(tkn, new_chain);
        };
        return ch;
    };


    exports.Path = Path;
    exports.Operation = Operation;
    exports.Attribute = Attribute;
    exports.Method = Method;
}).call(this);
