fhir = require '../src/fhir'
assert = require 'assert'

describe "Config Middleware", ->
  describe "End to End", ->
    beforeEach ->
      @adapter =
        http: ( (x) -> x.then = ( (f)-> f(x) ) )
        defer: ->
          reject: (e) ->
            console.log "Rejected Promise"
            throw new Error e

    describe "Headers", ->
      it "when headers provided, they are exposed to adapter", ->
        cfg = baseUrl: 'BASE', headers: 'X-Custom-Header': 'value'
        fhirClient = fhir cfg, @adapter

        http = (args) ->
          assert.equal args.headers['X-Custom-Header'], "value"

        fhirClient.conformance http: http
