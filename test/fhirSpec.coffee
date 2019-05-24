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
    assert.notEqual(subject.patch, null)

  it "search", ->
    subject.search(type: 'Patient', query: {name: 'maud'}).then (x)->
      assert.equal(x.url, 'BASE/Patient?name=maud')

  it "conditionalUpdate", ->
    subject.conditionalUpdate(type: 'Patient', query: {name: 'maud'}).then (x)->
      assert.equal(x.url, 'BASE/Patient?name=maud')
      assert.equal(x.method, 'PUT')

  it "conditionalDelete", ->
    subject.conditionalDelete(type: 'Observation', query: {_id: 10}).then (x)->
      assert.equal(x.url, 'BASE/Observation?_id=10')
      assert.equal(x.method, 'DELETE')

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

  it "patch", ->
    subject.patch(type: 'CommunicationRequest', id :'123', data: [ { op: 'replace', path: '/status', value: 'cancelled' } ]).then (x)->
      assert.equal(x.url, 'BASE/CommunicationRequest/123')
      assert.equal(x.method, 'PATCH')
      assert.equal(x.data, '[{"op":"replace","path":"/status","value":"cancelled"}]')
