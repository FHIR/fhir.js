fhir = require('../src/fhir')
assert = require('assert')


nop = ()->

tags = [{term: 'term', scheme: 'sch', label: 'lbl'}]

mockHeaders = (hs)->
  (nm)-> hs[nm]

cfg = {baseUrl: 'BASE'}
res = true
res = fhir(cfg, {defer: require('../src/testUtils').defer})

describe "search:", ->
  it "api", ->
    assert.notEqual(res.create, null)
    assert.notEqual(res.read, null)
    assert.notEqual(res.vread, null)
    assert.notEqual(res.update, null)
    assert.notEqual(res.delete, null)

  headers = mockHeaders
    'Content-Location': 'BASE/Patient/5'

  it "create", (done)->
    resource = {resourceType: 'Patient', meta: {tags: tags}}
    http = (req)->
      assert.deepEqual(req.data, JSON.stringify(resource))
      assert.deepEqual(req.method, 'POST')
      assert.deepEqual(req.url, 'BASE/Patient')
      assert.deepEqual(req.data, JSON.stringify(resource))
      done()
    res.create(http: http, resource: resource)

  simpleRead = (tp, id, done) ->
    resource = {id: '5', resourceType: 'Patient', meta: {tags: tags}}
    http = (req)->
      assert.deepEqual(req.method, 'GET')
      assert.deepEqual(req.url, 'BASE/Patient/5')
      done()

    res.read(http: http, type: tp, id: id)

  it "read", (done)->
    simpleRead('Patient','5', done)

  it "update", (done)->
    resource = {id: '5', resourceType: 'Patient'}
    http = (req)->
      assert.deepEqual(req.method, 'PUT')
      assert.deepEqual(req.url, 'BASE/Patient/5')
      assert.deepEqual(req.data, JSON.stringify(resource))
      done()

    res.update(http: http, type: 'Patient', resource: resource)

  it "delete", (done)->
    resource = {id: '5', resourceType: 'Patient'}
    http = (q)->
      assert.deepEqual(q.method, 'DELETE')
      assert.deepEqual(q.url, 'BASE/Patient/5')
      done()
    res.delete(http: http, resource: resource)
