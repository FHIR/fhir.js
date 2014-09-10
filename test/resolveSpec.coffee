subject = require('../src/resolve.coffee')
rx = require('../fixtures/medicationPrescription.js')

bpBundle = require('../fixtures/bpBundle.js')
bp = bpBundle.entry[0]

systolicRef = bp.content.related[0].target
diastolicRef = bp.content.related[1].target

systolic = bpBundle.entry[1]
diastolic = require('../fixtures/diastolic.js')

nop = ()->

cache = {}

describe "resolve synchronous", ->
  http = nop

  it "resolves a missing contained resource as null", ->
    resolved = subject.sync('BASE', http, cache, {reference: "#no-such-thing"}, rx, null)
    expect(resolved).toEqual(null)

  it "resolves a contained resource", ->
    resolved = subject.sync('BASE', http, cache, rx.medication, rx, null)
    expect(resolved).toEqual(rx.contained[0])

  it "resolves a missing bundled resource as null", ->
    resolved = subject.sync('BASE', http, cache, {reference: "no-such-thing"}, null, bpBundle)
    expect(resolved).toEqual(null)

  it "resolves a co-bundled resource", ->
    resolved = subject.sync('BASE', http, cache, systolicRef, null, bpBundle)
    expect(resolved).toEqual(systolic)

  it "resolves a cached resource", ->
    resolved = subject.sync(
      'BASE',
      http,
      {'BASE/Observation/9573':diastolic},
      diastolicRef,
      null,
      null)
    expect(resolved).toEqual(diastolic)

describe "resolve async", ->

  it "resolves a missing contained resource as null", (done)->
    http = (q)-> (throw "should not be called")
    err = (e)-> done()
    subject.async('BASE', http, cache, {reference: "#no-such-thing"}, rx, null, null, err)

  it "resolves a contained resource", (done)->
    http = (q)->(throw "should not be called")
    cb = (r)->
      expect(r).toEqual(rx.contained[0])
      done()
    subject.async('BASE', http, cache, rx.medication, rx, null, cb, null)

  it "resolves a co-bundled resource", (done)->
    http = (q)->(throw "should not be called")
    cb = (r)->
      expect(r).toEqual(systolic)
      done()
    subject.async('BASE', http, cache, systolicRef, null, bpBundle, cb, null)

  it "resolves a non-local resource via HTTP", (done)->

    http = (q)->
      expect(q.method).toBe('GET')
      expect(q.url).toBe('BASE/Observation/9573')
      done()

    subject.async( 'BASE', http, null, diastolicRef, null, null, null, null)
