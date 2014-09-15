mkFhir = require('../fhir')
merge = require('merge')
utils = require('../utils')
auth = require('../middlewares/httpAuthentication')
searchByPatient = require('../middlewares/searchByPatient')
merge = require('merge')

$ = jQuery

adapter = {
  "http": (q)->
    a = $.ajax {
      type: q.method,
      url: q.url,
      headers: q.headers,
      dataType: "json",
      contentType: "application/json",
      data: q.data}

    if q.success
      onSuccess = (data, status, xhr) ->
        q.success(data, status, xhr.getResponseHeader)
      a.done(onSuccess)
    a.fail(q.error) if q.error
}

module.exports = (config)->

  defaultMiddlewares = {
    http: [auth]
    search: [searchByPatient]
  }

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
    "profile"
    "transaction"
    "history"
    "create"
    "read"
    "update"
    "delete"
    "vread"
  ].reduce ((acc, v)-> acc[v] = defer(v); acc), {}
