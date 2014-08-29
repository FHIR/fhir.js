fhir = require('./fhir.js')

implementXhr = ($http)->
  (q)->
    console.log('ng-xhr', q)
    $http(method: q.method, url: q.url)
      .success(q.success)
      .error(q.error)

# TODO: configure by angular.config
# search return promises

angular.module('ng-fhir', [])
angular.module('ng-fhir').provider '$fhir', ()->
  $get: ($http)->
    fhir.setAdapter
      xhr: implementXhr($http)

    fhir: fhir
    search: fhir.search

exports.ngInit = ()-> console.log('ng initialized')
