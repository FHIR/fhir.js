fhir = require('../fhir.js')
$ = require('jquery')

adapter = {
  "http": (q)->
    console.log "Requesting", q.method, q.url, q.headers
    a = $.ajax {type: q.method, url: q.url, headers: q.headers}
    a.done(q.success) if q.success
    a.fail(q.error) if q.error
}

fhir.setAdapter adapter

exports.fhir = fhir
exports.configure = fhir.configure

exports.search = (type, query) ->
  ret = $.Deferred()
  fhir.search(type, query, ret.resolve, ret.reject)
  ret
