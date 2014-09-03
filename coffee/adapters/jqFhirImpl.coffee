mkFhir = require('../fhir.js')
utils = require('../utils.coffee')
auth = require('../middlewares/httpAuthentication.coffee')
searchByPatient = require('../middlewares/searchByPatient.coffee')

$ = jQuery

adapter = {
  "http": (q)->
    a = $.ajax {type: q.method, url: q.url, headers: q.headers}
    a.done(q.success) if q.success
    a.fail(q.error) if q.error
}

module.exports = (config)->

  defaultMiddlewares = {
    http: [auth]
    search: [searchByPatient]
  }

  middlewares = utils.mergeLists(cfg.middlewares, defaultMiddlewares)

  config = merge(true, config, {middlewares:middlewares})
 
  fhir = mkFhir(config, adapter)

  defer = (fname) ->
    ret = $.Deferred()
    args = utils.argsArray
      .apply(null, argumets)
      .concat([ret.resolve, ret.reject])

    fhir[fname].apply(null, args)
    ret

  ops = {}

  for v in [
    "search",
    "conformance",
    "profile",
    "transaction",
    "history",
    "create",
    "read",
    "update",
    "delete",
    "vread"]
    ops[v] = defer(v)

  ops
