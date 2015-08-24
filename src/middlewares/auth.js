(function() {

  var btoa = require('Base64').btoa;

  var authHeader = function(args, val) {
      args.headers = args.headers ||  {};
      args.headers["Authorization"] = val;
      return args;
  };

  var Basic = function(h){
      return function(args){
          if(args.auth && args.auth.user && args.auth.pass){
              authHeader(args, "Basic " + btoa(args.auth.user + ":" + args.auth.pass));
          }
          return h(args);
      };
  };

  var Bearer = function(h){
      return function(args){
          if(args.auth && args.auth.bearer){
              authHeader(args, "Bearer " + args.auth.bearer);
          }
          return h(args);
      };
  };

  exports.Basic = Basic;
  exports.Bearer = Bearer;

}).call(this);
