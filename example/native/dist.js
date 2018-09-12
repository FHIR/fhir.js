/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	const Fhir = __webpack_require__(1);
	var client = Fhir({
	  baseUrl: 'http://localhost:8888'
	});

	function getName(r) {
	  let name = '';
	  if (r.name && r.name.length > 0) {
	    if (r.name[0].given && r.name[0].given.length > 0) {
	      name += `${r.name[0].given[0]} `;
	    }
	    if (r.name[0].family) {
	      name += r.name[0].family;
	    }
	  }

	  return name;
	}

	window.getPatients = function (page = 1, limit = 5) {
	  const pDoc = document.querySelector('#pagination');
	  const ptDoc = document.querySelector('#patients');
	  client.search({
	    type: 'Patient',
	    query: {
	      _count: limit,
	      _page: page,
	      $include: {
	        RelatedPerson: "patient"
	      }
	    }
	  })
	    .then((res) => {
	      const bundle = res.data;
	      ptDoc.innerHTML = '';
	      bundle.entry.forEach((patient) => {
	        const name = getName(patient.resource);
	        const li = document.createElement('li');
	        li.innerText = name;
	        ptDoc.appendChild(li)
	      });
	      pDoc.innerHTML = `Page: ${page}<br>${limit} of ${bundle.total}`;
	    })
	    .catch((err) => {
	      ptDoc.innerHTML = '';
	      pDoc.innerHTML = 'Error';
	      // Error responses
	      if (err.status) {
	        console.log(err);
	        console.log('Error', err.status);
	      }
	      // Errors
	      if (err.data && err.data) {
	        console.log('Error', err.data);
	      }
	    });
	}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	var mkFhir = __webpack_require__(2);

	// Fetch Helper JSON Parsing
	function parseJSON(response) {

	  // response.json() throws on empty body
	  return response.text()
	  .then(function(text) {
	    return text.length > 0 ? JSON.parse(text) : "";
	  });

	}

	// Fetch Helper for Status Codes
	function checkStatus(httpResponse) {
	  return new Promise(function (resolve, reject) {
	    if (httpResponse.status < 200 || httpResponse.status > 399) {
	      reject(httpResponse);
	    }
	    resolve(httpResponse);
	  });
	}

	// Build a backwards compatiable defer object
	var defer = function(){
	  var def = {};
	  def.promise = new Promise(function (resolve, reject) {
	    def.resolve = resolve;
	    def.reject = reject;
	  });
	  return def;
	};

	// Build Adapter Object
	var adapter = {
	  defer: defer,
	  http: function (args) {
	    var url = args.url;
	    var debug = args.debug;

	    // The arguments passed in aligh with the fetch option names.
	    // There are are few extra values, but fetch will ignore them.
	    var fetchOptions = args;

	    // Pass along cookies
	    fetchOptions.credentials = args.credentials || '';
	    if (fetchOptions.credentials === '') {
	      delete fetchOptions.credentials;
	    }

	    // data neeeds to map to body if data is populated and this is not a GET or HEAD request
	    if (!['GET', 'HEAD'].includes(fetchOptions.method) && fetchOptions.data) {
	      fetchOptions.body = fetchOptions.data;
	    }

	    debug && console.log("DEBUG[native](fetchOptions)", fetchOptions);

	    return new Promise(function (resolve, reject) {
	      var returnableObject = {};

	      fetch(url, fetchOptions).then(function (response) {
	        debug && console.log("DEBUG[native](response)", response);
	        // This object is in the shape required by fhir.js lib
	        Object.assign(returnableObject, {
	          status: response.status,
	          headers: response.headers,
	          config: args,
	        });
	        return response;
	      })
	      .then(checkStatus)
	      .then(parseJSON)
	      .then(function (fhirObject) {
	        // Merge the
	        Object.assign(returnableObject, {
	          data: fhirObject,
	        });
	        debug && console.log('DEBUG[native]: (success response)', returnableObject); // eslint-disable-line
	        resolve(returnableObject);
	      })
	      .catch(function(error) {
	        Object.assign(returnableObject, {
	          error: error,
	        });
	        debug && console.log('DEBUG[native]: rejecting fetch promise');
	        reject(returnableObject);
	      });
	    });
	  },
	};

	var buildfhir = function buildfhir(config) {
	  // debugger;
	  return mkFhir(config, adapter);
	};
	module.exports = buildfhir;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
	    var utils = __webpack_require__(3);
	    var M = __webpack_require__(6);
	    var query = __webpack_require__(7);
	    var auth = __webpack_require__(8);
	    var transport = __webpack_require__(10);
	    var errors = __webpack_require__(11);
	    var config = __webpack_require__(12);
	    var bundle = __webpack_require__(13);
	    var pt = __webpack_require__(14);
	    var refs = __webpack_require__(15);
	    var url = __webpack_require__(16);
	    var decorate = __webpack_require__(17);

	    var cache = {};


	    var fhir = function(cfg, adapter){
	        var Middleware = M.Middleware;
	        var $$Attr = M.$$Attr;

	        var $$Method = function(m){ return $$Attr('method', m);};
	        var $$Header = function(h,v) {return $$Attr('headers.' + h, v);};

	        var $Errors = Middleware(errors);
	        var Defaults = Middleware(config(cfg, adapter))
	                .and($Errors)
	                .and(auth.$Basic)
	                .and(auth.$Bearer)
	                .and(auth.$Credentials)
	                .and(transport.$JsonData)
	                .and($$Header('Accept', (cfg.headers && cfg.headers['Accept']) ? cfg.headers['Accept'] : 'application/json'))
	                .and($$Header('Content-Type', (cfg.headers && cfg.headers['Content-Type']) ? cfg.headers['Content-Type'] : 'application/json'));

	        var GET = Defaults.and($$Method('GET'));
	        var POST = Defaults.and($$Method('POST'));
	        var PUT = Defaults.and($$Method('PUT'));
	        var DELETE = Defaults.and($$Method('DELETE'));
	        var PATCH = Defaults.and($$Method('PATCH'));

	        var http = transport.Http(cfg, adapter);

	        var Path = url.Path;
	        var BaseUrl = Path(cfg.baseUrl);
	        var resourceTypePath = BaseUrl.slash(":type || :resource.resourceType");
	        var searchPath = resourceTypePath;
	        var resourceTypeHxPath = resourceTypePath.slash("_history");
	        var resourcePath = resourceTypePath.slash(":id || :resource.id");
	        var resourceHxPath = resourcePath.slash("_history");
	        var vreadPath =  resourceHxPath.slash(":versionId || :resource.meta.versionId");
	        var resourceVersionPath = resourceHxPath.slash(":versionId || :resource.meta.versionId");

	        var ReturnHeader = $$Header('Prefer', 'return=representation');

	        var $Paging = Middleware(query.$Paging);

	        return decorate({
	            conformance: GET.and(BaseUrl.slash("metadata")).end(http),
	            document: POST.and(BaseUrl.slash("Document")).end(http),
	            profile:  GET.and(BaseUrl.slash("Profile").slash(":type")).end(http),
	            transaction: POST.and(BaseUrl).end(http),
	            history: GET.and(BaseUrl.slash("_history")).and($Paging).end(http),
	            typeHistory: GET.and(resourceTypeHxPath).and($Paging).end(http),
	            resourceHistory: GET.and(resourceHxPath).and($Paging).end(http),
	            read: GET.and(pt.$WithPatient).and(resourcePath).end(http),
	            vread: GET.and(vreadPath).end(http),
	            "delete": DELETE.and(resourcePath).and(ReturnHeader).end(http),
	            create: POST.and(resourceTypePath).and(ReturnHeader).end(http),
	            validate: POST.and(resourceTypePath.slash("_validate")).end(http),
	            search: GET.and(resourceTypePath).and(pt.$WithPatient).and(query.$SearchParams).and($Paging).end(http),
	            update: PUT.and(resourcePath).and(ReturnHeader).end(http),
	            nextPage: GET.and(bundle.$$BundleLinkUrl("next")).end(http),
	            // For previous page, bundle.link.relation can either have 'previous' or 'prev' values
	            prevPage: GET.and(bundle.$$BundleLinkUrl("previous")).and(bundle.$$BundleLinkUrl("prev")).end(http),
	            resolve: GET.and(refs.resolve).end(http),
	            patch: PATCH.and(resourcePath).and($$Header('Content-Type', 'application/json-patch+json')).end(http)
	        }, adapter);
	    };
	    module.exports = fhir;
	}).call(this);


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
	  var merge = __webpack_require__(4);

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


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/*!
	 * @name JavaScript/NodeJS Merge v1.2.0
	 * @author yeikos
	 * @repository https://github.com/yeikos/js.merge

	 * Copyright 2014 yeikos - MIT license
	 * https://raw.github.com/yeikos/js.merge/master/LICENSE
	 */

	;(function(isNode) {

		/**
		 * Merge one or more objects 
		 * @param bool? clone
		 * @param mixed,... arguments
		 * @return object
		 */

		var Public = function(clone) {

			return merge(clone === true, false, arguments);

		}, publicName = 'merge';

		/**
		 * Merge two or more objects recursively 
		 * @param bool? clone
		 * @param mixed,... arguments
		 * @return object
		 */

		Public.recursive = function(clone) {

			return merge(clone === true, true, arguments);

		};

		/**
		 * Clone the input removing any reference
		 * @param mixed input
		 * @return mixed
		 */

		Public.clone = function(input) {

			var output = input,
				type = typeOf(input),
				index, size;

			if (type === 'array') {

				output = [];
				size = input.length;

				for (index=0;index<size;++index)

					output[index] = Public.clone(input[index]);

			} else if (type === 'object') {

				output = {};

				for (index in input)

					output[index] = Public.clone(input[index]);

			}

			return output;

		};

		/**
		 * Merge two objects recursively
		 * @param mixed input
		 * @param mixed extend
		 * @return mixed
		 */

		function merge_recursive(base, extend) {

			if (typeOf(base) !== 'object')

				return extend;

			for (var key in extend) {

				if (typeOf(base[key]) === 'object' && typeOf(extend[key]) === 'object') {

					base[key] = merge_recursive(base[key], extend[key]);

				} else {

					base[key] = extend[key];

				}

			}

			return base;

		}

		/**
		 * Merge two or more objects
		 * @param bool clone
		 * @param bool recursive
		 * @param array argv
		 * @return object
		 */

		function merge(clone, recursive, argv) {

			var result = argv[0],
				size = argv.length;

			if (clone || typeOf(result) !== 'object')

				result = {};

			for (var index=0;index<size;++index) {

				var item = argv[index],

					type = typeOf(item);

				if (type !== 'object') continue;

				for (var key in item) {

					var sitem = clone ? Public.clone(item[key]) : item[key];

					if (recursive) {

						result[key] = merge_recursive(result[key], sitem);

					} else {

						result[key] = sitem;

					}

				}

			}

			return result;

		}

		/**
		 * Get type of variable
		 * @param mixed input
		 * @return string
		 *
		 * @see http://jsperf.com/typeofvar
		 */

		function typeOf(input) {

			return ({}).toString.call(input).slice(8, -1).toLowerCase();

		}

		if (isNode) {

			module.exports = Public;

		} else {

			window[publicName] = Public;

		}

	})(typeof module === 'object' && module && typeof module.exports === 'object' && module.exports);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)(module)))

