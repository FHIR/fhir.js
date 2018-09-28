# Include Polyfills So phantom dosnt complain
require('whatwg-fetch')
require('babel-polyfill/dist/polyfill')

# Setup Spec
nativefhir = require('../src/adapters/native')
spec = require('../src/spec.coffee')
spec.spec_for 'native', nativefhir, spec.baseUrl
