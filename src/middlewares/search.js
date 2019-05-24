(function() {
  var utils = require('../utils');

  var type = utils.type;

  var assertArray = utils.assertArray;

  var assertObject = utils.assertObject;

  var reduceMap = utils.reduceMap;

  var identity = utils.identity;

  var OPERATORS = {
    $gt: 'gt',
    $lt: 'lt',
    $lte: 'lte',
    $gte: 'gte',
    $ge: 'ge',
    $le: 'le'
  };

  var MODIFIERS = {
    $asc: ':asc',
    $desc: ':desc',
    $exact: ':exact',
    $missing: ':missing',
    $null: ':missing',
    $text: ':text'
  };

  var isOperator = function(v) {
    return v.indexOf('$') === 0;
  };

  var expandParam = function(k, v) {
    return reduceMap(v, function(acc, arg) {
      var kk, o, res, vv;
      kk = arg[0], vv = arg[1];
      return acc.concat(kk === '$and' ? assertArray(vv).reduce((function(a, vvv) {
        return a.concat(linearizeOne(k, vvv));
      }), []) : kk === '$type' ? [] : isOperator(kk) ? (o = {
        param: k
      }, kk === '$or' ? o.value = vv : (OPERATORS[kk] ? o.operator = OPERATORS[kk] : void 0, MODIFIERS[kk] ? o.modifier = MODIFIERS[kk] : void 0, type(vv) === 'object' && vv.$or ? o.value = vv.$or : o.value = [vv]), [o]) : (v.$type ? res = ":" + v.$type : void 0, linearizeOne("" + k + (res || '') + "." + kk, vv)));
    });
  };

  var handleSort = function(xs) {
    var i, len, results, x;
    assertArray(xs);
    results = [];
    for (i = 0, len = xs.length; i < len; i++) {
      x = xs[i];
      switch (type(x)) {
      case 'array':
        results.push({
          param: '_sort',
          value: x[0],
          modifier: ":" + x[1]
        });
        break;
      case 'string':
        results.push({
          param: '_sort',
          value: x
        });
        break;
      default:
        results.push(void 0);
      }
    }
    return results;
  };

  var handleInclude = function(includes, key) {
    return reduceMap(includes, function(acc, arg) {
      var k, v;
      k = arg[0], v = arg[1];
      return acc.concat((function() {
        switch (type(v)) {
        case 'array':
          return v.map(function(x) {
            return {
              param: key === '$include' ? '_include' : '_revinclude',
              value: k + ":" + x
            };
          });
        case 'string':
          return [
            {
              param: key === '$include' ? '_include' : '_revinclude',
              value: k + ":" + v
            }
          ];
        }
      })());
    });
  };
  var handleHas = function(includes, key) {
    return reduceMap(includes, function(acc, arg) {
      var k, v;
      k = arg[0], v = arg[1];
      return acc.concat((function() {
        switch (type(v)) {
        case 'array':
          return v.map(function(x) {
            return {
              param: '_has',
              value: k + "=" + x
            };
          });
        case 'string':
          return [
            {
              param: '_has',
              value: k + "=" + v
            }
          ];
        }
      })());
    });
  };
  var linearizeOne = function(k, v) {
    if (k === '$sort') {
      return handleSort(v);
    } else if (k === '$has') {
      return handleHas(v, k);
    } else if (k === '$include' || k === '$revInclude') {
      return handleInclude(v, k);
    } else {
      switch (type(v)) {
      case 'object':
        return expandParam(k, v);
      case 'string':
        return [
          {
            param: k,
            value: [v]
          }
        ];
      case 'number':
        return [
          {
            param: k,
            value: [v]
          }
        ];
      case 'array':
        return [
          {
            param: k,
            value: [v.join("|")]
          }
        ];
      default:
        throw "could not linearizeParams " + (type(v));
      }
    }
  };

  var linearizeParams = function(query) {
    return reduceMap(query, function(acc, arg) {
      var k, v;
      k = arg[0], v = arg[1];
      return acc.concat(linearizeOne(k, v));
    });
  };

  var buildSearchParams = function(query) {
    var p, ps, value;
    var excludeEncode = ['_include', '_revinclude', '_has']
    ps = (function() {
      var i, len, ref, results;
      ref = linearizeParams(query);
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        p = ref[i];
        if (excludeEncode.indexOf(p.param) === -1)
          value = encodeURIComponent(p.value);
        else
          value = p.value
        results.push([p.param, p.modifier, (p.param == '_has') ? ':' : '=', p.operator, value].filter(identity).join(''));
      }
      return results;
    })();
    return ps.join("&");
  };

  exports._query = linearizeParams;

  exports.query = buildSearchParams;

  var mw = require('./core');

  exports.$SearchParams = mw.$$Attr('url', function(args){
    var url = args.url;
    if(args.query){
      var queryStr = buildSearchParams(args.query);
      return url + "?" + queryStr;
    }
    return url;
  });


  exports.$Paging = function(h){
    return function(args){
      var params = args.params || {};
      if(args.since){params._since = args.since;}
      if(args.count){params._count = args.count;}
      args.params = params;
      return h(args);
    };
  };


}).call(this);