/***/ }),
/* 5 */
/***/ (function(module, exports) {

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


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
	    var utils = __webpack_require__(3);

	    var id = function(x){return x;};
	    var constantly = function(x){return function(){return x;};};

	    var mwComposition = function(mw1, mw2){
	        return function(h){ return mw1(mw2(h)); };
	    };

	    var Middleware = function(mw){
	        mw.and = function(nmw){
	            return Middleware(mwComposition(mw, nmw));
	        };
	        mw.end = function(h){
	            return mw(h);
	        };
	        return mw;
	    };

	    // generate wm from function
	    exports.$$Simple = function(f){
	        return function(h){
	            return function(args){
	                return h(f(args));
	            };
	        };
	    };

	    var setAttr = function(args, attr, value){
	        var path = attr.split('.');
	        var obj = args;
	        for(var i = 0; i < (path.length - 1); i++){
	            var k = path[i];
	            obj = args[k];
	            if(!obj){
	                obj = {};
	                args[k] = obj;
	            }
	        }
	        obj[path[path.length - 1]] = value;
	        return args;
	    };

	    // generate wm from function
	    exports.$$Attr = function(attr, fn){
	        return Middleware(function(h){
	            return function(args) {
	                var value = null;
	                if(utils.type(fn) == 'function'){
	                   value = fn(args);
	                } else {
	                    value = fn;
	                }
	                if(value == null && value == undefined){
	                    return h(args);
	                }else {
	                    return h(setAttr(args, attr, value));
	                }
	            };
	        });
	    };

	    var Attribute = function(attr, fn){
	        return Middleware(function(h){
	            return function(args) {
	                args[attr] = fn(args);
	                return h(args);
	            };
	        });
	    };

	    var Method = function(method){
	        return Attribute('method', constantly(method));
	    };

	    exports.Middleware = Middleware;
	    exports.Attribute = Attribute;
	    exports.Method = Method;

	}).call(this);


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
	    var utils = __webpack_require__(3);

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

	    var linearizeOne = function(k, v) {
	        if (k === '$sort') {
	            return handleSort(v);
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
	        ps = (function() {
	            var i, len, ref, results;
	            ref = linearizeParams(query);
	            results = [];
	            for (i = 0, len = ref.length; i < len; i++) {
	                p = ref[i];
	                value = (p.param === "_include" || p.param === '_revinclude') ? p.value : encodeURIComponent(p.value);
	                results.push([p.param, p.modifier, '=', p.operator, value].filter(identity).join(''));
	            }
	            return results;
	        })();
	        return ps.join("&");
	    };

	    exports._query = linearizeParams;

	    exports.query = buildSearchParams;

	    var mw = __webpack_require__(6);

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


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
	    var mw = __webpack_require__(6);

	    var btoa = __webpack_require__(9).btoa;

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


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	;(function () {

	  var object =  true ? exports : this; // #8: web workers
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


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
	    var utils = __webpack_require__(3);

	    exports.Http = function(cfg, adapter){
	        return function(args){
	            if(args.debug){
	                console.log("\nDEBUG (request):", args.method, args.url, args);
	            }
	            var promise = (args.http || adapter.http  || cfg.http)(args);
	            if (args.debug && promise && promise.then){
	                promise.then(function(x){ console.log("\nDEBUG: (responce)", x);});
	            }
	            return promise;
	        };
	    };

	    var toJson = function(x){
	        return (utils.type(x) == 'object' || utils.type(x) == 'array') ? JSON.stringify(x) : x;
	    };

	    exports.$JsonData = function(h){
	        return function(args){
	            var data = args.bundle || args.data || args.resource;
	            if(data){
	                args.data = toJson(data);
	            }
	            return h(args);
	        };
	    };

	}).call(this);


/***/ }),
/* 11 */
/***/ (function(module, exports) {

	module.exports = function(h){
	    return function(args){
	        try{
	            return h(args);
	        }catch(e){
	            if(args.debug){
	               console.log("\nDEBUG: (ERROR in middleware)");
	               console.log(e.message);
	               console.log(e.stack);
	            }
	            if(!args.defer) {
	                console.log("\nDEBUG: (ERROR in middleware)");
	                console.log(e.message);
	                console.log(e.stack);
	                throw new Error("I need adapter.defer");
	            }
	            var deff = args.defer();
	            deff.reject(e);
	            return deff.promise;
	        }
	    };
	};


/***/ }),
/* 12 */
/***/ (function(module, exports) {

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


/***/ }),
/* 13 */
/***/ (function(module, exports) {

	exports.$$BundleLinkUrl =  function(rel){
	    return function(h) {
	        return function(args){
	            var matched = function(x){return x.relation && x.relation === rel;};
	            var res =  args.bundle && (args.bundle.link || []).filter(matched)[0];
	            if(res && res.url){
	                args.url = res.url;
	                args.data = null;
	            }
	            return h(args);
	        };
	    };
	};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
	    var mw = __webpack_require__(6);

	    // List of resources with 'patient' or 'subject' properties (as of FHIR DSTU2 1.0.0)
	    var targets = [
	        "Account",
	        "AllergyIntolerance",
	        "BodySite",
	        "CarePlan",
	        "Claim",
	        "ClinicalImpression",
	        "Communication",
	        "CommunicationRequest",
	        "Composition",
	        "Condition",
	        "Contract",
	        "DetectedIssue",
	        "Device",
	        "DeviceUseRequest",
	        "DeviceUseStatement",
	        "DiagnosticOrder",
	        "DiagnosticReport",
	        "DocumentManifest",
	        "DocumentReference",
	        "Encounter",
	        "EnrollmentRequest",
	        "EpisodeOfCare",
	        "FamilyMemberHistory",
	        "Flag",
	        "Goal",
	        "ImagingObjectSelection",
	        "ImagingStudy",
	        "Immunization",
	        "ImmunizationRecommendation",
	        "List",
	        "Media",
	        "MedicationAdministration",
	        "MedicationDispense",
	        "MedicationOrder",
	        "MedicationStatement",
	        "NutritionOrder",
	        "Observation",
	        "Order",
	        "Procedure",
	        "ProcedureRequest",
	        "QuestionnaireResponse",
	        "ReferralRequest",
	        "RelatedPerson",
	        "RiskAssessment",
	        "Specimen",
	        "SupplyDelivery",
	        "SupplyRequest",
	        "VisionPrescription"
	    ];

	    exports.$WithPatient = mw.$$Simple(function(args){
	        var type = args.type;
	        if (args.patient) {
	            if (type === "Patient") {
	                args.query = args.query || {};
	                args.query["_id"] = args.patient;
	                args["id"] = args.patient;
	            } else if (targets.indexOf(type) >= 0){
	                args.query = args.query || {};
	                args.query["patient"] = args.patient;
	            }
	        }
	        return args;
	    });
	}).call(this);


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
	    var utils = __webpack_require__(3);

	    var CONTAINED = /^#(.*)/;
	    var resolveContained = function(ref, resource) {
	        var cid = ref.match(CONTAINED)[1];
	        var ret = (resource.contained || []).filter(function(r){
	            return (r.id || r._id) == cid;
	        })[0];
	        return (ret && {content: ret}) || null;
	    };

	    var sync = function(arg) {
	        var cache = arg.cache;
	        var reference = arg.reference;
	        var bundle = arg.bundle;
	        var ref = reference;
	        if (!ref.reference) {return null;}
	        if (ref.reference.match(CONTAINED)) {return resolveContained(ref.reference, arg.resource);}
	        var abs = utils.absoluteUrl(arg.baseUrl, ref.reference);
	        var bundled = ((bundle && bundle.entry) || []).filter( function(e){
	            return e.id === abs;
	        })[0];
	        return bundled || (cache != null ? cache[abs] : void 0) || null;
	    };

	    var resolve = function(h){
	        return function(args) {
	            var cacheMatched = sync(args);
	            var ref = args.reference;
	            var def = args.defer();
	            if (cacheMatched) {
	                if(!args.defer){ throw new Error("I need promise constructor 'adapter.defer' in adapter"); }
	                def.resolve(cacheMatched);
	                return def.promise;
	            }
	            if (!ref) {
	                throw new Error("No reference found");
	            }
	            if (ref && ref.reference.match(CONTAINED)) {
	                throw new Error("Contained resource not found");
	            }
	            args.url = utils.absoluteUrl(args.baseUrl, ref.reference);
	            args.data = null;
	            return h(args);
	        };
	    };

	    module.exports.sync = sync;
	    module.exports.resolve = resolve;

	}).call(this);


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	(function() {
	    var utils = __webpack_require__(3);
	    var core = __webpack_require__(6);

	    var id = function(x){return x;};
	    var constantly = function(x){return function(){return x;};};

	    var get_in = function(obj, path){
	        return path.split('.').reduce(function(acc,x){
	            if(acc == null || acc == undefined) { return null; }
	            return acc[x];
	        }, obj);
	    };

	    var evalPropsExpr = function(exp, args){
	        var exps =  exp.split('||').map(function(x){return x.trim().substring(1);});
	        for(var i = 0; i < exps.length; i++){
	            var res = get_in(args, exps[i]);
	            if(res){ return res; }
	        }
	        return null;
	    };

	    var evalExpr = function(exp, args){
	        if (exp.indexOf(":") == 0){
	            return evalPropsExpr(exp, args);
	        } else {
	            return exp;
	        }
	    };

	    var buildPathPart = function(pth, args){
	        var k = evalExpr(pth.trim(), args);
	        if(k==null || k === undefined){ throw new Error("Parameter "+pth+" is required: " + JSON.stringify(args)); }
	        return k;
	    };

	    // path chaining function
	    // which return haldler wrapper: (h, cfg)->(args -> promise)
	    // it's chainable Path("baseUrl").slash(":type").slash(":id").slash("_history")(id, {})({id: 5, type: 'Patient'})
	    // and composable p0 = Path("baseUrl); p1 = p0.slash("path)
	    var Path = function(tkn, chain){
	        //Chainable
	        var new_chain = function(args){
	            return ((chain && (chain(args) + "/")) || "") +  buildPathPart(tkn, args);
	        };
	        var ch = core.Attribute('url', new_chain);
	        ch.slash = function(tkn){
	            return Path(tkn, new_chain);
	        };
	        return ch;
	    };

	    exports.Path = Path;
	}).call(this);


