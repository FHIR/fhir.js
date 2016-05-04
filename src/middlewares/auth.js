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

    var credentials;
    // this first middleware sets the credentials attribute to empty, so
    // adapters cannot use it directly, thus enforcing a valid value to be parsed in.
    exports.$Credentials = mw.Middleware(mw.$$Attr('credentials', function(args){
      // Assign value for later checking
      credentials = args.credentials

      // Needs to return non-null and not-undefined
      // in order for value to be (un)set
      return '';
    })).and(mw.$$Attr('credentials', function(args){
        // check credentials for valid options, valid for fetch
        if(['same-origin', 'include'].indexOf(credentials) > -1 ){
            return credentials;
        }
    }));

}).call(this);
