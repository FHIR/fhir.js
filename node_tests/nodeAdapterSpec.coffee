fhir = require('../src/adapters/node.coffee')

describe "nodejs adapter", ->
  subject = fhir
      baseUrl: 'https://ci-api.fhir.me',
      patient: '123',
      auth: {user: 'client', pass: 'secret'}

  it "simplest", (done) ->
    subject.search('Patient', {name: 'adams'},
      (err, patient)->
        expect(err).toBe(null)
        expect(patient.entry.length).toBe(1)
        done()
    )
