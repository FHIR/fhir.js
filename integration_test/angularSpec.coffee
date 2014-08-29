jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

describe "ngFhir", ->
  $injector = angular.injector(['ng', 'ng-fhir'])

  it "simplest", (done) ->
    $injector.invoke ['$fhir', ($fhir)->
       console.log('FHIR provider', $fhir)
       $fhir.fhir.configure(baseUrl: 'http://try-fhirplace.hospital-systems.com')
       $fhir.search('Patient', {name: 'maud'})
         .then (d)->
           console.log('Search by patients', d)
           done()
     ]
