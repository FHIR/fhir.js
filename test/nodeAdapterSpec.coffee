http = require("http");
assert = require('assert')

responses =
  '_defaults':
    'status': 200
    'headers': 'Content-Type': 'application/json'
  'GET /': 'body': 'Hello server'
  'GET /fhir': 'body': 'Hello server'
  'POST /node_test/Patient':
    'body':
      'resourceType': 'Patient'
      'name': [ {
        'family': [ 'Fhirjs' ]
        'given': [ 'Node' ]
      } ]
      'birthDate': '1990-06-20'
    'headers': 'Content-Location': '/node_test/Patient/1'
    'status': 201
  'GET /node_test/Patient?name=adams&_id=123':
    'body':
      entry: [
        'resourceType': 'Patient'
        'name': [ {
          'family': [ 'Fhirjs' ]
          'given': [ 'Node' ]
        } ]
        'birthDate': '1990-06-20'
      ]
    'headers': 'Content-Type': 'application/json'
    'status': 200


server = http.createServer (request, response) ->
  defaults = responses._defaults
  key = "#{request.method} #{request.url}"
  resp = responses[key] || {
    body: "#{key} not found"
    status: 404
  }
  response.writeHead(resp.status || defaults.status, resp.headers || defaults.headers)
  response.write((resp.body && JSON.stringify(resp.body)) || "")
  response.end()

server.listen(8976)
fhir = require('../src/adapters/node')

new_pt =
  resource:
    resourceType: 'Patient'
    name: [ {
      family: [ 'Fhirjs' ]
      given: [ 'Node' ]
    }]
    birthDate: '1990-06-20'

describe "nodejs adapter", ->

  @timeout(10000)

  subject = fhir(baseUrl: 'http://localhost:8976/node_test', patient: '123', auth: {user: 'client', pass: 'secret'})

  it "create", ()->
    fail = (err)-> throw new Error(JSON.stringify(err))
    success = (res)->
      return res

    subject.create(new_pt).then(success, fail)

  it "search", ()->
    fail = (err)-> throw new Error(JSON.stringify(err))

    success =  (res)->
      try
        assert(res)
        assert(res.data.entry.length >= 1)
        return res
      catch e
        throw e

    subject.search({type: 'Patient', query: {name: 'adams'}}).then(success, fail)
   it "should return 500 if host unreachable", (done)->
      subject = fhir(baseUrl: 'http://wwww.exampleinvalidqqq.com/', patient: '123', auth: {user: 'client', pass: 'secret'})

      unexpectedSuccess = (res)-> done(new Error("Should fail, but got #{JSON.stringify(res)}"))

      expectedFail =  (err)->
        try
          assert(err)
          assert(err.status == 500)
          done()
        catch e
          done(e)

      subject.search({type: 'Patient', query: {name: 'adams'}}).then(unexpectedSuccess, expectedFail)
      null
