fhir = require('../src/fhir')

nop = (x)-> x

cfg = {baseUrl: 'BASE'}
res = true
adapter =  {http: ((x)-> x.success && x.success(x))}
subject = fhir(cfg, adapter)

describe 'conformance', ->

  it 'success', (done)->
    http = (q)->
      expect(q.method).toBe('GET')
      expect(q.url).toBe('/BASE/metadata')
      q.success('ok')

    subject.conformance
      baseUrl: '/BASE'
      http: http
      success: (data)->
        expect(data).toBe('ok')
        done()

  it 'error', (done)->
    http = (q)-> q.error('ok')

    subject.conformance
      baseUrl: '/BASE'
      http: http
      success: nop
      error: (data)->
        expect(data).toBe('ok')
        done()

describe 'profile', ->
  it 'success', (done)->
    http = (q)->
      expect(q.method).toBe('GET')
      expect(q.url).toBe('/BASE/Profile/Alert')
      q.success('ok')

    subject.profile
      baseUrl: '/BASE'
      http: http
      type: 'Alert'
      success: (data)->
        expect(data).toBe('ok')
        done()
  it 'error', (done)->
    http = (q)-> q.error('ok')

    subject.profile
      baseUrl: '/BASE'
      http: http
      type: 'Alert'
      success: nop
      error: (data)->
        expect(data).toBe('ok')
        done()
