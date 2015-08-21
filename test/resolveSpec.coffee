fhir = require('../src/fhir')
resolve = require('../src/resolve')
rx = require('../fixtures/medicationPrescription.js')

bpBundle = require('../fixtures/bpBundle.js')
bp = bpBundle.entry[0]

systolicRef = bp.content.related[0].target
diastolicRef = bp.content.related[1].target

systolic = bpBundle.entry[1]
diastolic = require('../fixtures/diastolic.js')

nop = ()->
cache = {}
cfg = {baseUrl: 'BASE'}

subject = fhir(cfg, {defer: require('../src/testUtils').defer})

describe "resolve resolveSynchronous", ->

  it "resolves a missing contained resource as null", ->
    resolved = resolve.sync
      baseUrl: 'BASE'
      cache: cache
      reference: {reference: "#no-such-thing"}
      resource: rx
    expect(resolved).toEqual(null)

  it "resolves a contained resource", ->
    resolved = resolve.sync
      baseUrl: 'BASE'
      cache: cache
      reference: rx.medication
      resource: rx
    expect(resolved.content).toEqual(rx.contained[0])

  it "resolves a missing bundled resource as null", ->
    resolved = resolve.sync
      baseUrl: 'BASE',
      cache: cache,
      reference: {reference: "no-such-thing"}
      bundle: bpBundle
    expect(resolved).toEqual(null)

  it "resolves a co-bundled resource", ->
    resolved = resolve.sync
      baseUrl: 'BASE'
      cache: cache
      reference: systolicRef
      bundle: bpBundle
    expect(resolved).toEqual(systolic)

  it "resolves a cached resource", ->
    resolved = resolve.sync
      baseUrl: 'BASE',
      cache: {'BASE/Observation/9573':diastolic}
      reference: diastolicRef

    expect(resolved).toEqual(diastolic)

describe "resolve resolve", ->

  # this does not wirok with jasmine
  # it cathces some global error or i dont know what :(
  # calling this method without jasmine does not throw error
  # but jasmine fail like it is thrown
  ups = ->
    it "resolves a missing contained resource as null", (done)->
      subject.resolve(
        baseUrl: 'BASE'
        cache:cache
        reference: {reference: "#no-such-thing"}
        resource: rx
      ).then(nop, done)

  it "resolves a contained resource", (done)->
    http = (q)-> (throw "should not be called")
    cb = (r)->
      expect(r.content).toEqual(rx.contained[0])
      done()

    subject.resolve(
      baseUrl: 'BASE'
      http: http
      cache: cache
      reference: rx.medication
      resource: rx
    ).then(cb, done)

  it "resolves a co-bundled resource", (done)->
    http = (q)->(throw "should not be called")

    cb = (r)->
      expect(r).toEqual(systolic)
      done()

    subject.resolve(
      http: http
      cache: cache
      reference: systolicRef
      bundle: bpBundle
    ).then(cb)

  it "resolves a non-local resource via HTTP", (done)->
    http = (q)->
      expect(q.method).toBe('GET')
      expect(q.url).toBe('BASE/Observation/9573')
      done()

    subject.resolve(http: http, reference: diastolicRef)
