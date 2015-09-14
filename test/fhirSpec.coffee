fhir = require('../src/fhir')

describe "fhir", ->
  cfg = {baseUrl: 'BASE', }
  adapter =  {http: ((x)-> {then: (f)-> f(x)})}
  subject = fhir(cfg, adapter)

  it "api", ()->
    expect(subject.search).not.toBe(null)
    expect(subject.profile).not.toBe(null)
    expect(subject.transaction).not.toBe(null)

  it "search", ->
    subject.search(type: 'Patient', query: {name: 'maud'}).then (x)->
      expect(x.url).toEqual('BASE/Patient?name=maud')

  it "conformance", ->
    subject.conformance({}).then (x)->
      expect(x.url).toEqual('BASE/metadata')

  it "profile", ->
    subject.profile(type: 'Patient').then (x)->
      expect(x.url).toEqual('BASE/Profile/Patient')


  it "transaction", ->
    subject.transaction(bundle: {a: 1}).then (x)->
      expect(x.url).toEqual('BASE')
      expect(x.method).toEqual('POST')
      expect(x.data).toEqual('{"a":1}')


  it "read", ->
    subject.read(type: 'Patient', id :'123').then (x)->
      expect(x.url).toEqual('BASE/Patient/123')
