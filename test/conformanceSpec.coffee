f = require('../coffee/conformance.coffee')
a = require('../coffee/adapter.coffee')
conf = require('../coffee/configuration.coffee')

conf.configure
  baseUrl: 'BASE'

nop = (x)-> x

describe 'conformance', ->
  it 'success', (done)->
    a.setAdapter
      http: (q)->
        expect(q.method).toBe('GET')
        expect(q.url).toBe('BASE/metadata')
        q.success('ok')

    f.conformance (data)->
      expect(data).toBe('ok')
      done()

  it 'error', (done)->
    a.setAdapter
      http: (q)->
        q.error('ok')

    f.conformance nop, (data)->
      expect(data).toBe('ok')
      done()

describe 'profile', ->

  it 'success', (done)->
    a.setAdapter
      http: (q)->
        expect(q.method).toBe('GET')
        expect(q.url).toBe('BASE/Profile/Alert')
        q.success('ok')

    f.profile 'Alert', (data)->
      expect(data).toBe('ok')
      done()
  it 'error', (done)->
    a.setAdapter
      http: (q)->
        q.error('ok')

    f.profile 'Alert', nop, (data)->
      expect(data).toBe('ok')
      done()
