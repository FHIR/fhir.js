utils = require('../src/utils')
assert = require('assert')

describe "utils", ->
  it "trim", ->
    subject = utils.trim

    assert.deepEqual(subject("a    "), "a")
    assert.deepEqual(subject("       a    "), "a")
    assert.deepEqual(subject("     a"), "a")
    assert.deepEqual(subject(" \n\t    a\n\t"), "a")

  it "utils", ->
    assert.deepEqual(utils.identity(42), 42)

    assert.deepEqual(utils.type(42), 'number')
    assert.deepEqual(utils.type('str'), 'string')
    assert.deepEqual(utils.type([1,2,3]), 'array')
    assert.deepEqual(utils.type({a:1}), 'object')
    assert.deepEqual(utils.type(utils.identity), 'function')

  it "utils", ->
    assert.deepEqual(utils.identity(42), 42)

    assert.deepEqual(utils.type(42), 'number')
    assert.deepEqual(utils.type('str'), 'string')
    assert.deepEqual(utils.type([1,2,3]), 'array')
    assert.deepEqual(utils.type({a:1}), 'object')
    assert.deepEqual(utils.type(utils.identity), 'function')

    assert.deepEqual(utils.mergeLists({}, {}), {})
    assert.deepEqual(utils.mergeLists({a:[1,2]}, {a:[3]}), {a:[1,2,3]})

    testArgs = ()->
      utils.argsArray.apply(null, arguments)
    assert.deepEqual(testArgs(1,2,3), [1,2,3])

  it "url utils", ->
    assert.deepEqual(utils.absoluteUrl("BASE", "Patient/123"), "BASE/Patient/123")
    assert.deepEqual(utils.absoluteUrl("BASE", "Patient/123"), "BASE/Patient/123")
    assert.deepEqual(utils.absoluteUrl("BASE", "http://test/Patient/123"), "http://test/Patient/123")

    assert.deepEqual(utils.relativeUrl("BASE", "BASE/Patient/123"), "Patient/123")
    assert.deepEqual(utils.relativeUrl("BASE", "Patient/123"), "Patient/123")

  it "resourceIdToUrl", ->
    subj = utils.resourceIdToUrl
    assert.deepEqual(subj("BASE/Patient/123", "BASE", "Patient"), "BASE/Patient/123")

    assert.deepEqual(subj("Patient/123", "BASE", "Patient"), "BASE/Patient/123")

    assert.deepEqual(subj("/Patient/123", "BASE", "Patient"), "BASE/Patient/123")

    assert.deepEqual(subj("123", "BASE", "Patient"), "BASE/Patient/123")

  it "can postwalk walk a JSON structure", ->
    subj = utils.postwalk
    untrue = (v) -> if v == true then false else v
    assert.deepEqual(subj(untrue, {a: [1, 2, true]}).a[2], false)

