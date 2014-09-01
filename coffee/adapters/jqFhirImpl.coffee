mkFhir = require('../fhir.js')
$ = require('jquery')

adapter = {
  "http": (q)->
    a = $.ajax {type: q.method, url: q.url, headers: q.headers}
    a.done(q.success) if q.success
    a.fail(q.error) if q.error
}

config = {}
fhir = null

exports.configure = (config)->
  fhir = mkFhir(config, adapter)

exports.search = (type, query) ->
  ret = $.Deferred()
  fhir.search(type, query, ret.resolve, ret.reject)
  ret
