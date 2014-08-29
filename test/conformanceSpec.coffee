f = require('../coffee/conformance.coffee')
a = require('../coffee/adapter.coffee')
c = require('../coffee/configuration.coffee')

describe 'conformance', ->
  c.fhir.base = 'BASE'

  it 'simple', (done)->
    a.adapter.xhr = (method, url, cb)->
      expect(method).toBe('GET')
      expect(url).toBe('BASE/metadata')
      cb('ok')

    f.conformance (data)->
      expect(data).toBe('ok')
      done()

describe 'profile', ->

  it 'simple', (done)->
    a.adapter.xhr = (method, url, cb)->
      expect(method).toBe('GET')
      expect(url).toBe('BASE/Profile/Alert')
      cb('ok')

    f.profile 'Alert', (data)->
      expect(data).toBe('ok')
      done()