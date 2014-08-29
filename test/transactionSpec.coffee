f = require('../coffee/transaction.coffee')
a = require('../coffee/adapter.coffee')
conf = require('../coffee/configuration.coffee')

conf.configure
  baseUrl: 'BASE'

nop = (x)-> x
bundle = 'bundle'

describe 'transaction', ->
  it 'success', (done)->
    a.setAdapter
      http: (q)->
        expect(q.method).toBe('POST')
        expect(q.url).toBe('BASE')
        expect(q.data).toBe(bundle)
        q.success('ok')

    f.transaction bundle, (data)->
      expect(data).toBe('ok')
      done()

  it 'error', (done)->
    a.setAdapter
      http: (q)->
        q.error('ok')

    f.transaction bundle, nop, (data)->
      expect(data).toBe('ok')
      done()