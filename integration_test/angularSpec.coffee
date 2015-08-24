jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

fhir = require('../src/adapters/angularjs')
spec = require('../src/spec.coffee')



baseUrl = 'http://try-fhirplace.hospital-systems.com'
app = angular.module('test', ['ng-fhir'])
app.config ($fhirProvider)-> $fhirProvider.baseUrl = baseUrl
$injector = angular.injector(['test'])

q = null
$injector.invoke ['$q', ($q)-> q = $q]

impl = (cfg)->
  fhir = null
  $injector.invoke ['$fhir', ($fhir)-> fhir = $fhir]
  fhir

impl.defer = q.defer

spec.spec_for 'angular', impl, baseUrl 
