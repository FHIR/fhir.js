request = require('request')
mkFhir = require('../fhir')
merge = require('merge')
utils = require('../utils')
auth = require('../middlewares/httpAuthentication')
searchByPatient = require('../middlewares/searchByPatient')
merge = require('merge')

adapter = {
  "http": (q)->

    q = merge(true, q)
    q.headers = q.headers || {}
    q.headers["Accept"] = "application/json"
    q.json = true

    request q, (err, response, body)->
      if (err)
        q.error(err)
      else
        q.success(body, response.statusCode, response.getHeader, q)
}


module.exports = (config)->

  defaultMiddlewares = {
    http: [auth]
    search: [searchByPatient]
  }

  middlewares = utils.mergeLists(config.middlewares, defaultMiddlewares)
  config = merge(true, config, {middlewares:middlewares})
  fhir = mkFhir(config, adapter)

  errbackform = (fn)->
    (args...) ->
      precb = args.slice(0, -1)
      cb = args.slice(-1)[0]
      
      separate = precb.concat(
        (args...) ->
          cb.apply null, [null].concat(args)
        (err)->
          cb(err)
      )
      fhir[fn].apply(null, separate)

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
  ].reduce ((acc, v)-> acc[v] = errbackform(v); acc), {}
  ret.resolveSync = fhir.resolveSync
  ret
