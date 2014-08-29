fhir = require('../coffee/fhir.js')
instance = new fhir()
conf = instance.config

a = instance._.adapter

conf.set
  baseUrl: 'BASE'

nop = ()->

describe "search:", ->
  subject = instance._.search

  it "api", ->
    expect(subject.search).not.toBe(null)

  it "search success", (done)->
    a.set
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

    a.set
      http: (q)-> q.error('error')

    subject.search('Patient', {name: 'maud'}, nop, err)
