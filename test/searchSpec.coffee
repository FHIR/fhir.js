subject = require('../coffee/search.coffee')
patientBundle = require('../fixtures/patientBundle.js')

nop = ()->

describe "search:", ->
  it "search success", (done)->
    http = (q)->
      expect(q.method).toBe('GET')
      expect(q.url).toBe('BASE/Patient/_search?name=maud')
      done()

    subject.search('BASE', http, 'Patient', {name: 'maud'}, nop, nop)

  it "search error", (done)->
    err = (e)->
      expect(e).toBe('error')
      done()

    http = (q)-> q.error('error')

    subject.search('BASE', http, 'Patient', {name: 'maud'}, nop, err)

  it "fetch prev page fails when no link is available", (done)->
    err = (msg)-> done()
    subject.prev('BASE', nop, patientBundle, nop, err)

  it "fetch next page suceeds", (done)->
    http = (q)->
      expect(q.method).toBe('GET')
      expect(q.url).toBe('BASE/Patient?_count=1&_skip=1')
      console.log('finishing')
      done()

    subject.next('BASE', http, patientBundle, nop, (e)->console.log("ERR",e))
