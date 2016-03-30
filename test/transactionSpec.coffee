fhir = require('../src/fhir')

assert = require('assert')

nop = (x)-> x
bundle = {a: 1}

cfg = {baseUrl: 'BASE'}
res = true
subject = fhir(cfg, {})
trans = subject.transaction

describe 'transaction', ->
  it 'success', (done)->
    http = (q)->
      assert.deepEqual(q.method, 'POST')
      assert.deepEqual(q.url, 'BASE')
      assert.deepEqual(q.data, '{"a":1}')
      done()

    trans(http: http, bundle: {a: 1})
