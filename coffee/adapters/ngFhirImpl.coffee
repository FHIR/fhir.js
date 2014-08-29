fhir = require('../fhir.js')

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
    fhir.configure(baseUrl: prov.baseUrl)
    fhir.setAdapter
      http: implementXhr($http)

    search: fhir.search
    conformance: fhir.conformance
    profile: fhir.profile
    transaction: fhir.transaction

<<<<<<< HEAD:coffee/ngFhirImpl.coffee
exports.ngInit = ()-> console.log('ng initialized')
=======
  prov.$get = constructor
  prov

exports.ngInit = ()-> console.log('ng initialized')
>>>>>>> 81336413c28f979caf657101c0691a377357c45e:coffee/adapters/ngFhirImpl.coffee
