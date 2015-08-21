jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

fhir = require('../src/adapters/jquery')

describe "jquery", ->
  subject = fhir
      baseUrl: 'https://ci-api.fhir.me',
      patient: '123',
      auth: {user: 'client', pass: 'secret'}

  mkfail = (done)->
    (err)->
      console.log(err)
      done()

  it "simplest", (done) ->
    subject.search(type: 'Patient', query: {name: 'maud'})
      .done (d)-> done()
      .fail mkfail(done)

  it "can convert results to an in-memory graph", (done) ->
    subject.search(type: 'Observation', graph: true, query: {$include: {Observation: 'subject'}})
      .done (d)->
        expect(d[0].subject.resourceType).toBe('Patient')
        done()
      .fail mkfail(done)


  it "can post", (done) ->
    exampleSecEvent = require('../fixtures/securityevent.js')
    subject.create {resource: exampleSecEvent}
      .then done
      .fail mkfail(done)

  it "can resolve refs", (done) ->
    subject.search
      type: 'MedicationPrescription'
      query:
        $include:
          MedicationPrescription: 'medication'
    .then (resp)->
      rxs = resp.data
      rx = rxs.entry[0].content
      med = subject.resolveSync
        reference: rx.medication
        resource: rx
        bundle: rx
      expect(med.content).toBeTruthy()
      done()
