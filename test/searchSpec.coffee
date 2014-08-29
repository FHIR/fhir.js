mod = require('../coffee/search.coffee')

describe "search:", ->
  subject = mod

  it "api", ->
    expect(subject.search).not.toBe(null)
