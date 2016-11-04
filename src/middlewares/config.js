(function() {
    var copyAttr = function(from, to, attr){
        var v =  from[attr];
        if(v && !to[attr]) {to[attr] = v;}
        return from;
    };

    module.exports = function(cfg, adapter){
        return function(h){
            return function(args){
                copyAttr(cfg, args, 'baseUrl');
                copyAttr(cfg, args, 'cache');
                copyAttr(cfg, args, 'auth');
                copyAttr(cfg, args, 'patient');
                copyAttr(cfg, args, 'debug');
                copyAttr(cfg, args, 'credentials');
                copyAttr(cfg, args, 'headers');
                copyAttr(cfg, args, 'agentOptions');
                copyAttr(adapter, args, 'defer');
                copyAttr(adapter, args, 'http');
                return h(args);
            };
        };
    };
}).call(this);
