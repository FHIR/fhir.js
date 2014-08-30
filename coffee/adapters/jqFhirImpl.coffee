fhir = require('../fhir.js')
$ = require('jquery')
instance = fhir()

adapter = {
  "http": (q)->
    a = $.ajax {type: q.method, url: q.url, headers: q.headers}
    a.done(q.success) if q.success
    a.fail(q.error) if q.error
}

instance.adapter.set adapter

exports.fhir = instance
exports.config = instance.config

exports.search = (type, query) ->
  ret = $.Deferred()
  instance.search(type, query, ret.resolve, ret.reject)
  ret
