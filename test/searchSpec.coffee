fhir = require('../src/fhir')
patientBundle = require('../fixtures/patientBundle.js')

nop = ()->
cfg = {baseUrl: 'BASE'}
res = true
adapter =  {defer: require('../src/testUtils').defer}
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

  # TODO this does not work
  # some promblems with jasmine
  it "fetch prev page fails when no link is available", (done)->
    subject.prevPage( http: nop, bundle: patientBundle)
    done()

  it "fetch next page suceeds", (done)->
    http = (q)->
      expect(q.method).toBe('GET')
      expect(q.url).toBe('BASE/Patient?_count=1&_skip=1')
      done()

    subject.nextPage(http: http, bundle: patientBundle)
