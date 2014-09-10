utils = require('../src/utils.coffee')

describe "utils", ->
  it "trim", ->
    subject = utils.trim

    expect(subject("a    ")).toBe("a")
    expect(subject("       a    ")).toBe("a")
    expect(subject("     a")).toBe("a")
    expect(subject(" \n\t    a\n\t")).toBe("a")

  it "tags & headers", ->
    tags = [{term: 'term', scheme: 'sch', label: 'lbl'}]
    header = 'term; scheme="sch"; label="lbl"'

    expect(utils.tagsToHeader(tags)).toEqual(header)
    expect(utils.headerToTags(header)).toEqual(tags)

  it "utils", ->
    expect(utils.identity(42)).toEqual(42)

    expect(utils.type(42)).toEqual('number')
    expect(utils.type('str')).toEqual('string')
    expect(utils.type([1,2,3])).toEqual('array')
    expect(utils.type({a:1})).toEqual('object')
    expect(utils.type(utils.identity)).toEqual('function')

  it "utils", ->
    expect(utils.identity(42)).toEqual(42)

    expect(utils.type(42)).toEqual('number')
    expect(utils.type('str')).toEqual('string')
    expect(utils.type([1,2,3])).toEqual('array')
    expect(utils.type({a:1})).toEqual('object')
    expect(utils.type(utils.identity)).toEqual('function')

    expect(utils.mergeLists({}, {})).toEqual({})
    expect(utils.mergeLists({a:[1,2]}, {a:[3]})).toEqual({a:[1,2,3]})

    testArgs = ()->
      utils.argsArray.apply(null, arguments)
    expect(testArgs(1,2,3)).toEqual([1,2,3])

  it "url utils", ->
    expect(utils.absoluteUrl("BASE", "Patient/123")).toEqual("BASE/Patient/123")
    expect(utils.relativeUrl("BASE", "BASE/Patient/123")).toEqual("Patient/123")
    expect(utils.absoluteUrl("BASE", "BASE/Patient/123")).toEqual("BASE/Patient/123")
    expect(utils.relativeUrl("BASE", "Patient/123")).toEqual("Patient/123")

  it "resourceIdToUrl", ->
    subj = utils.resourceIdToUrl
    expect(subj("BASE/Patient/123", "BASE", "Patient"))
      .toEqual("BASE/Patient/123")

    expect(subj("Patient/123", "BASE", "Patient"))
      .toEqual("BASE/Patient/123")

    expect(subj("/Patient/123", "BASE", "Patient"))
      .toEqual("BASE/Patient/123")

    expect(subj("123", "BASE", "Patient"))
      .toEqual("BASE/Patient/123")


