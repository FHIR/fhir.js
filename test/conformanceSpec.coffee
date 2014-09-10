conf = require('../src/conformance.coffee')

nop = (x)-> x

describe 'conformance', ->
  it 'success', (done)->
    http = (q)->
      expect(q.method).toBe('GET')
      expect(q.url).toBe('BASE/metadata')
      q.success('ok')

    conf.conformance
      baseUrl: 'BASE'
      http: http
      success: (data)->
        expect(data).toBe('ok')
        done()

  it 'error', (done)->
    http = (q)-> q.error('ok')

    conf.conformance
      baseUrl: 'BASE'
      http: http
      success: nop
      error: (data)->
        expect(data).toBe('ok')
        done()

describe 'profile', ->
  it 'success', (done)->
    http = (q)->
      expect(q.method).toBe('GET')
      expect(q.url).toBe('BASE/Profile/Alert')
      q.success('ok')

    conf.profile
      baseUrl: 'BASE'
      http: http
      type: 'Alert'
      success: (data)->
        expect(data).toBe('ok')
        done()
  it 'error', (done)->
    http = (q)-> q.error('ok')

    conf.profile
      baseUrl: 'BASE'
      http: http
      type: 'Alert'
      success: nop
      error: (data)->
        expect(data).toBe('ok')
        done()
