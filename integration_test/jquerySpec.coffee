jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

fhir = require('../coffee/adapters/jqFhir.js')

ddescribe "jqFhir", ->
  subject = fhir
      baseUrl: 'https://ci-api.fhir.me',
      patient: '123',
      auth: {user: 'client', pass: 'secret'}

  iit "simplest", (done) ->
    q = subject.search('Patient', {name: 'maud'})
    console.log(q)
    q.then (d)-> done()
