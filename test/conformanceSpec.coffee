fhir = require('../src/fhir')

nop = (x)-> x

cfg = {baseUrl: 'BASE'}
res = true
adapter =  {http: ((x)-> x.then = ((f)-> f(x)))}

subject = fhir(cfg, adapter)

describe 'conformance', ->

  it 'success', (done)->
    http = (q)->
      expect(q.method).toBe('GET')
      expect(q.url).toBe('BASE/metadata')
      done()

    subject.conformance(http: http)

describe 'profile', ->
  it 'success', (done)->
    http = (q)->
      expect(q.method).toBe('GET')
      expect(q.url).toBe('BASE/Profile/Alert')
      done()

    subject.profile(http: http, type: 'Alert')
