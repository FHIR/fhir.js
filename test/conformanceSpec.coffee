fhir = require('../coffee/fhir.js')

instance = new fhir()
f = instance._.conformance
a = instance._.adapter

instance.config.set
  baseUrl: 'BASE'

nop = (x)-> x

describe 'conformance', ->
  it 'success', (done)->
    console.log "gonna set an adapter", a.get()

    a.set http: (q)->
      expect(q.method).toBe('GET')
      expect(q.url).toBe('BASE/metadata')
      q.success('ok')

    f.conformance (data)->
      expect(data).toBe('ok')
      done()

  it 'error', (done)->
    a.set
      http: (q)->
        q.error('ok')

    f.conformance nop, (data)->
      expect(data).toBe('ok')
      done()

describe 'profile', ->

  it 'success', (done)->
    a.set
      http: (q)->
        expect(q.method).toBe('GET')
        expect(q.url).toBe('BASE/Profile/Alert')
        q.success('ok')

    f.profile 'Alert', (data)->
      expect(data).toBe('ok')
      done()
  it 'error', (done)->
    a.set
      http: (q)->
        q.error('ok')

    f.profile 'Alert', nop, (data)->
      expect(data).toBe('ok')
      done()
