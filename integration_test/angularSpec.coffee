jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

angular.module('test', ['ng-fhir'])
  .config ($fhirProvider)->
     $fhirProvider.baseUrl = 'http://try-fhirplace.hospital-systems.com'

describe "ngFhir", ->
  $injector = angular.injector(['test'])

  it "search", (done) ->
    $injector.invoke ['$fhir', ($fhir)->
       $fhir.search('Patient', {name: 'maud'})
         .then (d)->
           console.log('Search by patients', d)
           done()
     ]
