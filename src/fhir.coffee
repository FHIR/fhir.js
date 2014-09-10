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
  search: (type, query, cb, err) ->
    wrapped = wrap(cfg, search.search, middlewares.search)
    wrapped baseUrl, http, type, query, cb, err

  nextPage: (bundle, cb, err) ->
    search.next baseUrl, http, bundle, cb, err

  prevPage: (bundle, cb, err) ->
    search.prev baseUrl, http, bundle, cb, err

  conformance: (cb, err) ->
    conf.conformance baseUrl, http, cb, err

  profile: (type, cb, err) ->
    conf.profile baseUrl, http, type, cb, err

  transaction: (bundle, cb, err) ->
    transaction baseUrl, http, bundle, cb, err

  history: ->
    history.apply null, [
      baseUrl
      http
    ].concat(arguments)

  create: (entry, cb, err) ->
    crud.create baseUrl, http, entry, cb, err

  read: (id, cb, err) ->
    crud.read baseUrl, http, id, cb, err

  update: (entry, cb, err) ->
    crud.update baseUrl, http, entry, cb, err

  delete: (entry, cb, err) ->
    crud["delete"] baseUrl, http, entry, cb, err

  resolve: (ref, resource, bundle, cb, err) ->
    resolve.async baseUrl, http, cfg.cache and cache[baseUrl], ref, resource, bundle, cb, err

  resolveSync: (ref, resource, bundle) ->
    resolve.sync baseUrl, http, cfg.cache and cache[baseUrl], ref, resource, bundle

module.exports = fhir
