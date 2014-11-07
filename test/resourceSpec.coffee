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
    'Category': 'term; scheme="sch"; label="lbl"'

  it "create", (done)->
    http = (x)-> x.success(x.content, 201, headers, x)
    entry = {content: {resourceType: 'Patient'}, category: tags}
    res.create
      baseUrl: 'BASE'
      http: http
      entry: entry
      success: (res, q)->
        expect(res).not.toBe(null)
        expect(res.id).toBe('BASE/Patient/5')
        expect(res.category).toEqual(tags)

        expect(q.method).toBe('POST')
        expect(q.url).toBe('BASE/Patient')
        expect(q.data).toBe(JSON.stringify(entry.content))
        expect(q.headers['Category']).toBe('term; scheme="sch"; label="lbl"')
        done()

  simpleRead = (id, done) ->
    entry = {content: {resourceType: 'Patient'}, category: tags}
    http = (x)-> x.success(entry.content, 200, headers, x)

    res.read
      baseUrl: 'BASE'
      http: http
      id: id
      success: (res, q)->
        expect(res).not.toBe(null)
        expect(res.id).toBe('BASE/Patient/5')
        expect(res.category).toEqual(tags)
        expect(q.method).toBe('GET')
        expect(q.url).toBe('BASE/Patient/5')
        done()

  it "read", (done)->
    simpleRead('BASE/Patient/5', done)

  it "read relative", (done)->
    simpleRead('Patient/5', done)

  it "update", (done)->
    entry = {id: 'BASE/Patient/5', content: {resourceType: 'Patient'}, category: tags}
    http = (x)-> x.success(entry.content, 200, headers, x)

    res.update
      baseUrl: 'BASE'
      http: http
      entry: entry
      success: (res, q)->
        expect(res).not.toBe(null)
        expect(res.id).toBe('BASE/Patient/5')
        expect(res.category).toEqual(tags)
        expect(q.method).toBe('PUT')
        expect(q.url).toBe('BASE/Patient/5')

        done()

  it "delete", (done)->
    entry = {id: 'BASE/Patient/5', content: {resourceType: 'Patient'}, category: tags}
    http = (x)-> x.success(entry.content, 204, headers, x)

    res.delete
      baseUrl: 'BASE'
      http: http
      entry: entry
      success: (res, q)->
        expect(res).not.toBe(null)
        expect(res.id).toBe('BASE/Patient/5')
        expect(res.category).toEqual(tags)

        expect(q.method).toBe('DELETE')
        expect(q.url).toBe('BASE/Patient/5')

        done()
