a = require('../coffee/adapter.coffee')
conf = require('../coffee/configuration.coffee')
mod = require('../coffee/search.coffee')

conf.configure
  baseUrl: 'BASE'

nop = ()->

describe "search:", ->
  subject = mod

  it "api", ->
    expect(subject.search).not.toBe(null)

  it "search success", (done)->
    a.setAdapter
      http: (q)->
        expect(q.method).toBe('GET')
        expect(q.url).toBe('BASE/Patient/_search?name=maud')
        q.success('bundle')
        done()

    subject.search('Patient', {name: 'maud'}, nop, nop)

  it "search error", (done)->
    err = (e)->
      expect(e).toBe('error')
      done()

    a.setAdapter
      http: (q)-> q.error('error')

    subject.search('Patient', {name: 'maud'}, nop, err)
