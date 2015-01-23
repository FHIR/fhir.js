mkFhir = require('../fhir')
merge = require('merge')
utils = require('../utils')
auth = require('../middlewares/httpAuthentication')
searchByPatient = require('../middlewares/searchByPatient')
searchResultsAsGraph = require('../middlewares/searchResultsAsGraph')

yui = YUI()

adapter =
  http: (q)->
    yui.use 'io', (Y) ->
      q = merge(true, q)
      q.headers = q.headers || {}
      q.headers["Accept"] = "application/json"
      q.headers["Content-Type"] = "application/json; charset=utf-8"
      q.data = q.data || q.params
      q.on = {
        success: (id, data, args) ->
          fn = (headerName) ->
            data.getResponseHeader headerName
          q.success(JSON.parse(data.responseText), data.status, fn)
        failure: (id, args) ->
          q.error(null, args)
      }
      Y.io q.url, q

module.exports = (config)->
  defaultMiddlewares =
    http: [auth]
    search: [searchByPatient, searchResultsAsGraph]

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
  ].reduce ((acc, v)-> acc[v] = fhir[v]; acc), {}
  ret.resolveSync = fhir.resolveSync
  ret