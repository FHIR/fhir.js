var search = require('./search.coffee');
var conf = require('./conformance.coffee');
var transaction = require('./transaction.coffee');
var tags = require('./tags.coffee');
var history = require('./history.coffee');
var crud = require('./resource.coffee');
var wrap = require('./wrap.coffee');
var utils = require('./utils.coffee');

// construct fhir object
// params:
//   * cfg - config object - props???
//   * adapter - main operations
//      * http - function({method, url, success, error})
//               call success with (data, status, headersFn, config)

var cache = {};

function fhir(cfg, adapter){
  // TODO: add cfg & adapter validation
  var middlewares =cfg.middlewares || {};
 
  var http = wrap(cfg, adapter.http, middlewares.http)
  var baseUrl = cfg.baseUrl

  return {
    "search": function(type, query, cb, err){
      var wrapped = wrap(cfg, search.search, middlewares.search);
      return wrapped(baseUrl, http, type, query, cb, err);
    },
    "nextPage": function(bundle, cb, err){
      return search.next(baseUrl, http, bundle, cb, err);
    },
    "prevPage": function(bundle, cb, err){
      return search.prev(baseUrl, http, bundle, cb, err);
    },
    "conformance": function(cb, err){
      return conf.conformance(baseUrl, http, cb, err)
    },
    "profile": function(type, cb, err){
      return conf.profile(baseUrl, http, type, cb, err)
    },
    "transaction": function(bundle, cb, err){
      return transaction(baseUrl, http, bundle, cb, err)
    },
    "history": function(){
      return history.apply(null, [baseUrl, http].concat(arguments))
    },
    "create": function(entry, cb, err){
      return crud.create(baseUrl, http, entry, cb, err)
    },
    "read": function(id, cb, err){
      return crud.read(baseUrl, http, id , cb, err)
    },
    "update": function(entry, cb, err){
      return crud.update(baseUrl, http, entry, cb, err)
    },
    "delete": function(entry, cb, err){
      return crud["delete"](baseUrl, http, entry, cb, err)
    },
    "resolve": function(ref, resource, bundle, cb, err){
      return resolve.async(baseUrl, http, cfg.cache && cache[baseUrl], ref, resource, bundle, cb, err);
    },
    "resolveSync": function(ref, resource, bundle){
      return resolve.sync(baseUrl, http, cfg.cache && cache[baseUrl], ref, resource, bundle);
    }
  }
}

module.exports = fhir
