(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["ng-fhir"] = factory();
	else
		root["ng-fhir"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var ng = __webpack_require__(1)
	ng.ngInit()


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var fhir, implementXhr;

	fhir = __webpack_require__(2);

	implementXhr = function($http) {
	  return function(q) {
	    var p;
	    console.log('ng-xhr', q);
	    p = $http({
	      method: q.method,
	      url: q.url
	    });
	    if (q.success) {
	      p.success(q.success);
	    }
	    if (q.error) {
	      p.error(q.error);
	    }
	    return p;
	  };
	};

	angular.module('ng-fhir', []);

	angular.module('ng-fhir').provider('$fhir', function() {
	  return {
	    $get: function($http) {
	      fhir.setAdapter({
	        xhr: implementXhr($http)
	      });
	      return {
	        fhir: fhir,
	        search: fhir.search,
	        conformance: fhir.conformance,
	        profile: fhir.profile
	      };
	    }
	  };
	});

	exports.ngInit = function() {
	  return console.log('ng initialized');
	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var adapter = __webpack_require__(3);
	var cfg = __webpack_require__(4);

	var search = __webpack_require__(5);
	var conf = __webpack_require__(6);
	var tags = __webpack_require__(7);

	exports.setAdapter = adapter.setAdapter
	exports.configure = cfg.configure
	exports.config = cfg.config

	exports.search = search.search;
	exports.conformance = conf.conformance;
	exports.profile = conf.profile;

	exports.tags = tags.tags;
	exports.affixTags = tags.affixTags;
	exports.removeTags = tags.removeTags;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var adapter;

	adapter = null;

	exports.setAdapter = function(x) {
	  return adapter = x;
	};

	exports.getAdapter = function() {
	  return adapter;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var config;

	config = {};

	exports.config = config;

	exports.configure = function(m) {
	  var k, v, _results;
	  _results = [];
	  for (k in m) {
	    v = m[k];
	    _results.push(config[k] = v);
	  }
	  return _results;
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var adapter, base, cfg, queryBuider, searchResource;

	adapter = __webpack_require__(3);

	queryBuider = __webpack_require__(8);

	cfg = __webpack_require__(4);

	base = function() {
	  return adapter.getAdapter();
	};

	searchResource = function(type, query, cb, err) {
	  var queryStr, uri;
	  queryStr = queryBuider.query(query);
	  uri = "" + cfg.config.baseUrl + "/" + type + "/_search?" + queryStr;
	  return base().xhr({
	    method: 'GET',
	    url: uri,
	    success: function(data) {
	      if (cb) {
	        return cb(data);
	      }
	    },
	    error: function(e) {
	      if (err) {
	        return err(e);
	      }
	    }
	  });
	};

	exports.search = searchResource;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var adapter, base, conf;

	adapter = __webpack_require__(3);

	conf = __webpack_require__(4);

	base = function() {
	  return adapter.getAdapter();
	};

	exports.conformance = function(cb, err) {
	  return base().xhr({
	    method: 'GET',
	    url: "" + conf.config.baseUrl + "/metadata",
	    success: cb,
	    error: err
	  });
	};

	exports.profile = function(type, cb, err) {
	  return base().xhr({
	    method: 'GET',
	    url: "" + conf.config.baseUrl + "/Profile/" + type,
	    success: cb,
	    error: err
	  });
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var adapter, affixTags, affixTagsToResource, affixTagsToResourceVersion, removeTags, removeTagsFromResource, removeTagsFromResourceVerson, tags, tagsAll, tagsResource, tagsResourceType, tagsResourceVersion;

	adapter = __webpack_require__(3);

	tagsAll = function() {
	  return console.log('impl me');
	};

	tagsResourceType = function(type) {
	  return console.log('impl me');
	};

	tagsResource = function(type, id) {
	  return console.log('impl me');
	};

	tagsResourceVersion = function(type, id, vid) {
	  return console.log('impl me');
	};

	tags = function() {
	  switch (arguments.length) {
	    case 0:
	      return tagsAll();
	    case 1:
	      return tagsResourceType.apply(null, arguments);
	    case 2:
	      return tagsResource.apply(null, arguments);
	    case 3:
	      return tagsResourceVersion.apply(null, arguments);
	    default:
	      throw "wrong arity";
	  }
	};

	affixTagsToResource = function(type, id, tags) {
	  return console.log('impl me');
	};

	affixTagsToResourceVersion = function(type, id, vid, tags) {
	  return console.log('impl me');
	};

	affixTags = function() {
	  switch (arguments.length) {
	    case 3:
	      return affixTagsToResource.apply(null, arguments);
	    case 4:
	      return affixTagsToResourceVersion.apply(null, arguments);
	    default:
	      throw "wrong arity: expected (type,id,tags) or (type,id,vid,tags)";
	  }
	};

	removeTagsFromResource = function(type, id) {
	  return console.log('impl me');
	};

	removeTagsFromResourceVerson = function(type, id, vid) {
	  return console.log('impl me');
	};

	removeTags = function() {
	  switch (arguments.length) {
	    case 2:
	      return removeTagsFromResource.apply(null, arguments);
	    case 3:
	      return removeTagsFromResourceVerson.apply(null, arguments);
	    default:
	      throw "wrong arity: expected (type,id) or (type,id,vid)";
	  }
	};

	exports.tags = tags;

	exports.affixTags = affixTags;

	exports.removeTags = removeTags;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var MODIFIERS, OPERATORS, assertArray, assertObject, buildSearchParams, expandParam, handleInclude, handleSort, identity, isOperator, linearizeOne, linearizeParams, reduceMap, type;

	type = function(obj) {
	  var classToType;
	  if (obj === void 0 || obj === null) {
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

	assertArray = function(a) {
	  if (type(a) !== 'array') {
	    throw 'not array';
	  }
	  return a;
	};

	assertObject = function(a) {
	  if (type(a) !== 'object') {
	    throw 'not object';
	  }
	  return a;
	};

	reduceMap = function(m, fn, acc) {
	  var k, v;
	  acc || (acc = []);
	  assertObject(m);
	  return ((function() {
	    var _results;
	    _results = [];
	    for (k in m) {
	      v = m[k];
	      _results.push([k, v]);
	    }
	    return _results;
	  })()).reduce(fn, acc);
	};

	identity = function(x) {
	  return x;
	};

	OPERATORS = {
	  $gt: '>',
	  $lt: '<',
	  $lte: '<=',
	  $gte: '>='
	};

	MODIFIERS = {
	  $asc: ':asc',
	  $desc: ':desc',
	  $exact: ':exact',
	  $missing: ':missing',
	  $null: ':missing',
	  $text: ':text'
	};

	isOperator = function(v) {
	  return v.indexOf('$') === 0;
	};

	expandParam = function(k, v) {
	  return reduceMap(v, function(acc, _arg) {
	    var kk, o, res, vv;
	    kk = _arg[0], vv = _arg[1];
	    return acc.concat(kk === '$and' ? assertArray(vv).reduce((function(a, vvv) {
	      return a.concat(linearizeOne(k, vvv));
	    }), []) : kk === '$type' ? [] : isOperator(kk) ? (o = {
	      param: k
	    }, kk === '$or' ? o.value = vv : (OPERATORS[kk] ? o.operator = OPERATORS[kk] : void 0, MODIFIERS[kk] ? o.modifier = MODIFIERS[kk] : void 0, type(vv) === 'object' && vv.$or ? o.value = vv.$or : o.value = [vv]), [o]) : (v.$type ? res = ":" + v.$type : void 0, linearizeOne("" + k + (res || '') + "." + kk, vv)));
	  });
	};

	handleSort = function(xs) {
	  var x, _i, _len, _results;
	  assertArray(xs);
	  _results = [];
	  for (_i = 0, _len = xs.length; _i < _len; _i++) {
	    x = xs[_i];
	    switch (type(x)) {
	      case 'array':
	        _results.push({
	          param: '_sort',
	          value: x[0],
	          modifier: ":" + x[1]
	        });
	        break;
	      case 'string':
	        _results.push({
	          param: '_sort',
	          value: x
	        });
	        break;
	      default:
	        _results.push(void 0);
	    }
	  }
	  return _results;
	};

	handleInclude = function(includes) {
	  return reduceMap(includes, function(acc, _arg) {
	    var k, v;
	    k = _arg[0], v = _arg[1];
	    return acc.concat((function() {
	      switch (type(v)) {
	        case 'array':
	          return v.map(function(x) {
	            return {
	              param: '_include',
	              value: "" + k + "." + x
	            };
	          });
	        case 'string':
	          return [
	            {
	              param: '_include',
	              value: "" + k + "." + v
	            }
	          ];
	      }
	    })());
	  });
	};

	linearizeOne = function(k, v) {
	  if (k === '$sort') {
	    return handleSort(v);
	  } else if (k === '$include') {
	    return handleInclude(v);
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

	linearizeParams = function(query) {
	  return reduceMap(query, function(acc, _arg) {
	    var k, v;
	    k = _arg[0], v = _arg[1];
	    return acc.concat(linearizeOne(k, v));
	  });
	};

	buildSearchParams = function(query) {
	  var p, ps;
	  ps = (function() {
	    var _i, _len, _ref, _results;
	    _ref = linearizeParams(query);
	    _results = [];
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      p = _ref[_i];
	      _results.push([p.param, p.modifier, '=', p.operator, encodeURIComponent(p.value)].filter(identity).join(''));
	    }
	    return _results;
	  })();
	  return ps.join("&");
	};

	exports._query = linearizeParams;

	exports.query = buildSearchParams;


/***/ }
/******/ ])
});
