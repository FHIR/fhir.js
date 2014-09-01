mkFhir = require('../fhir.js')
$ = jQuery

adapter = {
  "http": (q)->
    a = $.ajax {type: q.method, url: q.url, headers: q.headers}
    a.done(q.success) if q.success
    a.fail(q.error) if q.error
}

module.exports = (config)->
  fhir = mkFhir(config, adapter)

  search: (type, query) ->
    ret = $.Deferred()
    fhir.search(type, query, ret.resolve, ret.reject)
    ret

