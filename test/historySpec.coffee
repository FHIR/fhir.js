fhir = require('../src/fhir')

nop = (x)-> x

cfg = {baseUrl: 'BASE'}
res = true
subject = fhir(cfg, {})

describe 'history', ->
  it 'success', (done)->
    http = (q)->
      expect(q.method).toBe('GET')
      expect(q.url).toBe('BASE/Alert/test-id/_history')
      expect(q.params._count).toBe(10)
      expect(q.params._since).toBe('2000-01-01')
      done()

    subject.resourceHistory
      http: http
      type: 'Alert'
      id: 'test-id'
      count: 10
      since: '2000-01-01'


describe 'historyType', ->
  it 'success', (done)->
    http = (q)->
      expect(q.method).toBe('GET')
      expect(q.url).toBe('BASE/Alert/_history')
      done()

    subject.typeHistory(http: http, type:'Alert')

describe 'historyAll', ->
  it 'success', (done)->
    http = (q)->
      expect(q.method).toBe('GET')
      expect(q.url).toBe('BASE/_history')
      done()

    subject.history(http: http)
