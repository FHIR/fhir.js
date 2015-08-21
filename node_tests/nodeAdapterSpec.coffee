fhir = require('../src/adapters/node')

describe "nodejs adapter", ->

  it "simplest", (done) ->
    subject = fhir baseUrl: 'https://ci-api.fhir.me', patient: '123', auth: {user: 'client', pass: 'secret'}

    subject.search {type: 'Patient', query: {name: 'adams'}},
      (err, res)->
        expect(err).toBe(null)
        expect(res.entry.length).toBe(1)
        done()

new_pt =
  resource:
    resourceType: 'Patient'
    name: [ {
      family: [ 'Fhirjs' ]
      given: [ 'Node' ]
    }]
    birthDate: '1990-06-20'

describe "nodejs adapter", ->
  subject = fhir baseUrl: 'http://fhirtest.uhn.ca/baseDstu1'

  it "simplest", (done) ->
    subject.create new_pt, (err, uri)->
      if err
        console.log 'error', err
      else
        console.log 'created', uri
      done()

  it "search", (done) ->
    subject.search {type: 'Patient', query: {name: 'Node'}}, (err,res)->
      # console.log(err,res)
      done()
