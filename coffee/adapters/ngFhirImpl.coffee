mkFhir = require('../fhir.js')

implementXhr = ($http)->
  (q)->
    p = $http(q)
    p.success(q.success) if q.success
    p.error(q.error) if q.error
    p

angular.module('ng-fhir', ['ng'])
angular.module('ng-fhir').provider '$fhir', ()->
  prov =
    $get: ($http)->
      adapter = {http: implementXhr($http)}
      fhir = mkFhir(prov, adapter)

      search: fhir.search
      conformance: fhir.conformance
      profile: fhir.profile
      transaction: fhir.transaction
      history: fhir.history

exports.ngInit = ()-> console.log('ng initialized')
