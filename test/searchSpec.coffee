fhir = require('../src/fhir')
patientBundle = require('../fixtures/patientBundle.js')

nop = ()->
cfg = {baseUrl: 'BASE'}
res = true
adapter =  {http: ((x)-> x.success && x.success(x))}
subject = fhir(cfg, adapter)

describe "search:", ->
  it "search success", (done)->
    http = (q)->
      expect(q.method).toBe('GET')
      expect(q.url).toBe('BASE/Patient/_search?name=maud')
      done()

    subject.search
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

    subject.search(http: http, type: 'Patient', query: {name: 'maud'}, success: nop, error: err)

  it "fetch prev page fails when no link is available", (done)->
    err = (msg)-> done()
    subject.prevPage( http: nop, bundle: patientBundle, success: nop, error: err)

  it "fetch next page suceeds", (done)->
    http = (q)->
      expect(q.method).toBe('GET')
      expect(q.url).toBe('BASE/Patient?_count=1&_skip=1')
      console.log('finishing')
      done()

    subject.nextPage(http: http, bundle: patientBundle, success: nop, error: (e)->console.log("ERR",e))
