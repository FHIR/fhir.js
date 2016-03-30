fhir = require('../src/fhir')
assert = require('assert')

describe "fhir", ->
  cfg = {baseUrl: 'BASE', }
  adapter =  {http: ((x)-> {then: (f)-> f(x)})}
  subject = fhir(cfg, adapter)

  it "api", ()->
    assert.notEqual(subject.search, null)
    assert.notEqual(subject.profile, null)
    assert.notEqual(subject.transaction, null)

  it "search", ->
    subject.search(type: 'Patient', query: {name: 'maud'}).then (x)->
      assert.equal(x.url, 'BASE/Patient?name=maud')

  it "conformance", ->
    subject.conformance({}).then (x)->
      assert.equal(x.url, 'BASE/metadata')

  it "profile", ->
    subject.profile(type: 'Patient').then (x)->
      assert.equal(x.url,'BASE/Profile/Patient')


  it "transaction", ->
    subject.transaction(bundle: {a: 1}).then (x)->
      assert.equal(x.url, 'BASE')
      assert.equal(x.method, 'POST')
      assert.equal(x.data, '{"a":1}')

  it "read", ->
    subject.read(type: 'Patient', id :'123').then (x)->
      assert.equal(x.url, 'BASE/Patient/123')
