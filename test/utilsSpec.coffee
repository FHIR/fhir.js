utils = require('../coffee/utils.coffee')

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

