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

  @timeout(10000)

  subject = fhir(baseUrl: 'http://localhost:8976/node_test', patient: '123', auth: {user: 'client', pass: 'secret'})

  it "create", (done)->
    fail = (err)-> done(); throw new Error("Ups")
    success = (res)->
      console.log res.data
      done()
    subject.create(new_pt).then(success, fail)

  it "search", (done)->
    fail = (err)-> console.error(err); done()
    success =  (res)->
      expect((res.data.entry.length >= 1)).toBe(true)
      done()

    subject.search({type: 'Patient', query: {name: 'adams'}}).then(success, fail)
