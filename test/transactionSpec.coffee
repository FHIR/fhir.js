fhir = require('../src/fhir')

nop = (x)-> x
bundle = 'bundle'

cfg = {baseUrl: 'BASE'}
res = true
adapter =  {http: ((x)-> x.success && x.success(x))}
subject = fhir(cfg, adapter)
trans = subject.transaction

describe 'transaction', ->
  it 'success', (done)->
    http = (q)->
      expect(q.method).toBe('POST')
      expect(q.url).toBe('BASE/')
      expect(q.data).toBe(bundle)
      q.success('ok')

    trans
      baseUrl: 'BASE'
      http: http
      bundle: bundle,
      success: (data)->
        expect(data).toBe('ok')
        done()

  it 'error', (done)->
    http = (q)-> q.error('ok')

    trans
      baseUrl: 'BASE'
      http: http
      success: nop
      error: (data)->
        expect(data).toBe('ok')
        done()
