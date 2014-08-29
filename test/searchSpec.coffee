base = require('../coffee/adapter.coffee')
mod = require('../coffee/search.coffee')

adapter = { xhr: (q)-> console.log('xhr', q)}

base.setAdapter(adapter)
nop = ()->
mod.search('Patient', {name: 'maud'}, nop, nop)

# describe "search:", ->
#   subject = mod

#   it "api", ->
#     expect(subject.search).not.toBe(null)

#   it "search", ->
#     console.log(subject.search('Patient'))
