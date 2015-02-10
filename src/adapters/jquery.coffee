mkFhir = require('../fhir')
merge = require('merge')
utils = require('../utils')
auth = require('../middlewares/httpAuthentication')
searchByPatient = require('../middlewares/searchByPatient')
searchResultsAsGraph = require('../middlewares/searchResultsAsGraph')
merge = require('merge')

$ = jQuery

adapter =
  http: (q)->
    a = $.ajax
      type: q.method,
      url: q.url,
      headers: q.headers,
      dataType: "json",
      contentType: "application/json",
      data: q.data || q.params

    if q.success
      a.done (data, status, xhr) ->
        q.success(data, status, xhr.getResponseHeader)

    if q.error
      a.fail ()->
        q.error.call(null, arguments)

module.exports = (config)->

  defaultMiddlewares =
    http: [auth]
    search: [searchByPatient, searchResultsAsGraph]

  middlewares = utils.mergeLists(config.middlewares, defaultMiddlewares)

  config = merge(true, config, {middlewares:middlewares})

  fhir = mkFhir(config, adapter)

  defer = (fname)->
    fn = fhir[fname]
    (args) ->
      ret = $.Deferred()
      args.success = ret.resolve
      args.error = ret.reject
      fn(args)
      ret

  [
    "search"
    "conformance"
    "document"
    "profile"
    "transaction"
    "history"
    "create"
    "read"
    "update"
    "delete"
    "vread"
    "resolve"
  ].reduce ((acc, v)-> acc[v] = defer(v); acc), {
    "resolveSync": fhir["resolveSync"]
  }
