jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

fhir = require('../src/adapters/yui')
spec = require('../src/spec.coffee')
spec.spec_for 'yui', fhir, 'http://try-fhirplace.hospital-systems.com'
