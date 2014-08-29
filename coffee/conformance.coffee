a = require('./adapter.coffee')
c = require('./configuration.coffee')

exports.conformance = (cb)->
  a.adapter.xhr('GET', "#{c.fhir.base}/metadata", cb)

exports.profile = (rt, cb)->
  a.adapter.xhr('GET', "#{c.fhir.base}/Profile/#{rt}", cb)