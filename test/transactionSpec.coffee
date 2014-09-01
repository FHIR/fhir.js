trans = require('../coffee/transaction.coffee')

nop = (x)-> x
bundle = 'bundle'

describe 'transaction', ->
  it 'success', (done)->
    http = (q)->
      expect(q.method).toBe('POST')
      expect(q.url).toBe('BASE')
      expect(q.data).toBe(bundle)
      q.success('ok')

    trans 'BASE', http,  bundle, (data)->
      expect(data).toBe('ok')
      done()

  it 'error', (done)->
    http = (q)-> q.error('ok')

    trans 'BASE', http, bundle, nop, (data)->
      expect(data).toBe('ok')
      done()
