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

	var cache, conf, crud, fhir, history, merge, resolve, search, tags, transaction, utils, wrap;

	search = __webpack_require__(1);

	conf = __webpack_require__(2);

	transaction = __webpack_require__(3);

	tags = __webpack_require__(4);

	history = __webpack_require__(5);

	crud = __webpack_require__(6);

	wrap = __webpack_require__(7);

	utils = __webpack_require__(8);

	resolve = __webpack_require__(9);

	merge = __webpack_require__(10);

	cache = {};

	fhir = function(cfg, adapter) {
	  var baseUrl, deps, depsWithCache, http, middlewares;
	  middlewares = cfg.middlewares || {};
	  http = wrap(cfg, adapter.http, middlewares.http);
	  baseUrl = cfg.baseUrl;
	  deps = function(opt) {
	    return merge(true, opt, {
	      baseUrl: baseUrl,
	      http: http
	    });
	  };
	  depsWithCache = function(opt) {
	    return merge(true, opt, {
	      baseUrl: baseUrl,
	      http: http,
	      cache: cfg.cache && cache[baseUrl]
	    });
	  };
	  return {
	    search: function(opt) {
	      var wrapped;
	      wrapped = wrap(cfg, search.search, middlewares.search);
	      return wrapped(merge(true, opt, {
	        baseUrl: baseUrl,
	        http: http
	      }));
	    },
	    nextPage: function(opt) {
	      return search.next(deps(opt));
	    },
	    prevPage: function(opt) {
	      return search.prev(deps(opt));
	    },
	    conformance: function(opt) {
	      return conf.conformance(deps(opt));
	    },
	    profile: function(opt) {
	      return conf.profile(deps(opt));
	    },
	    transaction: function(opt) {
	      return transaction(deps(opt));
	    },
	    history: function(opt) {
	      return history(deps(opt));
	    },
	    create: function(opt) {
	      return crud.create(deps(opt));
	    },
	    read: function(opt) {
	      return crud.read(deps(opt));
	    },
	    update: function(opt) {
	      return crud.update(deps(opt));
	    },
	    "delete": function(opt) {
	      return crud["delete"](deps(opt));
	    },
	    resolve: function(opt) {
	      return resolve.async(depsWithCache(opt));
	    },
	    resolveSync: function(opt) {
	      return resolve.sync(depsWithCache(opt));
	    }
	  };
	};

	module.exports = fhir;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var doGet, getRel, queryBuider, search;

	queryBuider = __webpack_require__(11);

	doGet = function(http, uri, success, error) {
	  return http({
	    method: 'GET',
	    url: uri,
	    success: success || function() {},
	    error: error || function() {}
	  });
	};

	search = (function(_this) {
	  return function(_arg) {
	    var baseUrl, error, http, query, queryStr, success, type, uri;
	    baseUrl = _arg.baseUrl, http = _arg.http, type = _arg.type, query = _arg.query, success = _arg.success, error = _arg.error;
	    queryStr = queryBuider.query(query);
	    uri = "" + baseUrl + "/" + type + "/_search?" + queryStr;
	    return doGet(http, uri, success, error);
	  };
	})(this);

	getRel = function(rel) {
	  return function(_arg) {
	    var baseUrl, bundle, error, http, l, success, urls;
	    baseUrl = _arg.baseUrl, http = _arg.http, bundle = _arg.bundle, success = _arg.success, error = _arg.error;
	    urls = (function() {
	      var _i, _len, _ref, _results;
	      _ref = bundle != null ? bundle.link : void 0;
	      _results = [];
	      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	        l = _ref[_i];
	        if (l.rel === rel) {
	          _results.push(l.href);
	        }
	      }
	      return _results;
	    })();
	    if (urls.length !== 1) {
	      return error("No " + rel + " link found in bundle");
	    } else {
	      return doGet(http, urls[0], success, error);
	    }
	  };
	};

	module.exports.search = search;

	module.exports.next = getRel("next");

	module.exports.prev = getRel("prev");


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var conformance, profile;

	conformance = function(_arg) {
	  var baseUrl, error, http, success;
	  baseUrl = _arg.baseUrl, http = _arg.http, success = _arg.success, error = _arg.error;
	  return http({
	    method: 'GET',
	    url: "" + baseUrl + "/metadata",
	    success: success,
	    error: error
	  });
	};

	profile = (function(_this) {
	  return function(_arg) {
	    var baseUrl, error, http, success, type;
	    baseUrl = _arg.baseUrl, http = _arg.http, type = _arg.type, success = _arg.success, error = _arg.error;
	    return http({
	      method: 'GET',
	      url: "" + baseUrl + "/Profile/" + type,
	      success: success,
	      error: error
	    });
	  };
	})(this);

	exports.conformance = conformance;

	exports.profile = profile;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var transaction;

	transaction = (function(_this) {
	  return function(_arg) {
	    var baseUrl, bundle, error, http, success;
	    baseUrl = _arg.baseUrl, http = _arg.http, bundle = _arg.bundle, success = _arg.success, error = _arg.error;
	    return http({
	      method: 'POST',
	      url: baseUrl,
	      data: bundle,
	      success: success,
	      error: error
	    });
	  };
	})(this);

	module.exports = transaction;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var affixTags, affixTagsToResource, affixTagsToResourceVersion, buildTags, removeTags, removeTagsFromResource, removeTagsFromResourceVersion, tags, tagsAll, tagsResource, tagsResourceType, tagsResourceVersion;

	tagsAll = function(_arg) {
	  var baseUrl, error, http, success;
	  baseUrl = _arg.baseUrl, http = _arg.http, success = _arg.success, error = _arg.error;
	  return http({
	    method: 'GET',
	    url: "" + baseUrl + "/_tags",
	    success: success,
	    error: error
	  });
	};

	tagsResourceType = function(_arg) {
	  var baseUrl, error, http, success, type;
	  baseUrl = _arg.baseUrl, http = _arg.http, type = _arg.type, success = _arg.success, error = _arg.error;
	  return http({
	    method: 'GET',
	    url: "" + baseUrl + "/" + type + "/_tags",
	    success: success,
	    error: error
	  });
	};

	tagsResource = function(_arg) {
	  var baseUrl, error, http, id, success, type;
	  baseUrl = _arg.baseUrl, http = _arg.http, type = _arg.type, id = _arg.id, success = _arg.success, error = _arg.error;
	  return http({
	    method: 'GET',
	    url: "" + baseUrl + "/" + type + "/" + id + "/_tags",
	    success: success,
	    error: error
	  });
	};

	tagsResourceVersion = function(_arg) {
	  var baseUrl, error, http, id, success, type, vid;
	  baseUrl = _arg.baseUrl, http = _arg.http, type = _arg.type, id = _arg.id, vid = _arg.vid, success = _arg.success, error = _arg.error;
	  return http({
	    method: 'GET',
	    url: "" + baseUrl + "/" + type + "/" + id + "/_history/" + vid + "/_tags",
	    success: success,
	    error: error
	  });
	};

	tags = function(q) {
	  if ((q.vid != null) && (q.id != null) && (q.type != null)) {
	    return tagsResourceVersion(q);
	  } else if ((q.id != null) && (q.type != null)) {
	    return tagsResource(q);
	  } else if ((q.id != null) && (q.type != null)) {
	    return tagsResourceType(q);
	  } else {
	    return tagsAll(q);
	  }
	};

	buildTags = function(tags) {
	  return tags.filter(function(i) {
	    return $.trim(i.term);
	  }).map(function(i) {
	    return "" + i.term + "; scheme=\"" + i.scheme + "\"; label=\"" + i.label + "\"";
	  }).join(",");
	};

	affixTagsToResource = function(_arg) {
	  var baseUrl, error, headers, http, id, success, tagHeader, tags, type;
	  baseUrl = _arg.baseUrl, http = _arg.http, type = _arg.type, id = _arg.id, tags = _arg.tags, success = _arg.success, error = _arg.error;
	  headers = {};
	  tagHeader = buildTags(tags);
	  if (tagHeader) {
	    headers["Category"] = tagHeader;
	    http({
	      method: 'POST',
	      url: "" + baseUrl + "/" + type + "/" + id + "/_tags"
	    });
	    return {
	      headers: headers,
	      success: success,
	      error: error
	    };
	  } else {
	    return console.log('Empty tags');
	  }
	};

	affixTagsToResourceVersion = function(_arg) {
	  var baseUrl, error, headers, http, id, success, tagHeader, tags, type, vid;
	  baseUrl = _arg.baseUrl, http = _arg.http, type = _arg.type, id = _arg.id, vid = _arg.vid, tags = _arg.tags, success = _arg.success, error = _arg.error;
	  headers = {};
	  tagHeader = buildTags(tags);
	  if (tagHeader) {
	    headers["Category"] = tagHeader;
	    http({
	      method: 'POST',
	      url: "" + baseUrl + "/" + type + "/" + id + "/_history/" + vid + "/_tags"
	    });
	    return {
	      headers: headers,
	      success: success,
	      error: error
	    };
	  } else {
	    return console.log('Empty tags');
	  }
	};

	affixTags = function(q) {
	  if ((q.vid != null) && (q.id != null) && (q.type != null)) {
	    return affixTagsToResourceVersion(q);
	  } else if ((q.id != null) && (q.type != null)) {
	    return affixTagsToResource(q);
	  } else {
	    throw 'wrong arguments';
	  }
	};

	removeTagsFromResource = function(_arg) {
	  var baseUrl, error, http, id, success, type;
	  baseUrl = _arg.baseUrl, http = _arg.http, type = _arg.type, id = _arg.id, success = _arg.success, error = _arg.error;
	  return http({
	    method: 'POST',
	    url: "" + baseUrl + "/" + type + "/" + id + "/_tags/_delete",
	    success: success,
	    error: error
	  });
	};

	removeTagsFromResourceVersion = function(_arg) {
	  var baseUrl, error, http, id, success, type, vid;
	  baseUrl = _arg.baseUrl, http = _arg.http, type = _arg.type, id = _arg.id, vid = _arg.vid, success = _arg.success, error = _arg.error;
	  return http({
	    method: 'POST',
	    url: "" + baseUrl + "/" + type + "/" + id + "/_history/" + vid + "/_tags",
	    success: success,
	    error: error
	  });
	};

	removeTags = function(q) {
	  if ((q.vid != null) && (q.id != null) && (q.type != null)) {
	    return removeTagsFromResourceVersion(q);
	  } else if ((q.id != null) && (q.type != null)) {
	    return removeTagsFromResource(q);
	  } else {
	    throw 'wrong arguments';
	  }
	};

	exports.tags = tags;

	exports.affixTags = affixTags;

	exports.removeTags = removeTags;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var buildParams, history, historyAll, historyType;

	buildParams = function(count, since) {
	  var prm;
	  prm = {};
	  if (since != null) {
	    prm._since = since;
	  }
	  if (count != null) {
	    prm._count = count;
	  }
	  return prm;
	};

	history = function(_arg) {
	  var baseUrl, count, error, http, id, since, success, type;
	  baseUrl = _arg.baseUrl, http = _arg.http, type = _arg.type, id = _arg.id, success = _arg.success, error = _arg.error, count = _arg.count, since = _arg.since;
	  return http({
	    method: 'GET',
	    url: "" + baseUrl + "/" + type + "/" + id + "/_history",
	    params: buildParams(count, since),
	    success: success,
	    error: error
	  });
	};

	historyType = function(_arg) {
	  var baseUrl, count, error, http, since, success, type;
	  baseUrl = _arg.baseUrl, http = _arg.http, type = _arg.type, success = _arg.success, error = _arg.error, count = _arg.count, since = _arg.since;
	  return http({
	    method: 'GET',
	    url: "" + baseUrl + "/" + type + "/_history",
	    params: buildParams(count, since),
	    success: success,
	    error: error
	  });
	};

	historyAll = function(_arg) {
	  var baseUrl, count, error, http, since, success;
	  baseUrl = _arg.baseUrl, http = _arg.http, success = _arg.success, error = _arg.error, count = _arg.count, since = _arg.since;
	  return http({
	    method: 'GET',
	    url: "" + baseUrl + "/_history",
	    params: buildParams(count, since),
	    success: success,
	    error: error
	  });
	};

	module.exports = function(q) {
	  if ((q.id != null) && (q.type != null)) {
	    return history(q);
	  } else if (q.type != null) {
	    return historyType(q);
	  } else {
	    return historyAll(q);
	  }
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var assert, gettype, headerToTags, tagsToHeader, toJson, trim, utils;

	utils = __webpack_require__(8);

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

	exports.create = function(_arg) {
	  var baseUrl, entry, error, headers, http, resource, success, tagHeader, tags, type;
	  baseUrl = _arg.baseUrl, http = _arg.http, entry = _arg.entry, success = _arg.success, error = _arg.error;
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
	      return success({
	        id: id,
	        category: tags || [],
	        content: data || resource
	      }, config);
	    },
	    error: error
	  });
	};

	exports.read = function(_arg) {
	  var baseUrl, error, http, id, success;
	  baseUrl = _arg.baseUrl, http = _arg.http, id = _arg.id, success = _arg.success, error = _arg.error;
	  console.log("[read] ", id);
	  return http({
	    method: 'GET',
	    url: utils.absoluteUrl(baseUrl, id),
	    success: function(data, status, headers, config) {
	      var tags;
	      id = headers && headers('Content-Location') || '??';
	      tags = headers && headerToTags(headers('Category')) || '??';
	      return success({
	        id: id,
	        category: tags || [],
	        content: data
	      }, config);
	    },
	    error: error
	  });
	};

	exports.update = function(_arg) {
	  var baseUrl, entry, error, headers, http, resource, success, tagHeader, tags, url;
	  baseUrl = _arg.baseUrl, http = _arg.http, entry = _arg.entry, success = _arg.success, error = _arg.error;
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
	      return success({
	        id: id,
	        category: _tags || tags || [],
	        content: data
	      }, config);
	    },
	    error: error
	  });
	};

	exports["delete"] = function(_arg) {
	  var baseUrl, entry, error, http, success, url;
	  baseUrl = _arg.baseUrl, http = _arg.http, entry = _arg.entry, success = _arg.success, error = _arg.error;
	  console.log("[delete] ", entry);
	  url = entry.id.split('_history')[0];
	  return http({
	    method: 'DELETE',
	    url: url,
	    success: function(data, status, headers, config) {
	      return success(entry, config);
	    },
	    error: error
	  });
	};

	exports.vread = function(_arg) {
	  var baseUrl, http;
	  baseUrl = _arg.baseUrl, http = _arg.http;
	  return console.log('TODO');
	};


