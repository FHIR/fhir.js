fhir = require('../coffee/fhir.js')
instance = new fhir()

f = instance._.transaction
a = instance._.adapter
conf = instance.config

conf.set
  baseUrl: 'BASE'

nop = (x)-> x
bundle = 'bundle'

describe 'transaction', ->
  it 'success', (done)->
    a.set
      http: (q)->
        expect(q.method).toBe('POST')
        expect(q.url).toBe('BASE')
        expect(q.data).toBe(bundle)
        q.success('ok')

    f.transaction bundle, (data)->
      expect(data).toBe('ok')
      done()

  it 'error', (done)->
    a.set
      http: (q)->
        q.error('ok')

    f.transaction bundle, nop, (data)->
      expect(data).toBe('ok')
      done()
