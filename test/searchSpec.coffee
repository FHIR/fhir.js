fhir = require('../src/fhir')
patientBundle = require('../fixtures/patientBundle.js')
bpBundle = require('../fixtures/bpBundle')

assert = require('assert')

nop = ()->
cfg = {baseUrl: 'BASE'}
res = true
adapter =  {defer: require('../src/testUtils').defer}
subject = fhir(cfg, adapter)

describe "search:", ->
  it "search success", (done)->
    http = (q)->
      assert.deepEqual(q.method, 'GET')
      assert.deepEqual(q.url, 'BASE/Patient?name=maud')
      done()

    subject.search(http: http, type: 'Patient', query: {name: 'maud'})

  it "search error", (done)->
    http = (q)-> done()
    subject.search(http: http, type: 'Patient', query: {name: 'maud'})

  it "fetch prev page when previous relation is 'previous'", (done)->
    http = (q)->
      assert.deepEqual(q.method, 'GET')
      assert.deepEqual(q.url, 'BASE/Patient?_count=1&_skip=1')
      done()

    subject.prevPage(http: http, bundle: patientBundle)

  it "fetch prev page when previous relation is 'prev'", (done)->
    http = (q)->
      assert.deepEqual(q.method, 'GET')
      assert.deepEqual(q.url, 'BASE/Observation?name=55284-4&_include=Observation.related.target&_count=1&_skip=1')
      done()

    subject.prevPage(http: http, bundle: bpBundle)

  it "fetch next page suceeds", (done)->
    http = (q)->
      assert.deepEqual(q.method, 'GET')
      assert.deepEqual(q.url, 'BASE/Patient?_count=1&_skip=1')
      done()

    subject.nextPage(http: http, bundle: patientBundle)

  it "fetch bundle using url", (done)->
    http = (q)->
      assert.deepEqual(q.method, 'GET')
      assert.deepEqual(q.url, 'BASE/Patient?_count=1&_skip=1')
      done()

    subject.getBundleByUrl(http: http, url: 'BASE/Patient?_count=1&_skip=1')

