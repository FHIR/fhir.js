fhir = require('../src/adapters/angularjs')
spec = require('../src/spec.coffee')



baseUrl = spec.baseUrl
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
