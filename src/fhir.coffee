search = require("./search")
conf = require("./conformance")
transaction = require("./transaction")
tags = require("./tags")
history = require("./history")
crud = require("./resource")
wrap = require("./wrap")
utils = require("./utils")
resolve = require('./resolve')
merge = require('merge')
cache = {}
# construct fhir object
# params:
#   * cfg - config object - props???
#   * adapter - main operations
#      * http - function({method, url, params, data, success, error})
#               call success with (data, status, headersFn, config)

fhir = (cfg, adapter) ->
  # TODO: add cfg & adapter validation
  middlewares = cfg.middlewares or {}
  http = wrap(cfg, adapter.http, middlewares.http)
  baseUrl = cfg.baseUrl

  deps = (opt)->
    merge(true, opt, baseUrl: baseUrl, http: http)

  depsWithCache = (opt)->
    merge(true, opt, baseUrl: baseUrl, http: http, cache: (cfg.cache and cache[baseUrl]))

  search: (opt) ->
    wrapped = wrap(cfg, search.search, middlewares.search)
    wrapped merge(true, opt, baseUrl: baseUrl, http: http)

  nextPage: (opt) ->
    search.next deps(opt)

  prevPage: (opt) ->
    search.prev deps(opt)

  conformance: (opt) ->
    conf.conformance deps(opt)

  profile: (opt)->
    conf.profile deps(opt)

  transaction: (opt)->
    transaction deps(opt)

  history: (opt)->
    history deps(opt)

  create: (opt) ->
    crud.create deps(opt)

  read: (opt) ->
    crud.read deps(opt)

  update: (opt) ->
    crud.update deps(opt)

  delete: (opt) ->
    crud["delete"] deps(opt)

  resolve: (opt) ->
    resolve.async(opt) depsWithCache(opt)

  resolveSync: (opt) ->
    resolve.sync(opt) depsWithCache(opt)

module.exports = fhir
