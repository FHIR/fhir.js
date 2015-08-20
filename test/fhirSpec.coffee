fhir = require('../src/fhir')

describe "fhir", ->
  cfg = {baseUrl: 'BASE'}
  res = true
  adapter =  {http: ((x)-> x.success && x.success(x))}
  subject = fhir(cfg, adapter)

  it "api", ()->
    expect(subject.search).not.toBe(null)
    expect(subject.profile).not.toBe(null)
    expect(subject.transaction).not.toBe(null)

  it "search", ->
    subject.search type: 'Patient', query: {name: 'maud'}, success: (x)->
      expect(x.url).toEqual('/BASE/Patient/_search?name=maud')

  it "conformance", ->
    subject.conformance success: (x)->
      expect(x.url).toEqual('/BASE/metadata')

  it "profile", ->
    subject.profile type: 'Patient',success: (x)->
      expect(x.url).toEqual('/BASE/Profile/Patient')


  it "transaction", ->
    subject.transaction bundle: 'bundle',success: (x)->
      expect(x.url).toEqual('/BASE')
      expect(x.method).toEqual('POST')


  it "read", ->
    subject.read type: 'Patient', id :'123',success: (x)->
      expect(x.url).toEqual('/BASE/Patient/123')

