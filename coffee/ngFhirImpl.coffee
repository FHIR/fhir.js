fhir = require('./fhir.js')

implementXhr = ($http)->
  (q)->
    p = $http(method: q.method, url: q.url, data: q.data)
    p.success(q.success) if q.success
    p.error(q.error) if q.error
    p

# TODO: configure by angular.config
# search return promises

angular.module('ng-fhir', [])
angular.module('ng-fhir').provider '$fhir', ()->
  $get: ($http)->
    fhir.setAdapter
      http: implementXhr($http)

    fhir: fhir
    search: fhir.search
    conformance: fhir.conformance
    profile: fhir.profile
    transaction: fhir.transaction

exports.ngInit = ()-> console.log('ng initialized')