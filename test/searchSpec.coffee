fhir = require('../src/fhir')
patientBundle = require('../fixtures/patientBundle.js')

nop = ()->
cfg = {baseUrl: 'BASE'}
res = true
adapter =  {defer: require('q').defer}
subject = fhir(cfg, adapter)

describe "search:", ->
  it "search success", (done)->
    http = (q)->
      expect(q.method).toBe('GET')
      expect(q.url).toBe('BASE/Patient/_search?name=maud')
      done()

    subject.search(http: http, type: 'Patient', query: {name: 'maud'})

  it "search error", (done)->
    http = (q)-> done()
    subject.search(http: http, type: 'Patient', query: {name: 'maud'})

  it "fetch prev page fails when no link is available", (done)->
    err = (msg)-> done()
    subject.prevPage( http: nop, bundle: patientBundle).then(nop, done)

  it "fetch next page suceeds", (done)->
    http = (q)->
      expect(q.method).toBe('GET')
      expect(q.url).toBe('BASE/Patient?_count=1&_skip=1')
      done()

    subject.nextPage(http: http, bundle: patientBundle)
