fhir = require('../src/fhir')

nop = (x)-> x
bundle = {a: 1}

cfg = {baseUrl: 'BASE'}
res = true
subject = fhir(cfg, {})
trans = subject.transaction

describe 'transaction', ->
  it 'success', (done)->
    http = (q)->
      expect(q.method).toBe('POST')
      expect(q.url).toBe('BASE')
      expect(q.data).toEqual('{"a":1}')
      done()

    trans(http: http, bundle: {a: 1})