/***/ }),
/* 17 */
/***/ (function(module, exports) {

	(function() {
	    var fhirAPI;
	    var adapter;

	    function getNext (bundle, process) {
	        var i;
	        var d = bundle.data.entry || [];
	        var entries = [];
	        for (i = 0; i < d.length; i++) {
	            entries.push(d[i].resource);
	        }
	        process(entries);
	        var def = adapter.defer();
	        fhirAPI.nextPage({bundle:bundle.data}).then(function (r) {
	            getNext(r, process).then(function (t) {
	                def.resolve();
	            });
	        }, function(err) {def.resolve()});
	        return def.promise;
	    }
	    
	    function drain (searchParams, process, done, fail) {
	        var ret = adapter.defer();
	        
	        fhirAPI.search(searchParams).then(function(data){
	            getNext(data, process).then(function() {
	                done();
	            }, function(err) {
	                fail(err);
	            });
	        }, function(err) {
	            fail(err);
	        });
	    };
	    
	    function fetchAll (searchParams){
	        var ret = adapter.defer();
	        var results = [];
	        
	        drain(
	            searchParams,
	            function(entries) {
	                entries.forEach(function(entry) {
	                    results.push(entry);
	                });
	            },
	            function () {
	                ret.resolve(results);
	            },
	            function (err) {
	                ret.reject(err);
	            }
	        );
	          
	        return ret.promise;
	    };

	    function fetchAllWithReferences (searchParams, resolveParams) {
	        var ret = adapter.defer();
	          
	        fhirAPI.search(searchParams)  // TODO: THIS IS NOT CORRECT (need fetchAll, but it does not return a bundle yet)
	            .then(function(results){

	                var resolvedReferences = {};

	                var queue = [function() {ret.resolve(results, resolvedReferences);}];
	                
	                function enqueue (bundle,resource,reference) {
	                  queue.push(function() {resolveReference(bundle,resource,reference)});
	                }

	                function next() {
	                  (queue.pop())();
	                }

	                function resolveReference (bundle,resource,reference) {
	                    var referenceID = reference.reference;
	                    fhirAPI.resolve({'bundle': bundle, 'resource': resource, 'reference':reference}).then(function(res){
	                      var referencedObject = res.data || res.content;
	                      resolvedReferences[referenceID] = referencedObject;
	                      next();
	                    });
	                }

	                var bundle = results.data;

	                bundle.entry && bundle.entry.forEach(function(element){
	                  var resource = element.resource;
	                  var type = resource.resourceType;
	                  resolveParams && resolveParams.forEach(function(resolveParam){
	                    var param = resolveParam.split('.');
	                    var targetType = param[0];
	                    var targetElement = param[1];
	                    var reference = resource[targetElement];
	                    if (type === targetType && reference) {
	                      var referenceID = reference.reference;
	                      if (!resolvedReferences[referenceID]) {
	                        enqueue(bundle,resource,reference);
	                      }
	                    }
	                  });
	                });

	                next();

	            }, function(){
	                ret.reject("Could not fetch search results");
	            });
	          
	        return ret.promise;
	    };
	    
	    function decorate (client, newAdapter) {
	        fhirAPI = client;
	        adapter = newAdapter;
	        client["drain"] = drain;
	        client["fetchAll"] = fetchAll;
	        client["fetchAllWithReferences"] = fetchAllWithReferences;
	        return client;
	    }
	    
	    module.exports = decorate;
	}).call(this);

/***/ })
/******/ ]);