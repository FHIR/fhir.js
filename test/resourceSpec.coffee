fhir = require('../src/fhir')

nop = ()->

tags = [{term: 'term', scheme: 'sch', label: 'lbl'}]

mockHeaders = (hs)->
  (nm)-> hs[nm]

cfg = {baseUrl: 'BASE'}
res = true
res = fhir(cfg, {})

describe "search:", ->
  it "api", ->
    expect(res.create).not.toBe(null)
    expect(res.read).not.toBe(null)
    expect(res.vread).not.toBe(null)
    expect(res.update).not.toBe(null)
    expect(res.delete).not.toBe(null)

  headers = mockHeaders
    'Content-Location': 'BASE/Patient/5'

  it "create", (done)->
    resource = {resourceType: 'Patient', meta: {tags: tags}}
    http = (req)->
      expect(req.data).toEqual(JSON.stringify(resource))
      expect(req.method).toBe('POST')
      expect(req.url).toBe('BASE/Patient')
      expect(req.data).toBe(JSON.stringify(resource))
      done()
    res.create(http: http, resource: resource)

  simpleRead = (tp, id, done) ->
    resource = {id: '5', resourceType: 'Patient', meta: {tags: tags}}
    http = (req)->
      expect(req.method).toBe('GET')
      expect(req.url).toBe('BASE/Patient/5')
      done()

    res.read(http: http, type: tp, id: id)

  it "read", (done)->
    simpleRead('Patient','5', done)

  it "update", (done)->
    resource = {id: '5', resourceType: 'Patient'}
    http = (req)->
      expect(req.method).toBe('PUT')
      expect(req.url).toBe('BASE/Patient/5')
      expect(req.data).toEqual(JSON.stringify(resource))
      done()

    res.update(http: http, type: 'Patient', resource: resource)

  it "delete", (done)->
    resource = {id: '5', resourceType: 'Patient'}
    http = (q)->
      expect(q.method).toBe('DELETE')
      expect(q.url).toBe('BASE/Patient/5')
      done()
    res.delete(http: http, resource: resource)
