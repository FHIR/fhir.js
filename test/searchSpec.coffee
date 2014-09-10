subject = require('../src/search.coffee')
patientBundle = require('../fixtures/patientBundle.js')

nop = ()->

describe "search:", ->
  it "search success", (done)->
    http = (q)->
      expect(q.method).toBe('GET')
      expect(q.url).toBe('BASE/Patient/_search?name=maud')
      done()

    subject.search
      baseUrl: 'BASE'
      http: http
      type: 'Patient'
      query: {name: 'maud'}
      success: nop
      error: nop

  it "search error", (done)->
    err = (e)->
      expect(e).toBe('error')
      done()

    http = (q)-> q.error('error')

    subject.search(baseUrl: 'BASE',http: http, type: 'Patient', query: {name: 'maud'}, success: nop, error: err)

  it "fetch prev page fails when no link is available", (done)->
    err = (msg)-> done()
    subject.prev(baseUrl: 'BASE', http: nop, bundle: patientBundle, success: nop, error: err)

  it "fetch next page suceeds", (done)->
    http = (q)->
      expect(q.method).toBe('GET')
      expect(q.url).toBe('BASE/Patient?_count=1&_skip=1')
      console.log('finishing')
      done()

    subject.next(baseUrl: 'BASE', http: http, bundle: patientBundle, success: nop, error: (e)->console.log("ERR",e))
