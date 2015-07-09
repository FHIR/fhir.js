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
    q.headers["Content-Type"] = "application/json"
    q.body = q.data
    q.json = true

    request q, (err, response, body)->
      headers = (x)->
        response.headers[x.toLowerCase()]
      if (err)
        q.error(err, response.statusCode, headers, q)
      else if response.statusCode > 399
        q.error(body, response.statusCode, headers, q)
      else
        q.success(body, response.statusCode, headers, q)

wrappToErrbackForm = (fhir, fn)->
  (opt, cb) ->
    opt.callback = cb
    opt = merge true, opt,
      success: (res, status, headersFn, query)->
        cb(null, res, status, headersFn, query)
      error: (err, status, headersFn, query)->
        cb(err, null, status, headersFn, query)
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
  ].reduce ((acc, v)-> acc[v] = wrappToErrbackForm(fhir, v); acc), {}
  ret.resolveSync = fhir.resolveSync
  ret