/***/ },
/* 7 */
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var RTRIM, absoluteUrl, addKey, argsArray, assertArray, assertObject, headerToTags, identity, merge, mergeLists, postwalk, reduceMap, relativeUrl, tagsToHeader, trim, type, walk,
	  __slice = [].slice;

	merge = __webpack_require__(10);

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

	absoluteUrl = function(baseUrl, ref) {
	  if (ref.slice(ref, baseUrl.length + 1) !== baseUrl + "/") {
	    return "" + baseUrl + "/" + ref;
	  } else {
	    return ref;
	  }
	};

	exports.absoluteUrl = absoluteUrl;

	relativeUrl = function(baseUrl, ref) {
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
	    return "" + baseUrl + "/" + type + "/" + id;
	  } else if (id.indexOf(baseUrl) !== 0) {
	    return "" + baseUrl + "/" + id;
	  } else {
	    return id;
	  }
	};

	walk = function(inner, outer, data, context) {
	  var keysToMap, remapped;
	  switch (type(data)) {
	    case 'array':
	      return outer(data.map(function(item) {
	        return inner(item, [data, context]);
	      }), context);
	    case 'object':
	      keysToMap = function(acc, _arg) {
	        var k, v;
	        k = _arg[0], v = _arg[1];
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

	postwalk = function(f, data, context) {
	  if (!data) {
	    return function(data, context) {
	      return postwalk(f, data, context);
	    };
	  } else {
	    return walk(postwalk(f), f, data, context);
	  }
	};

	exports.postwalk = postwalk;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var CONTAINED, async, resolveContained, sync, utils;

	utils = __webpack_require__(8);

	CONTAINED = /^#(.*)/;

	resolveContained = function(ref, resource) {
	  var cid, match, r, ret;
	  cid = ref.match(CONTAINED)[1];
	  match = (function() {
	    var _i, _len, _ref, _results;
	    _ref = resource != null ? resource.contained : void 0;
	    _results = [];
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      r = _ref[_i];
	      if ((r.id || r._id) === cid) {
	        _results.push(r);
	      }
	    }
	    return _results;
	  })();
	  ret = match[0] || null;
	  if (ret) {
	    return {
	      content: ret
	    };
	  } else {
	    return null;
	  }
	};

	sync = function(_arg) {
	  var abs, baseUrl, bundle, bundled, cache, e, http, ref, reference, resource;
	  baseUrl = _arg.baseUrl, http = _arg.http, cache = _arg.cache, reference = _arg.reference, resource = _arg.resource, bundle = _arg.bundle;
	  ref = reference;
	  if (!ref.reference) {
	    return null;
	  }
	  if (ref.reference.match(CONTAINED)) {
	    return resolveContained(ref.reference, resource);
	  }
	  abs = utils.absoluteUrl(baseUrl, ref.reference);
	  bundled = (function() {
	    var _i, _len, _ref, _results;
	    _ref = (bundle != null ? bundle.entry : void 0) || [];
	    _results = [];
	    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
	      e = _ref[_i];
	      if (e.id === abs) {
	        _results.push(e);
	      }
	    }
	    return _results;
	  })();
	  return bundled[0] || (cache != null ? cache[abs] : void 0) || null;
	};

	async = function(opt) {
	  var abs, baseUrl, bundle, cache, didSync, error, http, ref, reference, resource, success;
	  baseUrl = opt.baseUrl, http = opt.http, cache = opt.cache, reference = opt.reference, resource = opt.resource, bundle = opt.bundle, success = opt.success, error = opt.error;
	  ref = reference;
	  didSync = sync(opt);
	  if (didSync) {
	    return setTimeout(function() {
	      if (success) {
	        return success(didSync);
	      }
	    });
	  }
	  if (!ref.reference) {
	    return setTimeout(function() {
	      if (error) {
	        return error("No reference found");
	      }
	    });
	  }
	  if (ref.reference.match(CONTAINED)) {
	    return setTimeout(function() {
	      if (error) {
	        return error("Contained resource not found");
	      }
	    });
	  }
	  abs = utils.absoluteUrl(baseUrl, ref.reference);
	  return http({
	    method: 'GET',
	    url: abs,
	    success: function(data) {
	      if (success) {
	        return success(data);
	      }
	    },
	    error: function(e) {
	      if (error) {
	        return error(e);
	      }
	    }
	  });
	};

	module.exports.async = async;

	module.exports.sync = sync;


/***/ },
/* 10 */
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
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(12)(module)))

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var MODIFIERS, OPERATORS, assertArray, assertObject, buildSearchParams, expandParam, handleInclude, handleSort, identity, isOperator, linearizeOne, linearizeParams, reduceMap, type, utils;

	utils = __webpack_require__(8);

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
/* 12 */
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
