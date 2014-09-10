search = require("./search.coffee")
conf = require("./conformance.coffee")
transaction = require("./transaction.coffee")
tags = require("./tags.coffee")
history = require("./history.coffee")
crud = require("./resource.coffee")
wrap = require("./wrap.coffee")
utils = require("./utils.coffee")
cache = {}
# construct fhir object
# params:
#   * cfg - config object - props???
#   * adapter - main operations
#      * http - function({method, url, success, error})
#               call success with (data, status, headersFn, config)
fhir = (cfg, adapter) ->
  # TODO: add cfg & adapter validation
  middlewares = cfg.middlewares or {}
  http = wrap(cfg, adapter.http, middlewares.http)
  baseUrl = cfg.baseUrl
  search: (opt) ->
    opt.baseUrl =  baseUrl
    opt.http =  http
    wrapped = wrap(cfg, search.search, middlewares.search)
    wrapped opt

  nextPage: (opt) ->
    opt.baseUrl =  baseUrl
    opt.http =  http
    search.next opt

  prevPage: (opt) ->
    opt.baseUrl =  baseUrl
    opt.http =  http
    search.prev opt

  conformance: (cb, err) ->
    conf.conformance baseUrl, http, cb, err

  profile: (type, cb, err) ->
    conf.profile baseUrl, http, type, cb, err

  transaction: (bundle, cb, err) ->
    transaction baseUrl, http, bundle, cb, err

  history: (opt)->
    opt.baseUrl =  baseUrl
    opt.http =  http
    history(opt)

  create: (opt) ->
    opt.baseUrl =  baseUrl
    opt.http =  http
    crud.create opt

  read: (opt) ->
    opt.baseUrl =  baseUrl
    opt.http =  http
    crud.read opt

  update: (opt) ->
    opt.baseUrl =  baseUrl
    opt.http =  http
    crud.update opt

  delete: (opt) ->
    opt.baseUrl =  baseUrl
    opt.http =  http
    crud["delete"](opt)

  resolve: (ref, resource, bundle, cb, err) ->
    resolve.async baseUrl, http, cfg.cache and cache[baseUrl], ref, resource, bundle, cb, err

  resolveSync: (ref, resource, bundle) ->
    resolve.sync baseUrl, http, cfg.cache and cache[baseUrl], ref, resource, bundle

module.exports = fhir
