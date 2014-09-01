fhir = require('../coffee/fhir.js')


describe "fhir:", ->
  cfg = {baseUrl: 'BASE'}
  adapter =  {http: ((x)-> x.success(x))}
  subject = fhir(cfg, adapter)

  it "api", ()->
    expect(subject.search).not.toBe(null)
    expect(subject.profile).not.toBe(null)
    expect(subject.transaction).not.toBe(null)

  it "search", (done)->
    subject.search 'Patient', {name: 'maud'}, (_)-> done()

  it "conformance", (done)->
    subject.conformance (_)-> done()

  it "profile", (done)->
    subject.profile 'Patient', (_)-> done()

  it "transaction", (done)->
    subject.transaction 'bundle', (_)-> done()

