(function() {
    var utils = require("../utils");

    var id = function(x){return x;};
    var constantly = function(x){return function(){return x;};};

    var mwComposition = function(mw1, mw2){
        return function(h){ return mw1(mw2(h)); };
    };

    var Middleware = function(mw){
        mw.and = function(nmw){
            return Middleware(mwComposition(mw, nmw));
        };
        mw.end = function(h){
            return mw(h);
        };
        return mw;
    };

    // generate wm from function
    exports.$$Simple = function(f){
        return function(h){
            return function(args){
                return h(f(args));
            };
        };
    };

    var setAttr = function(args, attr, value){
        var path = attr.split('.');
        var obj = args;
        for(var i = 0; i < (path.length - 1); i++){
            var k = path[i];
            obj = args[k];
            if(!obj){
                obj = {};
                args[k] = obj;
            }
        }
        obj[path[path.length - 1]] = value;
        return args;
    };

    // generate wm from function
    exports.$$Attr = function(attr, fn){
        return Middleware(function(h){
            return function(args) {
                var value = null;
                if(utils.type(fn) == 'function'){
                   value = fn(args);
                } else {
                    value = fn;
                }
                if(value == null && value == undefined){
                    return h(args);
                }else {
                    return h(setAttr(args, attr, value));
                }
            };
        });
    };

    var Attribute = function(attr, fn){
        return Middleware(function(h){
            return function(args) {
                args[attr] = fn(args);
                return h(args);
            };
        });
    };

    var Method = function(method){
        return Attribute('method', constantly(method));
    };

    exports.Middleware = Middleware;
    exports.Attribute = Attribute;
    exports.Method = Method;

}).call(this);
