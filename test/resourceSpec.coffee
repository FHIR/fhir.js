res = require('../coffee/resource.coffee')

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
  http = (x)-> x.success(x.content, 201, headers, x)

  it "create in", (done)->
    entry = {content: {resourceType: 'Patient'}, category: tags}
    res.create 'BASE', http, entry, (res, q)->
      expect(res).not.toBe(null)
      expect(res.id).toBe('BASE/Patient/5')
      expect(res.category).toEqual(tags)

      expect(q.method).toBe('POST')
      expect(q.url).toBe('BASE/Patient')
      expect(q.data).toBe(entry.content)
      expect(q.headers['Category']).toBe('term; scheme="sch"; label="lbl"')

      done()
