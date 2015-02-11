res = require('../src/resource.coffee')

nop = ()->

tags = [{term: 'term', scheme: 'sch', label: 'lbl'}]

mockHeaders = (hs)->
  (nm)-> hs[nm]

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
    # http = (x)-> x.success(x, 201, headers, x)
    http = (x)-> x.success(resource, 200, headers, x)
    resource = {resourceType: 'Patient', meta: {tags: tags}}
    res.create
      baseUrl: 'BASE'
      http: http
      resource: resource
      success: (data, q)->
        expect(data).toBe(resource)
        expect(q.method).toBe('POST')
        expect(q.url).toBe('BASE/Patient')
        expect(q.data).toBe(JSON.stringify(resource))
        done()

  simpleRead = (tp, id, done) ->
    resource = {id: '5', resourceType: 'Patient', meta: {tags: tags}}
    http = (x)-> x.success(resource, 200, headers, x)

    res.read
      baseUrl: 'BASE'
      http: http
      resourceType: tp
      id: id
      success: (res, q)->
        expect(res).not.toBe(null)
        expect(res.id).toBe('5')
        expect(res.meta.tags).toEqual(tags)
        expect(q.method).toBe('GET')
        expect(q.url).toBe('BASE/Patient/5')
        done()

  it "read", (done)->
    simpleRead('Patient','5', done)

  it "update", (done)->
    resource = {id: '5', resourceType: 'Patient'}
    http = (x)-> x.success(resource, 200, headers, x)

    res.update
      baseUrl: 'BASE'
      http: http
      resource: resource
      success: (data, q)->
        expect(data).toBe(resource)
        expect(q.method).toBe('PUT')
        expect(q.url).toBe('BASE/Patient/5')

        done()

  it "delete", (done)->
    resource = {id: '5', resourceType: 'Patient'}
    http = (x)-> x.success(resource, 204, headers, x)
    res.delete
      baseUrl: 'BASE'
      http: http
      resource: resource
      success: (res, q)->
        expect(q.method).toBe('DELETE')
        expect(q.url).toBe('BASE/Patient/5')
        done()
