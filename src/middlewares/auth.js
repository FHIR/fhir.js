(function() {
    var mw = require('./core');

    var btoa = require('Base64').btoa;

    exports.$Basic = mw.$$Attr('headers.Authorization', function(args){
        if(args.auth && args.auth.user && args.auth.pass){
            return "Basic " + btoa(args.auth.user + ":" + args.auth.pass);
        }
    });

    exports.$Bearer = mw.$$Attr('headers.Authorization', function(args){
        if(args.auth && args.auth.bearer){
            return "Bearer " + args.auth.bearer;
        }
    });

}).call(this);
