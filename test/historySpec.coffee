h = require('../coffee/history.coffee')

nop = (x)-> x

describe 'history', ->
  it 'success', (done)->
    http = (q)->
      expect(q.method).toBe('GET')
      expect(q.url).toBe('BASE/Alert/test-id/_history')
      q.success('ok')

    h.history 'BASE', http, 'Alert', 'test-id', (data) ->
      expect(data).toBe('ok')
      done()
    , nop

  it 'error', (done)->
    http = (q)-> q.error('ok')

    h.history 'BASE', http, 'Alert', 'test-id', nop, (data)->
      expect(data).toBe('ok')
      done()


describe 'historyType', ->
  it 'success', (done)->
    http = (q)->
      expect(q.method).toBe('GET')
      expect(q.url).toBe('BASE/Alert/_history')
      q.success('ok')

    h.history 'BASE', http, 'Alert', (data) ->
      expect(data).toBe('ok')
      done()
    , nop

  it 'error', (done)->
    http = (q)-> q.error('ok')

    h.history 'BASE', http, 'Alert', nop, (data)->
      expect(data).toBe('ok')
      done()

describe 'historyAll', ->
  it 'success', (done)->
    http = (q)->
      expect(q.method).toBe('GET')
      expect(q.url).toBe('BASE/_history')
      q.success('ok')

    h.history 'BASE', http, (data) ->
      expect(data).toBe('ok')
      done()
    , nop

  it 'error', (done)->
    http = (q)-> q.error('ok')

    h.history 'BASE', http, nop, (data)->
      expect(data).toBe('ok')
      done()