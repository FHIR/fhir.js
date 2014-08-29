(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["fhir"] = factory();
	else
		root["fhir"] = factory();
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

	var query = __webpack_require__(1);
	var tags = __webpack_require__(2);
	var search = __webpack_require__(3);

	exports.query = query.query;
	exports._query = query._query;
	exports.tags = tags.tags;
	exports.affixTags = tags.affixTags;
	exports.removeTags = tags.removeTags;
	exports.search = search.search;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var MODIFIERS, OPERATORS, assertArray, buildPair, buildSearchParams, evalObjectValue, evalValue, expandParam, identity, isOperator, linearizeOne, linearizeParams, tap, type;

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

	evalObjectValue = function(o) {
	  var k, v;
	  return ((function() {
	    var _results;
	    _results = [];
	    for (k in o) {
	      v = o[k];
	      _results.push("" + OPERATORS[k] + v);
	    }
	    return _results;
	  })()).join("???");
	};

	evalValue = function(v) {
	  switch (type(v)) {
	    case 'object':
	      return evalObjectValue(v);
	    case 'string':
	      return v;
	    default:
	      throw 'could not evalValue';
	  }
	};

	tap = function(o, cb) {
	  cb(o);
	  return o;
	};

	assertArray = function(a) {
	  if (type(a) !== 'array') {
	    throw 'not array';
	  }
	  return a;
	};

	expandParam = function(k, v) {
	  var reduceFn, x, y;
	  reduceFn = function(acc, _arg) {
	    var kk, o, res, vv;
	    kk = _arg[0], vv = _arg[1];
	    return acc.concat(kk === '$and' ? assertArray(vv).reduce((function(a, vvv) {
	      return a.concat(linearizeOne(k, vvv));
	    }), []) : kk === '$type' ? [] : isOperator(kk) ? (o = {
	      param: k
	    }, kk === '$or' ? o.value = vv : (OPERATORS[kk] ? o.operator = OPERATORS[kk] : void 0, MODIFIERS[kk] ? o.modifier = MODIFIERS[kk] : void 0, type(vv) === 'object' && vv.$or ? o.value = vv.$or : o.value = [vv]), [o]) : (v.$type ? res = ":" + v.$type : void 0, linearizeOne("" + k + (res || '') + "." + kk, vv)));
	  };
	  return ((function() {
	    var _results;
	    _results = [];
	    for (x in v) {
	      y = v[x];
	      _results.push([x, y]);
	    }
	    return _results;
	  })()).reduce(reduceFn, []);
	};

	linearizeOne = function(k, v) {
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
	};

	linearizeParams = function(query) {
	  var k, reduceFn, v;
	  reduceFn = function(acc, _arg) {
	    var k, v;
	    k = _arg[0], v = _arg[1];
	    return acc.concat(linearizeOne(k, v));
	  };
	  return ((function() {
	    var _results;
	    _results = [];
	    for (k in query) {
	      v = query[k];
	      _results.push([k, v]);
	    }
	    return _results;
	  })()).reduce(reduceFn, []);
	};

	buildPair = function(k, v) {
	  return "" + k + "=" + (evalValue(v));
	};

	identity = function(x) {
	  return x;
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


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var adapter, affixTags, affixTagsToResource, affixTagsToResourceVersion, removeTags, removeTagsFromResource, removeTagsFromResourceVerson, tags, tagsAll, tagsResource, tagsResourceType, tagsResourceVersion;

	adapter = __webpack_require__(4);

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
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var adapter, query, search, searchResource;

	adapter = __webpack_require__(4);

	query = __webpack_require__(1);

	searchResource = function(type, query, cb, err) {
	  return console.log('impl me');
	};

	search = function() {
	  switch (arguments.length) {
	    case 4:
	      return searchResource.apply(null, arguments);
	    default:
	      throw "wrong arity: expected (type,query,cb,err)";
	  }
	};

	exports.search = search;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	exports.adapter = {
	  xhr: 'xhr'
	};


/***/ }
/******/ ])
});
