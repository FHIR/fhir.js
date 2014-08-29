jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

angular.module('test', ['ng-fhir'])
  .config ($fhirProvider)->
     $fhirProvider.baseUrl = 'http://try-fhirplace.hospital-systems.com'

describe "ngFhir", ->
  $injector = angular.injector(['test'])

  it "search", (done) ->
    $injector.invoke ['$fhir', ($fhir)->
       $fhir.fhir.configure(baseUrl: 'http://try-fhirplace.hospital-systems.com')
       $fhir.search('Patient', {name: 'maud'})
         .then (d)->
           console.log('Search by patients', d)
           done()
     ]

  bundle = '{"resourceType":"Bundle","entry":[]}'

  it "transaction", (done) ->
    $injector.invoke ['$fhir', ($fhir)->
       console.log('FHIR provider', $fhir)
       $fhir.fhir.configure(baseUrl: 'http://try-fhirplace.hospital-systems.com')
       $fhir.transaction(bundle)
         .then (d)->
           console.log('Transaction', d)
           done()
     ]
