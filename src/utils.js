(function() {
  var merge = require('merge');

  var RTRIM = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

  var trim = function(text) {
    return text ? text.toString().replace(RTRIM, "")  : "";
  };

  exports.trim = trim;

  var addKey = function(acc, str) {
    var pair, val;
    if (!str) {
      return null;
    }
    pair = str.split("=").map(trim);
    val = pair[1].replace(/(^"|"$)/g, '');
    if (val) {
      acc[pair[0]] = val;
    }
    return acc;
  };

  var type = function(obj) {
    var classToType;
    if (obj == null && obj === undefined) {
      return String(obj);
    }
    classToType = {
      '[object Boolean]': 'boolean',
      '[object Number]': 'number',
      '[object String]': 'string',
      '[object Function]': 'function',
      '[object Array]': 'array',
      '[object Date]': 'date',
      '[object RegExp]': 'regexp',
      '[object Object]': 'object'
    };
    return classToType[Object.prototype.toString.call(obj)];
  };

  exports.type = type;

  var assertArray = function(a) {
    if (type(a) !== 'array') {
      throw 'not array';
    }
    return a;
  };

  exports.assertArray = assertArray;

  var assertObject = function(a) {
    if (type(a) !== 'object') {
      throw 'not object';
    }
    return a;
  };

  exports.assertObject = assertObject;

  var reduceMap = function(m, fn, acc) {
    var k, v;
    acc || (acc = []);
    assertObject(m);
    return ((function() {
      var results;
      results = [];
      for (k in m) {
        v = m[k];
        results.push([k, v]);
      }
      return results;
    })()).reduce(fn, acc);
  };

  exports.reduceMap = reduceMap;

  var identity = function(x) {return x;};

  exports.identity = identity;

  var argsArray = function() {
     return Array.prototype.slice.call(arguments)
  };

  exports.argsArray = argsArray;

  var mergeLists = function() {
    var reduce;
    reduce = function(merged, nextMap) {
      var k, ret, v;
      ret = merge(true, merged);
      for (k in nextMap) {
        v = nextMap[k];
        ret[k] = (ret[k] || []).concat(v);
      }
      return ret;
    };
    return argsArray.apply(null, arguments).reduce(reduce, {});
  };

  exports.mergeLists = mergeLists;

  var absoluteUrl = function(baseUrl, ref) {
    if (!ref.match(/https?:\/\/./)) {
      return baseUrl + "/" + ref;
    } else {
      return ref;
    }
  };

  exports.absoluteUrl = absoluteUrl;

  var relativeUrl = function(baseUrl, ref) {
    if (ref.slice(ref, baseUrl.length + 1) === baseUrl + "/") {
      return ref.slice(baseUrl.length + 1);
    } else {
      return ref;
    }
  };

  exports.relativeUrl = relativeUrl;

  exports.resourceIdToUrl = function(id, baseUrl, type) {
    baseUrl = baseUrl.replace(/\/$/, '');
    id = id.replace(/^\//, '');
    if (id.indexOf('/') < 0) {
      return baseUrl + "/" + type + "/" + id;
    } else if (id.indexOf(baseUrl) !== 0) {
      return baseUrl + "/" + id;
    } else {
      return id;
    }
  };

  var walk = function(inner, outer, data, context) {
    var keysToMap, remapped;
    switch (type(data)) {
      case 'array':
        return outer(data.map(function(item) {
          return inner(item, [data, context]);
        }), context);
      case 'object':
        keysToMap = function(acc, arg) {
          var k, v;
          k = arg[0], v = arg[1];
          acc[k] = inner(v, [data].concat(context));
          return acc;
        };
        remapped = reduceMap(data, keysToMap, {});
        return outer(remapped, context);
      default:
        return outer(data, context);
    }
  };

  exports.walk = walk;

  var postwalk = function(f, data, context) {
    if (!data) {
      return function(data, context) {
        return postwalk(f, data, context);
      };
    } else {
      return walk(postwalk(f), f, data, context);
    }
  };

  exports.postwalk = postwalk;

}).call(this);
