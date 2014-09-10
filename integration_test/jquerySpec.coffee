jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

fhir = require('../src/adapters/jqFhir.coffee')

describe "jqFhir", ->
  subject = fhir
      baseUrl: 'https://ci-api.fhir.me',
      patient: '123',
      auth: {user: 'client', pass: 'secret'}

  it "simplest", (done) ->
    subject.search(type: 'Patient', query: {name: 'maud'})
      .done (d)-> done()
      .fail (d)-> throw "failed seach"
