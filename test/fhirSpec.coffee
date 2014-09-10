fhir = require('../src/fhir.coffee')


describe "fhir:", ->
  cfg = {baseUrl: 'BASE'}
  adapter =  {http: ((x)-> x.success(x))}
  subject = fhir(cfg, adapter)

  it "api", ()->
    expect(subject.search).not.toBe(null)
    expect(subject.profile).not.toBe(null)
    expect(subject.transaction).not.toBe(null)

  it "search", (done)->
    subject.search type: 'Patient', query: {name: 'maud'}, success: (_)-> done()

  it "conformance", (done)->
    subject.conformance (_)-> done()

  it "profile", (done)->
    subject.profile 'Patient', (_)-> done()

  it "transaction", (done)->
    subject.transaction 'bundle', (_)-> done()

  it "read", (done)->
    subject.read id :'BASE/Patient/123', success: (_)-> done()
