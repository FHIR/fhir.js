fhir = require('../src/fhir')
assert = require('assert')

nop = (x)-> x

cfg = {baseUrl: 'BASE'}
res = true
adapter =  {http: ((x)-> x.then = ((f)-> f(x)))}

subject = fhir(cfg, adapter)

describe 'conformance', ->

  it 'success', (done)->
    http = (q)->
      assert.equal(q.method, 'GET')
      assert.equal(q.url, 'BASE/metadata')
      done()

    subject.conformance(http: http)

describe 'profile', ->
  it 'success', (done)->
    http = (q)->
      assert.equal(q.method, 'GET')
      assert.equal(q.url,'BASE/Profile/Alert')
      done()

    subject.profile(http: http, type: 'Alert')
