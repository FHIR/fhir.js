conf = require('../coffee/conformance.coffee')

nop = (x)-> x

describe 'conformance', ->
  it 'success', (done)->
    http = (q)->
      expect(q.method).toBe('GET')
      expect(q.url).toBe('BASE/metadata')
      q.success('ok')

    conf.conformance 'BASE', http, (data)->
      expect(data).toBe('ok')
      done()

  it 'error', (done)->
    http = (q)-> q.error('ok')

    conf.conformance 'BASE', http,  nop, (data)->
      expect(data).toBe('ok')
      done()

describe 'profile', ->
  it 'success', (done)->
    http = (q)->
      expect(q.method).toBe('GET')
      expect(q.url).toBe('BASE/Profile/Alert')
      q.success('ok')

    conf.profile 'BASE', http, 'Alert', (data)->
      expect(data).toBe('ok')
      done()
  it 'error', (done)->
    http = (q)-> q.error('ok')

    conf.profile 'BASE', http, 'Alert', nop, (data)->
      expect(data).toBe('ok')
      done()
