fhir = require('../src/fhir')
assert = require('assert')

nop = (x)-> x

cfg = {baseUrl: 'BASE'}
res = true
subject = fhir(cfg, {})

describe 'history', ->
  it 'success', (done)->
    http = (q)->
      assert.equal(q.method, 'GET')
      assert.equal(q.url, 'BASE/Alert/test-id/_history')
      assert.equal(q.params._count, 10)
      assert.equal(q.params._since, '2000-01-01')
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
      assert.equal(q.method, 'GET')
      assert.equal(q.url, 'BASE/Alert/_history')
      done()

    subject.typeHistory(http: http, type:'Alert')

describe 'historyAll', ->
  it 'success', (done)->
    http = (q)->
      assert.equal(q.method, 'GET')
      assert.equal(q.url, 'BASE/_history')
      done()

    subject.history(http: http)
