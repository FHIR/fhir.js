jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000
fhir = require('../src/adapters/node')

new_pt =
  resource:
    resourceType: 'Patient'
    name: [ {
      family: [ 'Fhirjs' ]
      given: [ 'Node' ]
    }]
    birthDate: '1990-06-20'

describe "nodejs adapter", ->
  subject = fhir(baseUrl: 'https://ci-api.fhir.me', patient: '123', auth: {user: 'client', pass: 'secret'})

  it "create", (done)->
    fail = (err)-> done(); throw new Error("Ups")
    subject.create(new_pt).then(done, fail)
    done()

  it "search", (done)->
    fail = (err)-> console.error(err); done()
    success =  (res)->
      expect((res.data.entry.length >= 1)).toBe(true)
      done()

    subject.search({type: 'Patient', query: {name: 'adams'}}).then(success, fail)
