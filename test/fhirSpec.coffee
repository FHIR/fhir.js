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
    subject.search type: 'Patient', query: {name: 'maud'}, success: done

  it "conformance", (done)->
    subject.conformance success: done

  it "profile", (done)->
    subject.profile type: 'Patient', success: done

  it "transaction", (done)->
    subject.transaction bundle: 'bundle', success: done

  it "read", (done)->
    subject.read id :'BASE/Patient/123', success: done
