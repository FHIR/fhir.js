fhir = require('../src/fhir')

nop = (x)-> x
bundle = {a: 1}

cfg = {baseUrl: 'BASE'}
res = true
subject = fhir(cfg, {})
trans = subject.transaction

describe 'transaction', ->
  it 'success', (done)->
    http = (q)-> q.success('ok', null, null, q)

    trans
      baseUrl: 'BASE'
      http: http
      bundle: {a: 1},
      success: (data, status, headers, q)->
        expect(q.method).toBe('POST')
        expect(q.url).toBe('BASE')
        expect(q.data).toEqual('{"a":1}')
        expect(data).toBe('ok')
        done()
