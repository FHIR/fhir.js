search = require("./search")
conf = require("./conformance")
transaction = require("./transaction")
tags = require("./tags")
history = require("./history")
crud = require("./resource")
wrap = require("./wrap")
utils = require("./utils")
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

  conformance: (opt) ->
    opt.baseUrl =  baseUrl
    opt.http =  http
    conf.conformance(opt)

  profile: (opt)->
    opt.baseUrl =  baseUrl
    opt.http =  http
    conf.profile opt

  transaction: (opt)->
    opt.baseUrl =  baseUrl
    opt.http =  http
    transaction(opt)

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

  resolve: (opt) ->
    opt.baseUrl =  baseUrl
    opt.http =  http
    opt.cache = cfg.cache and cache[baseUrl]
    resolve.async(opt)

  resolveSync: (opt) ->
    opt.baseUrl =  baseUrl
    opt.http =  http
    opt.cache = cfg.cache and cache[baseUrl]
    resolve.sync(opt)

module.exports = fhir
