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
    assert.notEqual(res.meta.add, null)
    assert.notEqual(res.meta.delete, null)
    assert.notEqual(res.meta.read, null)

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

  it "meta.add", (done)->
    target = { id: '5', type: 'Patient', versionId: 1}
    resource = { resourceType: 'Parameters'}
    http = (q)->
      assert.deepEqual(q.data, JSON.stringify(resource))
      assert.deepEqual(q.method, 'POST')
      assert.deepEqual(q.url, 'BASE/Patient/5/_history/1/$meta-add')
      done()
    res.meta.add(http: http, resource: resource, target: target);

  it "meta.delete", (done)->
    target = { id: '5', resourceType: 'Patient', versionId: 4}
    resource = { resourceType: 'Parameters'}
    http = (q)->
      assert.deepEqual(q.method, 'POST')
      assert.deepEqual(q.url, 'BASE/Patient/5/_history/4/$meta-delete')
      done()
    res.meta.delete(http: http, resource: resource, target: target)

  it "meta.read", (done)->
    target = { id: '5', resourceType: 'Patient', versionId: 2}
    http = (q)->
      assert.deepEqual(q.method, 'GET')
      assert.deepEqual(q.url, 'BASE/Patient/5/_history/2/$meta')
      done()
    res.meta.read(http: http, target: target)
