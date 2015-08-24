jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

jqfhir = require('../src/adapters/jquery')
spec = require('../src/spec.coffee')
spec.spec_for 'jquery', jqfhir, 'http://try-fhirplace.hospital-systems.com'

