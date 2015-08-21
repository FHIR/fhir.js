fhir = require('../src/adapters/node')

describe "nodejs adapter", ->
  it "simplest", (done) ->
    subject = fhir(debug: true, baseUrl: 'https://ci-api.fhir.me', patient: '123', auth: {user: 'client', pass: 'secret'})

    fail = (err)-> console.error(err); done()

    success =  (res)->
      expect(res.data.entry.length).toBe(1)
      done()

    subject.search({type: 'Patient', query: {name: 'adams'}}).then(success, fail)

new_pt =
  resource:
    resourceType: 'Patient'
    name: [ {
      family: [ 'Fhirjs' ]
      given: [ 'Node' ]
    }]
    birthDate: '1990-06-20'

describe "nodejs adapter", ->
  subject = fhir(baseUrl: 'http://fhirtest.uhn.ca/baseDstu1', debug: true)

  iit "simplest", (done)->
    fail = (data)-> console.log("FAIL:", data); done()
    subject.create(new_pt).then(done, fail)

  it "search", (done)->
    subject.search(type: 'Patient', query: {name: 'Node'}).then(done)
