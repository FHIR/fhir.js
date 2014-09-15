request = require('request')
mkFhir = require('../fhir')
merge = require('merge')
utils = require('../utils')
auth = require('../middlewares/httpAuthentication')
searchByPatient = require('../middlewares/searchByPatient')
merge = require('merge')

adapter =
  http: (q)->
    q = merge(true, q)
    q.headers = q.headers || {}
    q.headers["Accept"] = "application/json"
    q.json = true

    request q, (err, response, body)->
      if (err)
        q.error(err, response.statusCode, response.getHeader, q)
      else
        q.success(body, response.statusCode, response.getHeader, q)

wrappToErrbackForm = (fhir, fn)->
  (opt, cb) ->
    opt = merge true, opt,
      success: (res)-> cb(null, res)
      error: (err)-> cb(err, null)
    fhir[fn](opt)

module.exports = (config)->
  defaultMiddlewares =
    http: [auth]
    search: [searchByPatient]

  middlewares = utils.mergeLists(config.middlewares, defaultMiddlewares)
  config = merge(true, config, {middlewares:middlewares})
  fhir = mkFhir(config, adapter)

  ret = [
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
    "resolve"
  ].reduce ((acc, v)-> acc[v] = wrappToErrbackForm(fhir, v); acc), {}
  ret.resolveSync = fhir.resolveSync
  ret
