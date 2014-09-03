jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

fhir = require('../coffee/adapters/jqFhir.js')

describe "jqFhir", ->
  subject = fhir
      baseUrl: 'https://ci-api.fhir.me',
      patient: '123',
      auth: {user: 'client', pass: 'secret'}

  it "simplest", (done) ->
    errdone = (er)->
      console.log('Error while search', er)
      done()
    subject.search('Patient', {name: 'maud'}).then(done,errdone)
