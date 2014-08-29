fhir = require('../fhir.js')
instance = fhir()

implementXhr = ($http)->
  (q)->
    p = $http(method: q.method, url: q.url, data: q.data)
    p.success(q.success) if q.success
    p.error(q.error) if q.error
    p

angular.module('ng-fhir', ['ng'])
angular.module('ng-fhir').provider '$fhir', ()->
  prov = {}
  constructor = ($http)->
    instance.config.set(baseUrl: prov.baseUrl)
    instance.adapter.set
      http: implementXhr($http)

    search: instance.search
    conformance: instance.conformance
    profile: instance.profile
    transaction: instance.transaction

  prov.$get = constructor
  prov

exports.ngInit = ()-> console.log('ng initialized')
