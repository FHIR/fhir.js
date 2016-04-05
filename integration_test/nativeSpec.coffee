# Include Polyfills So phantom dosnt complain
require('whatwg-fetch')
require('babel-polyfill/dist/polyfill')

# Extend Timeout
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000

# Setup Spec
nativefhir = require('../src/adapters/native')
spec = require('../src/spec.coffee')
spec.spec_for 'native', nativefhir, 'http://try-fhirplace.hospital-systems.com'
