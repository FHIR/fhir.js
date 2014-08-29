base = require('../coffee/adapter.coffee')
mod = require('../coffee/search.coffee')

nop = ()->

describe "search:", ->
  subject = mod

  it "api", ->
    expect(subject.search).not.toBe(null)

  it "search", (done)->
    adapter =
      xhr: (q)-> console.log('xhr', q); done()
    base.setAdapter(adapter)
    subject.search('Patient', {name: 'maud'}, nop, nop)
