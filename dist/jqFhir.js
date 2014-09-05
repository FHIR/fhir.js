(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["jqFhir"] = factory();
	else
		root["jqFhir"] = factory();
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

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var $, adapter, auth, merge, mkFhir, searchByPatient, utils,
	  __slice = [].slice;

	mkFhir = __webpack_require__(2);

	merge = __webpack_require__(13);

	utils = __webpack_require__(3);

	auth = __webpack_require__(4);

	searchByPatient = __webpack_require__(5);

	merge = __webpack_require__(13);

	$ = jQuery;

	adapter = {
	  "http": function(q) {
	    var a;
	    a = $.ajax({
	      type: q.method,
	      url: q.url,
	      headers: q.headers
	    });
	    if (q.success) {
	      a.done(q.success);
	    }
	    if (q.error) {
	      return a.fail(q.error);
	    }
	  }
	};

	module.exports = function(config) {
	  var defaultMiddlewares, defer, fhir, middlewares;
	  defaultMiddlewares = {
	    http: [auth],
	    search: [searchByPatient]
	  };
	  middlewares = utils.mergeLists(config.middlewares, defaultMiddlewares);
	  config = merge(true, config, {
	    middlewares: middlewares
	  });
	  fhir = mkFhir(config, adapter);
	  defer = function(fname) {
	    var fn;
	    fn = fhir[fname];
	    return function() {
	      var args, ret;
	      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	      ret = $.Deferred();
	      console.log('args list', args.concat([ret.resolve, ret.reject]));
	      fn.apply(null, args.concat([ret.resolve, ret.reject]));
	      return ret;
	    };
	  };
	  return ["search", "conformance", "profile", "transaction", "history", "create", "read", "update", "delete", "vread"].reduce((function(acc, v) {
	    acc[v] = defer(v);
	    return acc;
	  }), {});
	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var search = __webpack_require__(6);
	var conf = __webpack_require__(7);
	var transaction = __webpack_require__(8);
	var tags = __webpack_require__(9);
	var history = __webpack_require__(10);
	var crud = __webpack_require__(11);
	var wrap = __webpack_require__(12);
	var utils = __webpack_require__(3);

	// construct fhir object
	// params:
	//   * cfg - config object - props???
	//   * adapter - main operations
	//      * http - function({method, url, success, error})
	//               call success with (data, status, headersFn, config)

	function fhir(cfg, adapter){
	  // TODO: add cfg & adapter validation
	  var middlewares =cfg.middlewares || {};
	 
	  var http = wrap(cfg, adapter.http, middlewares.http)
	  var baseUrl = cfg.baseUrl

	  return  {
	    search: function(type, query, cb, err){
	      var wrapped = wrap(cfg, search, middlewares.search);
	      return wrapped(baseUrl, http, type, query, cb, err);
	    },
	    conformance: function(cb, err){
	      return conf.conformance(baseUrl, http, cb, err)
	    },
	    profile: function(type, cb, err){
	      return conf.profile(baseUrl, http, type, cb, err)
	    },
	    transaction: function(bundle, cb, err){
	      return transaction(baseUrl, http, bundle, cb, err)
	    },
	    history: function(){
	      return history.apply(null, [baseUrl, http].concat(arguments))
	    },
	    create: function(entry, cb, err){
	      return crud.create(baseUrl, http, entry, cb, err)
	    },
	    read: function(id, cb, err){
	      return crud.read(baseUrl, http, id, cb, err)
	    },
	    update: function(entry, cb, err){
	      return crud.update(baseUrl, http, entry, cb, err)
	    },
	    delete: function(entry, cb, err){
	      return crud.delete(baseUrl, http, entry, cb, err)
	    }
	  }
	}
	module.exports = fhir



/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var RTRIM, addKey, argsArray, assertArray, assertObject, headerToTags, identity, merge, mergeLists, reduceMap, tagsToHeader, trim, type,
	  __slice = [].slice;

	merge = __webpack_require__(13);

	RTRIM = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

	trim = function(text) {
	  if (text != null) {
	    return (text + "").replace(RTRIM, "");
	  } else {
	    return "";
	  }
	};

	exports.trim = trim;

	tagsToHeader = function(tags) {
	  return (tags || []).filter(function(i) {
	    return i && trim(i.term);
	  }).map(function(i) {
	    return "" + i.term + "; scheme=\"" + i.scheme + "\"; label=\"" + i.label + "\"";
	  }).join(",");
	};

	exports.tagsToHeader = tagsToHeader;

	addKey = function(acc, str) {
	  var pair, val;
	  if (!str) {
	    return;
	  }
	  pair = str.split("=").map(trim);
	  val = pair[1].replace(/(^"|"$)/g, '');
	  if (val) {
	    acc[pair[0]] = val;
	  }
	  return acc;
	};

	headerToTags = function(categoryHeader) {
	  if (!categoryHeader) {
	    return [];
	  }
	  return categoryHeader.split(',').map(function(x) {
	    var acc, parts;
	    parts = trim(x).split(';').map(trim);
	    if (parts[0]) {
	      acc = {
	        term: parts[0]
	      };
	      addKey(acc, parts[1]);
	      addKey(acc, parts[2]);
	      return acc;
	    }
	  });
	};

	exports.headerToTags = headerToTags;

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

	exports.type = type;

	assertArray = function(a) {
	  if (type(a) !== 'array') {
	    throw 'not array';
	  }
	  return a;
	};

	exports.assertArray = assertArray;

	assertObject = function(a) {
	  if (type(a) !== 'object') {
	    throw 'not object';
	  }
	  return a;
	};

	exports.assertObject = assertObject;

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

	exports.reduceMap = reduceMap;

	identity = function(x) {
	  return x;
	};

	exports.identity = identity;

	argsArray = function() {
	  var args;
	  args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
	  return args;
	};

	exports.argsArray = argsArray;

	mergeLists = function() {
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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var basic, bearer, btoa, identity, merge, withAuth, wrapWithAuth;

	btoa = __webpack_require__(15).btoa;

	merge = __webpack_require__(13);

	bearer = function(cfg) {
	  return function(req) {
	    return withAuth(req, "Bearer " + cfg.auth.bearer);
	  };
	};

	basic = function(cfg) {
	  return function(req) {
	    return withAuth(req, "Basic " + btoa("" + cfg.auth.user + ":" + cfg.auth.pass));
	  };
	};

	identity = function(x) {
	  return x;
	};

	withAuth = function(req, a) {
	  var headers;
	  headers = merge(true, req.headers || {}, {
	    "Authorization": a
	  });
	  return merge(true, req, {
	    headers: headers
	  });
	};

	wrapWithAuth = function(cfg, http) {
	  var requestProcessor;
	  requestProcessor = (function() {
	    var _ref, _ref1, _ref2;
	    switch (false) {
	      case !(cfg != null ? (_ref = cfg.auth) != null ? _ref.bearer : void 0 : void 0):
	        return bearer(cfg);
	      case !((cfg != null ? (_ref1 = cfg.auth) != null ? _ref1.user : void 0 : void 0) && (cfg != null ? (_ref2 = cfg.auth) != null ? _ref2.pass : void 0 : void 0)):
	        return basic(cfg);
	      default:
	        return identity;
	    }
	  })();
	  return function(req) {
	    return http(requestProcessor(req));
	  };
	};

	module.exports = wrapWithAuth;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var keyFor, merge, withPatient, wrap;

	merge = __webpack_require__(13);

	keyFor = {
	  "Observation": "subject",
	  "MedicationPrescription": "patient"
	};

	withPatient = function(cfg, type, q) {
	  var query;
	  if (!cfg.boundToPatient || !cfg.patient || !keyFor[type]) {
	    return q;
	  }
	  query = merge(true, q);
	  query[keyFor[type]] = {
	    $type: "Patient",
	    _id: cfg.patient
	  };
	  return query;
	};

	wrap = function(cfg, search) {
	  return function(baseUrl, http, type, query, cb, err) {
	    return search(baseUrl, http, type, withPatient(cfg, type, query), cb, err);
	  };
	};

	module.exports = wrap;


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var queryBuider, search;

	queryBuider = __webpack_require__(14);

	search = (function(_this) {
	  return function(baseUrl, http, type, query, cb, err) {
	    var queryStr, uri;
	    console.log('search', baseUrl, http, type, query, cb, err);
	    queryStr = queryBuider.query(query);
	    uri = "" + baseUrl + "/" + type + "/_search?" + queryStr;
	    return http({
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
	})(this);

	module.exports = search;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var conformance, profile;

	conformance = function(baseUrl, http, cb, err) {
	  return http({
	    method: 'GET',
	    url: "" + baseUrl + "/metadata",
	    success: cb,
	    error: err
	  });
	};

	profile = (function(_this) {
	  return function(baseUrl, http, type, cb, err) {
	    return http({
	      method: 'GET',
	      url: "" + baseUrl + "/Profile/" + type,
	      success: cb,
	      error: err
	    });
	  };
	})(this);

	exports.conformance = conformance;

	exports.profile = profile;


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var transaction;

	transaction = (function(_this) {
	  return function(baseUrl, http, bundle, cb, err) {
	    return http({
	      method: 'POST',
	      url: baseUrl,
	      data: bundle,
	      success: cb,
	      error: err
	    });
	  };
	})(this);

	module.exports = transaction;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var affixTags, affixTagsToResource, affixTagsToResourceVersion, removeTags, removeTagsFromResource, removeTagsFromResourceVerson, tags, tagsAll, tagsResource, tagsResourceType, tagsResourceVersion;

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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var history, historyAll, historyType;

	history = function(baseUrl, http, type, id, cb, err) {
	  return http({
	    method: 'GET',
	    url: "" + baseUrl + "/" + type + "/" + id + "/_history",
	    success: cb,
	    error: err
	  });
	};

	historyType = function(baseUrl, http, type, cb, err) {
	  return http({
	    method: 'GET',
	    url: "" + baseUrl + "/" + type + "/_history",
	    success: cb,
	    error: err
	  });
	};

	historyAll = function(baseUrl, http, cb, err) {
	  return http({
	    method: 'GET',
	    url: "" + baseUrl + "/_history",
	    success: cb,
	    error: err
	  });
	};

	module.exports = function() {
	  switch (arguments.length) {
	    case 4:
	      return historyAll.apply(null, arguments);
	    case 5:
	      return historyType.apply(null, arguments);
	    case 6:
	      return history.apply(null, arguments);
	    default:
	      throw "wrong arity: expected (baseUrl, http, type?, id?, cb, err)";
	  }
	};


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var assert, gettype, headerToTags, tagsToHeader, toJson, trim, utils;

	utils = __webpack_require__(3);

	trim = utils.trim;

	tagsToHeader = utils.tagsToHeader;

	headerToTags = utils.headerToTags;

	gettype = utils.type;

	toJson = function(resource) {
	  if (gettype(resource) === 'string') {
	    return resource;
	  } else if (gettype(resource) === 'object') {
	    return JSON.stringify(resource);
	  }
	};

	assert = function(pred, mess) {
	  if (pred == null) {
	    throw mess;
	  }
	};

	exports.create = function(baseUrl, http, entry, cb, err) {
	  var headers, resource, tagHeader, tags, type;
	  tags = entry.category || [];
	  resource = entry.content;
	  assert(resource, 'entry.content with resource body should be present');
	  type = resource.resourceType;
	  assert(type, 'entry.content.resourceType with resourceType should be present');
	  headers = {};
	  tagHeader = tagsToHeader(tags);
	  if (tagHeader.length > 0) {
	    headers["Category"] = tagHeader;
	  }
	  return http({
	    method: 'POST',
	    url: "" + baseUrl + "/" + type,
	    data: toJson(resource),
	    headers: headers,
	    success: function(data, status, headers, config) {
	      var id;
	      id = headers('Content-Location');
	      tags = headerToTags(headers('Category')) || tags;
	      return cb({
	        id: id,
	        category: tags || [],
	        content: data || resource
	      }, config);
	    },
	    error: err
	  });
	};

	exports.read = function(baseUrl, http, id, cb, err) {
	  console.log("[read] ", id);
	  return http({
	    method: 'GET',
	    url: id,
	    success: function(data, status, headers, config) {
	      var tags;
	      id = headers && headers('Content-Location') || '??';
	      tags = headers && headerToTags(headers('Category')) || '??';
	      return cb({
	        id: id,
	        category: tags || [],
	        content: data
	      }, config);
	    },
	    error: err
	  });
	};

	exports.update = function(baseUrl, http, entry, cb, err) {
	  var headers, resource, tagHeader, tags, url;
	  console.log("[update] ", entry);
	  url = entry.id.split("/_history/")[0];
	  tags = entry.tags;
	  resource = entry.content;
	  headers = {};
	  tagHeader = tagsToHeader(tags);
	  if (tagHeader) {
	    headers["Category"] = tagHeader;
	  }
	  headers['Content-Location'] = entry.id;
	  return http({
	    method: 'PUT',
	    url: url,
	    data: toJson(resource),
	    headers: headers,
	    success: function(data, status, headers, config) {
	      var id, _tags;
	      id = headers('Content-Location');
	      _tags = headerToTags(headers('Category'));
	      return cb({
	        id: id,
	        category: _tags || tags || [],
	        content: data
	      }, config);
	    },
	    error: err
	  });
	};

	exports["delete"] = function(baseUrl, http, entry, cb, err) {
	  return http({
	    method: 'DELETE',
	    url: entry.id,
	    success: function(data, status, headers, config) {
	      return cb(entry, config);
	    },
	    error: err
	  });
	};

	exports.vread = function(baseUrl, http) {
	  return console.log('TODO');
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var wrap;

	wrap = function(cfg, fn, middlewares) {
	  var next;
	  if (typeof middlewares === 'function') {
	    middlewares = [middlewares];
	  }
	  next = function(wrapped, nextf) {
	    return nextf(cfg, wrapped);
	  };
	  return [].concat(middlewares || []).reverse().reduce(next, fn);
	};

	module.exports = wrap;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/*!
	 * @name JavaScript/NodeJS Merge v1.1.3
	 * @author yeikos
	 * @repository https://github.com/yeikos/js.merge

	 * Copyright 2014 yeikos - MIT license
	 * https://raw.github.com/yeikos/js.merge/master/LICENSE
	 */

	;(function(isNode) {

		function merge() {

			var items = Array.prototype.slice.call(arguments),
				result = items.shift(),
				deep = (result === true),
				size = items.length,
				item, index, key;

			if (deep || typeOf(result) !== 'object')

				result = {};

			for (index=0;index<size;++index)

				if (typeOf(item = items[index]) === 'object')

					for (key in item)

						result[key] = deep ? clone(item[key]) : item[key];

			return result;

		}

		function clone(input) {

			var output = input,
				type = typeOf(input),
				index, size;

			if (type === 'array') {

				output = [];
				size = input.length;

				for (index=0;index<size;++index)

					output[index] = clone(input[index]);

			} else if (type === 'object') {

				output = {};

				for (index in input)

					output[index] = clone(input[index]);

			}

			return output;

		}

		function typeOf(input) {

			return ({}).toString.call(input).match(/\s([\w]+)/)[1].toLowerCase();

		}

		if (isNode) {

			module.exports = merge;

		} else {

			window.merge = merge;

		}

	})(typeof module === 'object' && module && typeof module.exports === 'object' && module.exports);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16)(module)))

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var MODIFIERS, OPERATORS, assertArray, assertObject, buildSearchParams, expandParam, handleInclude, handleSort, identity, isOperator, linearizeOne, linearizeParams, reduceMap, type, utils;

	utils = __webpack_require__(3);

	type = utils.type;

	assertArray = utils.assertArray;

	assertObject = utils.assertObject;

	reduceMap = utils.reduceMap;

	identity = utils.identity;

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


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	;(function () {

	  var object = true ? exports : this; // #8: web workers
	  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

	  function InvalidCharacterError(message) {
	    this.message = message;
	  }
	  InvalidCharacterError.prototype = new Error;
	  InvalidCharacterError.prototype.name = 'InvalidCharacterError';

	  // encoder
	  // [https://gist.github.com/999166] by [https://github.com/nignag]
	  object.btoa || (
	  object.btoa = function (input) {
	    var str = String(input);
	    for (
	      // initialize result and counter
	      var block, charCode, idx = 0, map = chars, output = '';
	      // if the next str index does not exist:
	      //   change the mapping table to "="
	      //   check if d has no fractional digits
	      str.charAt(idx | 0) || (map = '=', idx % 1);
	      // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
	      output += map.charAt(63 & block >> 8 - idx % 1 * 8)
	    ) {
	      charCode = str.charCodeAt(idx += 3/4);
	      if (charCode > 0xFF) {
	        throw new InvalidCharacterError("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
	      }
	      block = block << 8 | charCode;
	    }
	    return output;
	  });

	  // decoder
	  // [https://gist.github.com/1020396] by [https://github.com/atk]
	  object.atob || (
	  object.atob = function (input) {
	    var str = String(input).replace(/=+$/, '');
	    if (str.length % 4 == 1) {
	      throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
	    }
	    for (
	      // initialize result and counters
	      var bc = 0, bs, buffer, idx = 0, output = '';
	      // get next character
	      buffer = str.charAt(idx++);
	      // character found in table? initialize bit storage and add its ascii value;
	      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
	        // and if not first of each 4 characters,
	        // convert the first 8 bits to one ascii character
	        bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
	    ) {
	      // try to find character in table (0-63, not found => -1)
	      buffer = chars.indexOf(buffer);
	    }
	    return output;
	  });

	}());


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }
/******/ ])
});
