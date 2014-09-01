subject = require('../coffee/search.coffee')

nop = ()->

describe "search:", ->
  it "search success", (done)->
    http = (q)->
      expect(q.method).toBe('GET')
      expect(q.url).toBe('BASE/Patient/_search?name=maud')
      q.success('bundle')
      done()

    subject('BASE', http, 'Patient', {name: 'maud'}, nop, nop)

  it "search error", (done)->
    err = (e)->
      expect(e).toBe('error')
      done()

    http = (q)-> q.error('error')

    subject('BASE', http, 'Patient', {name: 'maud'}, nop, err)
